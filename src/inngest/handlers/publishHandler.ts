/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { posts, connectedAccounts, postPlatformResults } from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { decrypt } from "@/lib/crypto";
import { getPlatformClient } from "../lib/platformClients";
import { PlatformType } from "../lib/platformClients/types";

export async function handlePublishPost(postId: string, step: any) {
    const post = await step.run("fetch-post-data", async () => {
        return await db.query.posts.findFirst({
            where: eq(posts.id, postId),
        });
    });

    if (!post) throw new Error("Post not found");
    if (post.status === "published") return { message: "Post already published" };

    const selectedPlatforms = post.platforms as PlatformType[];

    const accounts = await step.run("fetch-accounts", async () => {
        return await db.query.connectedAccounts.findMany({
            where: and(
                eq(connectedAccounts.userId, post.userId),
                inArray(connectedAccounts.platform, selectedPlatforms),
                eq(connectedAccounts.isActive, true)
            ),
        });
    });

    const results: {
        platform: PlatformType;
        status: "published" | "failed";
        platformPostId?: string;
        error?: string;
    }[] = [];

    for (const platform of selectedPlatforms) {
        const account = accounts.find((a: { platform: PlatformType }) => a.platform === platform);

        if (!account) {
            results.push({ platform, status: "failed" as const, error: "Account not connected or inactive" });
            continue;
        }

        const publishResult = await step.run(`publish-to-${platform}`, async () => {
            try {
                const accessToken = decrypt(account.accessToken);
                const client = getPlatformClient(platform);
                const { platformPostId } = await client.publishPost(post.content, post.mediaUrls as string[], accessToken);

                await db.insert(postPlatformResults).values({
                    postId: post.id,
                    platform,
                    platformPostId,
                    status: "published",
                    publishedAt: new Date(),
                });

                return { platform, status: "published" as const, platformPostId };
            } catch (error: unknown) {
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                await db.insert(postPlatformResults).values({
                    postId: post.id,
                    platform,
                    status: "failed",
                    errorMessage,
                });
                return { platform, status: "failed" as const, error: errorMessage };
            }
        });

        results.push(publishResult);
    }

    await step.run("update-final-status", async () => {
        const allFailed = results.every(r => r.status === "failed");

        let finalStatus: "published" | "failed" = "published";
        if (allFailed) finalStatus = "failed";

        await db.update(posts)
            .set({
                status: finalStatus,
                publishedAt: finalStatus === "published" ? new Date() : null,
                updatedAt: new Date()
            })
            .where(eq(posts.id, postId));
    });

    return { results };
}
