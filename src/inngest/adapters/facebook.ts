/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToFacebook({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    console.log(`Publishing to Facebook: ${post.content}`);
    return { platformPostId: "fb_" + Math.random().toString(36).substr(2, 9) };
}

export async function fetchFacebookComments(accessToken: string, pageId: string) {
    const response = await fetch(
        `https://graph.facebook.com/v19.0/${pageId}/feed?fields=comments&access_token=${accessToken}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Failed to fetch Facebook comments");

    const allComments: any[] = [];
    const posts = data.data || [];

    for (const post of posts) {
        if (post.comments && post.comments.data) {
            allComments.push(...post.comments.data.map((c: any) => ({
                id: c.id,
                text: c.message,
                username: c.from?.name || "Anonymous",
            })));
        }
    }

    return allComments;
}

export async function replyToFacebookComment(accessToken: string, commentId: string, text: string) {
    const response = await fetch(
        `https://graph.facebook.com/v19.0/${commentId}/comments`,
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
    if (!response.ok) throw new Error(data.error?.message || "Failed to reply on Facebook");
    return data;
}

export async function fetchFacebookAnalytics(accessToken: string, pageId: string) {
    const response = await fetch(
        `https://graph.facebook.com/v19.0/${pageId}?fields=fan_count,talking_about_count&access_token=${accessToken}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Failed to fetch Facebook analytics");

    return {
        followers: data.fan_count,
        impressions: 0,
        engagements: data.talking_about_count,
    };
}
