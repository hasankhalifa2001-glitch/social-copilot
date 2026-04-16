/* eslint-disable @typescript-eslint/no-explicit-any */

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
