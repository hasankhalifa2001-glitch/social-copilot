/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToPinterest({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);

    const response = await fetch("https://api.pinterest.com/v5/pins", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: post.title || post.content.substring(0, 100),
            description: post.content,
            board_id: post.boardId || account.platformUserId, // Should be selected by user
            media_source: {
                source_type: "image_url",
                url: post.imageUrl || post.mediaUrl,
            },
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("Pinterest API error:", result);
        throw new Error(result.message || "Failed to publish to Pinterest");
    }

    return { platformPostId: result.id };
}

export async function fetchPinterestAnalytics(accessToken: string) {
    const response = await fetch(
        "https://api.pinterest.com/v5/user_account/analytics?start_date=2024-01-01&end_date=2024-12-31&statistics=METRIC_NAME",
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch Pinterest analytics");

    // Simplified for now, Pinterest analytics is complex
    return {
        followers: 0,
        impressions: 0,
        engagements: 0,
    };
}
