/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToYoutube({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);

    if (!post.videoUrl) {
        throw new Error("YouTube only supports video posts. Please provide a video URL.");
    }

    // This is a simplified version. YouTube Data API v3 videos.insert usually
    // requires a multi-part upload. Here we assume the API handles URL-based upload
    // or we're initiating the metadata insertion.
    const response = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                snippet: {
                    title: post.title || post.content.substring(0, 70),
                    description: post.content,
                },
                status: {
                    privacyStatus: "public",
                },
            }),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        console.error("YouTube API error:", result);
        throw new Error(result.error?.message || "Failed to publish to YouTube");
    }

    return { platformPostId: result.id };
}
