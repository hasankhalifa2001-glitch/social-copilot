/* eslint-disable @typescript-eslint/no-explicit-any */
import { TwitterApi } from "twitter-api-v2";
import { PlatformClient } from "./types";

export class TwitterClient implements PlatformClient {
    async publishPost(content: string, mediaUrls: string[], accessToken: string) {
        try {
            const client = new TwitterApi(accessToken);
            let mediaIds: string[] = [];

            // 1. معالجة الصور إذا وجدت
            if (mediaUrls && mediaUrls.length > 0) {
                mediaIds = await Promise.all(
                    mediaUrls.map(url => client.v1.uploadMedia(url)) // رفع الصور لتويتر
                );
            }

            // 2. النشر الفعلي
            const tweet = await client.v2.tweet({
                text: content,
                ...(mediaIds.length > 0 && { media: { media_ids: mediaIds as [string] } })
            });

            return { platformPostId: tweet.data.id };

        } catch (error: any) {
            // 3. تحليل الخطأ (مثلاً لو التوكن غلط)
            console.error("Twitter Publish Error:", error);
            throw new Error(error.data?.detail || "Failed to publish to Twitter");
        }
    }

    async fetchComments(platformUserId: string, accessToken: string) {
        return [];
    }

    async fetchAnalytics(platformUserId: string, accessToken: string) {
        return { followers: 0, impressions: 0, engagements: 0, reach: 0, profileViews: 0 };
    }
}
