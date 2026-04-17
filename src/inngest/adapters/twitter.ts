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
    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${account.accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: post.content,
            card_uri: post.cardUri,
            community_id: post.communityId,
            direct_message_deep_link: post.dmDeepLink,
            for_super_followers_only: post.forSuperFollowersOnly || false,
            geo: post.geo ? { place_id: post.geo.placeId } : undefined,
            made_with_ai: post.madeWithAi ?? true,
            nullcast: post.nullcast || false,
            paid_partnership: post.paidPartnership || false,
            quote_tweet_id: post.quoteTweetId,
            reply_settings: post.replySettings,
            share_with_followers: post.shareWithFollowers ?? true,
        })
    };

    try {
        const response = await fetch('https://api.x.com/2/tweets', options);
        const data = await response.json();

        if (!response.ok) {
            console.error("Twitter API Error Response:", data);
            if (response.status === 403) {
                throw new Error("فشل النشر: تأكد من صلاحيات Write في تطبيقك أو حدود اشتراكك.");
            }
            if (response.status === 429) {
                throw new Error("تم تجاوز حد النشر المسموح به (Rate Limit). حاول لاحقاً.");
            }
            throw new Error(data.detail || data.message || "Failed to publish to Twitter");
        }

        console.log("Tweet published successfully:", data.data.id);

        return {
            platformPostId: data.data.id,
            status: "success"
        };
    } catch (error: any) {
        console.error("Error publishing to Twitter:", error);
        throw error;
    }
}
