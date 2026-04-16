/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToInstagram({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    const igUserId = account.platformUserId;

    // Step 1: Create media container
    // Note: Instagram requires an image or video URL for a media container.
    // If no image is provided, this will likely fail or require a placeholder.
    const createContainerResponse = await fetch(
        `https://graph.facebook.com/v19.0/${igUserId}/media`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                caption: post.content,
                image_url: post.imageUrl || post.mediaUrl, // Assuming one of these might be present
                access_token: accessToken,
            }),
        }
    );

    const containerResult = await createContainerResponse.json();

    if (!createContainerResponse.ok) {
        console.error("Instagram Container API error:", containerResult);
        throw new Error(
            containerResult.error?.message || "Failed to create Instagram media container"
        );
    }

    const creationId = containerResult.id;

    // Step 2: Publish the media container
    const publishResponse = await fetch(
        `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                creation_id: creationId,
                access_token: accessToken,
            }),
        }
    );

    const publishResult = await publishResponse.json();

    if (!publishResponse.ok) {
        console.error("Instagram Publish API error:", publishResult);
        throw new Error(publishResult.error?.message || "Failed to publish to Instagram");
    }

    return { platformPostId: publishResult.id };
}


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
