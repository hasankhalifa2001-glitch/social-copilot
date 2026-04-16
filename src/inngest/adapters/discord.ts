/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/lib/env";

export async function publishToDiscord({ post, account }: { post: any; account: any }) {
    const channelId = account.platformUserId;

    if (!env.DISCORD_BOT_TOKEN) {
        throw new Error("DISCORD_BOT_TOKEN is not configured");
    }

    const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
            Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: post.content,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("Discord API error:", result);
        throw new Error(result.message || "Failed to publish to Discord");
    }

    return { platformPostId: result.id };
}
