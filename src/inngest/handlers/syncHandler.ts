/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { connectedAccounts, analyticsSnapshots } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/crypto";
import { getPlatformClient } from "../lib/platformClients";
import { startOfDay } from "date-fns";

export async function handleSyncAnalytics(step: any) {
    const accounts = await step.run("fetch-active-accounts", async () => {
        return await db.query.connectedAccounts.findMany({
            where: eq(connectedAccounts.isActive, true),
        });
    });

    for (const account of accounts) {
        await step.run(`sync-account-${account.id}`, async () => {
            const accessToken = decrypt(account.accessToken);
            const client = getPlatformClient(account.platform);

            const metrics = await client.fetchAnalytics(account.platformUserId, accessToken);
            const today = startOfDay(new Date());

            // Upsert daily snapshot
            // Note: Drizzle's onConflictDoUpdate requires a unique constraint
            // We'll use a manual check or rely on the DB constraint if configured
            const existing = await db.query.analyticsSnapshots.findFirst({
                where: and(
                    eq(analyticsSnapshots.connectedAccountId, account.id),
                    eq(analyticsSnapshots.date, today)
                ),
            });

            if (existing) {
                await db.update(analyticsSnapshots)
                    .set({
                        followers: metrics.followers,
                        impressions: metrics.impressions,
                        engagements: metrics.engagements,
                        reach: metrics.reach,
                        profileViews: metrics.profileViews,
                    })
                    .where(eq(analyticsSnapshots.id, existing.id));
            } else {
                await db.insert(analyticsSnapshots).values({
                    userId: account.userId,
                    connectedAccountId: account.id,
                    platform: account.platform,
                    date: today,
                    followers: metrics.followers,
                    impressions: metrics.impressions,
                    engagements: metrics.engagements,
                    reach: metrics.reach,
                    profileViews: metrics.profileViews,
                });
            }
        });
    }
}
