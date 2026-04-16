/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchInstagramComments(accessToken: string, igUserId: string) {
    // Note: To fetch all comments for a user, we'd need to fetch media first, then comments.
    // For simplicity and following the instructions: GET /{media-id}/comments
    // Here we'll fetch recent media first to get media IDs.
    const mediaResponse = await fetch(
        `https://graph.facebook.com/v19.0/${igUserId}/media?access_token=${accessToken}`
    );
    const mediaData = await mediaResponse.json();
    if (!mediaResponse.ok) throw new Error(mediaData.error?.message || "Failed to fetch Instagram media");

    const allComments: any[] = [];
    const recentMedia = mediaData.data?.slice(0, 5) || [];

    for (const media of recentMedia) {
        const commentsResponse = await fetch(
            `https://graph.facebook.com/v19.0/${media.id}/comments?access_token=${accessToken}`
        );
        const commentsData = await commentsResponse.json();
        if (commentsResponse.ok && commentsData.data) {
            allComments.push(...commentsData.data.map((c: any) => ({
                id: c.id,
                text: c.text,
                username: c.username,
            })));
        }
    }

    return allComments;
}

export async function replyToInstagramComment(accessToken: string, commentId: string, text: string) {
    const response = await fetch(
        `https://graph.facebook.com/v19.0/${commentId}/replies`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: text,
                access_token: accessToken,
            }),
        }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Failed to reply on Instagram");
    return data;
}

export async function fetchInstagramAnalytics(accessToken: string, igUserId: string) {
    const response = await fetch(
        `https://graph.facebook.com/v19.0/${igUserId}?fields=followers_count,media_count&access_token=${accessToken}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Failed to fetch Instagram analytics");

    return {
        followers: data.followers_count,
        impressions: 0,
        engagements: 0,
    };
}
