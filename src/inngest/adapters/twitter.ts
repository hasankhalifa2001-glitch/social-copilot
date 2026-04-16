/* eslint-disable @typescript-eslint/no-explicit-any */
import { TwitterApi } from "twitter-api-v2";



export async function fetchTwitterComments(accessToken: string, username: string) {
    const response = await fetch(
        `https://api.x.com/2/tweets/search/recent?query=@${username}&tweet.fields=author_id,created_at`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to fetch Twitter comments");

    return (data.data || []).map((tweet: any) => ({
        id: tweet.id,
        text: tweet.text,
        username: tweet.author_id, // Twitter API v2 search returns author_id by default
    }));
}

export async function replyToTwitterComment(accessToken: string, tweetId: string, text: string) {
    const response = await fetch("https://api.x.com/2/tweets", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text,
            reply: { in_reply_to_tweet_id: tweetId },
        }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to reply on Twitter");
    return data.data;
}

export async function fetchTwitterAnalytics(accessToken: string, userId: string) {
    const response = await fetch(
        `https://api.x.com/2/users/${userId}?user.fields=public_metrics`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "Failed to fetch Twitter analytics");

    const metrics = data.data.public_metrics;
    return {
        followers: metrics.followers_count,
        impressions: 0, // Twitter API v2 requires special permissions/endpoints for impressions
        engagements: 0,
    };
}

export async function publishToTwitter({ post, account }: { post: any; account: any }) {
    const client = new TwitterApi(account.accessToken);

    const mediaIds: string[] = [];

    if (post.mediaUrls && post.mediaUrls.length > 0) {
        for (const url of post.mediaUrls) {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Determine mime type from URL or response headers if possible
            // For simplicity, we'll try to detect or use a default
            const mediaId = await client.v1.uploadMedia(buffer, { type: url.endsWith(".mp4") ? "video/mp4" : "image/jpeg" });
            mediaIds.push(mediaId);
        }
    }

    const { data: tweet } = await client.v2.tweet({
        text: post.content,
        ...(mediaIds.length > 0
            ? { media: { media_ids: mediaIds.slice(0, 4) as [string] | [string, string] | [string, string, string] | [string, string, string, string] } }
            : {}),
    });

    return { platformPostId: tweet.id };
}
