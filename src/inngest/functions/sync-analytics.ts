import { inngest } from "../client";
import { db } from "@/lib/db";
import { connectedAccounts, analyticsSnapshots } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/crypto";

export const syncAnalytics = inngest.createFunction(
    { id: "sync-analytics", triggers: { cron: "0 */6 * * *" }, },

    async ({ step }) => {
        const accounts = await step.run("fetch-accounts", async () => {
            return await db.query.connectedAccounts.findMany({
                where: eq(connectedAccounts.isActive, true),
            });
        });

        for (const account of accounts) {
            await step.run(`sync-account-${account.id}`, async () => {
                const accessToken = decrypt(account.accessToken);

                // Simulate fetching analytics from platform API
                const analyticsData = {
                    followers: Math.floor(Math.random() * 10000),
                    impressions: Math.floor(Math.random() * 50000),
                    engagements: Math.floor(Math.random() * 5000),
                };

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                await db.insert(analyticsSnapshots).values({
                    userId: account.userId,
                    connectedAccountId: account.id,
                    platform: account.platform,
                    date: today,
                    followers: analyticsData.followers,
                    impressions: analyticsData.impressions,
                    engagements: analyticsData.engagements,
                });
            });
        }
    }
);
