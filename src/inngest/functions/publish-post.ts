/* eslint-disable @typescript-eslint/no-explicit-any */
import { inngest } from "../client";
import { db } from "@/lib/db";
import { posts, postPlatformResults, connectedAccounts } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { publishToTwitter } from "../adapters/twitter";
import { publishToLinkedin } from "../adapters/linkedin";
import { publishToFacebook } from "../adapters/facebook";
import { publishToInstagram } from "../adapters/instagram";
import { publishToTiktok } from "../adapters/tiktok";
import { publishToYoutube } from "../adapters/youtube";
import { publishToPinterest } from "../adapters/pinterest";
import { publishToDiscord } from "../adapters/discord";
import { publishToSlack } from "../adapters/slack";
import { getValidAccessToken } from "@/lib/token-refresh";

const ADAPTERS: Record<string, (args: { post: any; account: any }) => Promise<{ platformPostId: string }>> = {
    twitter: publishToTwitter,
    linkedin: publishToLinkedin,
    facebook: publishToFacebook,
    instagram: publishToInstagram,
    tiktok: publishToTiktok,
    youtube: publishToYoutube,
    pinterest: publishToPinterest,
    discord: publishToDiscord,
    slack: publishToSlack,
};

export const publishPost = inngest.createFunction(
    { id: "publish-post", triggers: { event: "post/scheduled" }, },

    async ({ event, step }) => {
        const { postId, scheduledAt } = event.data;

        await step.sleepUntil("wait-for-scheduled-time", scheduledAt);

        const post = await step.run("fetch-post", async () => {
            return await db.query.posts.findFirst({
                where: eq(posts.id, postId),
                with: {
                    user: {
                        with: {
                            connectedAccounts: true,
                        },
                    },
                },
            });
        });


        if (!post) return { error: "Post not found" };
        // if (post.status === "published")  { message: "Post already published" };

        const platformsToPublish = post.platforms as string[];
        const results: {
            platform: string;
            status: string;
            platformPostId?: string;
            error?: string;
        }[] = [];

        for (const platform of platformsToPublish) {
            const result = await step.run(`publish-${platform}`, async () => {
                const account = post.user.connectedAccounts.find(
                    (acc: any) => acc.platform === platform && acc.isActive
                );

                console.log(account)

                if (!account) {
                    return { platform, status: "failed", error: "Account not connected or inactive" };
                }

                const adapter = ADAPTERS[platform];
                if (!adapter) {
                    return { platform, status: "failed", error: "No adapter found for platform" };
                }

                console.log(adapter)

                try {
                    const validAccessToken = await getValidAccessToken(account);

                    console.log(validAccessToken)

                    // Handle per-platform content customization
                    let contentObj = post.content;

                    // Safely parse JSON string if it's a string starting with {
                    if (typeof post.content === "string" && post.content.trim().startsWith("{")) {
                        try {
                            contentObj = JSON.parse(post.content);
                        } catch (e) {
                            console.error("Failed to parse post content JSON:", e);
                        }
                    }

                    let platformSpecificContent = "";

                    if (typeof contentObj === "object" && contentObj !== null) {
                        platformSpecificContent = (contentObj as Record<string, string>)[platform] || (contentObj as Record<string, string>).base || "";
                    } else if (typeof contentObj === "string") {
                        platformSpecificContent = contentObj;
                    }

                    console.log(platformSpecificContent)

                    const { platformPostId } = await adapter({
                        post: { ...post, content: platformSpecificContent },
                        account: { ...account, accessToken: validAccessToken },
                    });

                    console.log(platformPostId)
                    return { platform, status: "published", platformPostId };
                } catch (error: any) {
                    return { platform, status: "failed", error: error.message };
                }
            });


            console.log(result)

            results.push(result);

            await step.run(`upsert-result-${platform}`, async () => {
                await db.insert(postPlatformResults).values({
                    postId: post.id,
                    platform: platform as any,
                    platformPostId: ("platformPostId" in result ? result.platformPostId : null),
                    status: result.status as any,
                    errorMessage: ("error" in result ? result.error : null),
                    publishedAt: result.status === "published" ? new Date() : null,
                });
            });
        }

        const allSuccessful = results.every((r) => r.status === "published");
        const someSuccessful = results.some((r) => r.status === "published");

        await step.run("update-post-status", async () => {
            await db
                .update(posts)
                .set({
                    status: allSuccessful ? "published" : someSuccessful ? "published" : "failed",
                    publishedAt: someSuccessful ? new Date() : null,
                })
                .where(eq(posts.id, post.id));
        });

        return { results };
    }
);
