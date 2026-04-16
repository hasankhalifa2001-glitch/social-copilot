import { inngest } from "../client";
import { db } from "@/lib/db";
import { connectedAccounts, analyticsSnapshots } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getValidAccessToken } from "@/lib/token-refresh";
import { fetchTwitterAnalytics } from "../adapters/twitter";
import { fetchInstagramAnalytics } from "../adapters/instagram";
import { fetchFacebookAnalytics } from "../adapters/facebook";
import { fetchYoutubeAnalytics } from "../adapters/youtube";
import { fetchLinkedinAnalytics } from "../adapters/linkedin";
import { fetchPinterestAnalytics } from "../adapters/pinterest";

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
                const accessToken = await getValidAccessToken(account as Parameters<typeof getValidAccessToken>[0]);

                let analyticsData = {
                    followers: 0,
                    impressions: 0,
                    engagements: 0,
                };

                try {
                    switch (account.platform) {
                        case "twitter":
                            analyticsData = await fetchTwitterAnalytics(accessToken, account.platformUserId);
                            break;
                        case "instagram":
                            analyticsData = await fetchInstagramAnalytics(accessToken, account.platformUserId);
                            break;
                        case "facebook":
                            analyticsData = await fetchFacebookAnalytics(accessToken, account.platformUserId);
                            break;
                        case "youtube":
                            analyticsData = await fetchYoutubeAnalytics(accessToken);
                            break;
                        case "linkedin":
                            analyticsData = await fetchLinkedinAnalytics(accessToken, account.platformUserId);
                            break;
                        case "pinterest":
                            analyticsData = await fetchPinterestAnalytics(accessToken);
                            break;
                        default:
                            console.log(`Analytics not supported for platform: ${account.platform}`);
                            return;
                    }
                } catch (error) {
                    console.error(`Error syncing analytics for ${account.platform}:`, error);
                    return;
                }

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
