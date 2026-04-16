/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToTiktok({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);

    const response = await fetch("https://open.tiktokapis.com/v2/post/publish/content/init/", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
            post_info: {
                title: post.content.substring(0, 100), // TikTok title limit
                text: post.content,
            },
            source_info: {
                source: "PULL_FROM_URL",
                video_url: post.videoUrl, // TikTok typically requires a video
            },
            post_config: {
                privacy_level: "PUBLIC_TO_EVERYONE",
            },
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("TikTok API error:", result);
        throw new Error(result.error?.message || "Failed to publish to TikTok");
    }

    return { platformPostId: result.data?.publish_id || "tiktok_pending" };
}
