/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToFacebook({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    const pageId = account.platformUserId;

    const response = await fetch(`https://graph.facebook.com/${pageId}/feed`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: post.content,
            access_token: accessToken,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("Facebook API error:", result);
        throw new Error(result.error?.message || "Failed to publish to Facebook");
    }

    return { platformPostId: result.id };
}
