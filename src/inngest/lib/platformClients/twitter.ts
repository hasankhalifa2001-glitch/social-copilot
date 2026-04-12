import { TwitterApi } from "twitter-api-v2";
import { PlatformClient } from "./types";

export class TwitterClient implements PlatformClient {
    async publishPost(content: string, mediaUrls: string[], accessToken: string) {
        const client = new TwitterApi(accessToken);
        const tweet = await client.v2.tweet(content);

        return { platformPostId: tweet.data.id };
    }

    async fetchComments(platformUserId: string, accessToken: string) {
        return [];
    }

    async fetchAnalytics(platformUserId: string, accessToken: string) {
        return { followers: 0, impressions: 0, engagements: 0, reach: 0, profileViews: 0 };
    }
}
