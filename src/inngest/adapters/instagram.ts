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
