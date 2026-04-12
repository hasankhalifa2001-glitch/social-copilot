export interface PlatformComment {
    id: string;
    text: string;
    authorId: string;
    authorName?: string;
    createdAt: string;
    replies?: PlatformComment[];
}

export interface PlatformAnalytics {
    followers: number;
    impressions: number;
    engagements: number;
    reach: number;
    profileViews: number;
}

export interface PlatformClient {
    publishPost(content: string, mediaUrls: string[], accessToken: string): Promise<{ platformPostId: string }>;
    fetchComments(platformUserId: string, accessToken: string): Promise<PlatformComment[]>;
    fetchAnalytics(platformUserId: string, accessToken: string): Promise<PlatformAnalytics>;
}

export type PlatformType = "twitter" | "linkedin" | "facebook" | "instagram" | "tiktok" | "youtube" | "pinterest" | "discord" | "slack";
