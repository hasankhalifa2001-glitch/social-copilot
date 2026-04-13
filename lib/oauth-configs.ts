import { env } from "@/lib/env";

export type Platform =
    | "twitter"
    | "linkedin"
    | "facebook"
    | "instagram"
    | "tiktok"
    | "youtube"
    | "pinterest"
    | "discord"
    | "slack";

export interface PlatformConfig {
    clientId: string;
    clientSecret: string;
    authorizeUrl: string;
    tokenUrl: string;
    profileUrl: string;
    scopes: string[];
    useCodeChallenge?: boolean;
    additionalParams?: Record<string, string>;
}

export const OAUTH_CONFIG: Record<Platform, PlatformConfig> = {
    twitter: {
        clientId: env.TWITTER_CLIENT_ID,
        clientSecret: env.TWITTER_CLIENT_SECRET,
        authorizeUrl: "https://twitter.com/i/oauth2/authorize",
        tokenUrl: "https://api.twitter.com/2/oauth2/token",
        profileUrl: "https://api.twitter.com/2/users/me?user.fields=profile_image_url",
        scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
        useCodeChallenge: true,
    },
    linkedin: {
        clientId: env.LINKEDIN_CLIENT_ID,
        clientSecret: env.LINKEDIN_CLIENT_SECRET,
        authorizeUrl: "https://www.linkedin.com/oauth/v2/authorization",
        tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
        profileUrl: "https://api.linkedin.com/v2/userinfo", // Using userinfo for better compatibility with newer LinkedIn API
        scopes: ["openid", "profile", "email", "w_member_social"],
    },
    facebook: {
        clientId: env.META_APP_ID,
        clientSecret: env.META_APP_SECRET,
        authorizeUrl: "https://www.facebook.com/v19.0/dialog/oauth",
        tokenUrl: "https://graph.facebook.com/v19.0/oauth/access_token",
        profileUrl: "https://graph.facebook.com/me?fields=id,name,picture",
        scopes: ["public_profile", "email", "pages_show_list", "pages_read_engagement", "pages_manage_posts"],
    },
    instagram: {
        clientId: env.META_APP_ID,
        clientSecret: env.META_APP_SECRET,
        authorizeUrl: "https://www.facebook.com/v19.0/dialog/oauth",
        tokenUrl: "https://graph.facebook.com/v19.0/oauth/access_token",
        profileUrl: "https://graph.facebook.com/me/accounts?fields=instagram_business_account{id,username,profile_picture_url}",
        scopes: ["public_profile", "instagram_basic", "instagram_content_publish", "pages_show_list", "pages_read_engagement"],
    },
    tiktok: {
        clientId: env.TIKTOK_CLIENT_KEY,
        clientSecret: env.TIKTOK_CLIENT_SECRET,
        authorizeUrl: "https://www.tiktok.com/v2/auth/authorize/",
        tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
        profileUrl: "https://open.tiktokapis.com/v2/user/info/",
        scopes: ["user.info.basic", "video.upload", "video.publish"],
        additionalParams: {
            client_key: env.TIKTOK_CLIENT_KEY,
        }
    },
    youtube: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        profileUrl: "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
        scopes: ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly", "openid", "profile"],
        additionalParams: {
            access_type: "offline",
            prompt: "consent",
        }
    },
    pinterest: {
        clientId: env.PINTEREST_APP_ID,
        clientSecret: env.PINTEREST_APP_SECRET,
        authorizeUrl: "https://www.pinterest.com/oauth/",
        tokenUrl: "https://api.pinterest.com/v5/oauth/token",
        profileUrl: "https://api.pinterest.com/v5/user_account",
        scopes: ["user_accounts:read", "pins:read", "pins:write", "boards:read", "boards:write"],
    },
    discord: {
        clientId: "", // Not needed for bot-only as per instructions, but keeping structure
        clientSecret: "",
        authorizeUrl: "",
        tokenUrl: "",
        profileUrl: "https://discord.com/api/v10/users/@me",
        scopes: ["identify", "guilds"],
    },
    slack: {
        clientId: env.SLACK_CLIENT_ID,
        clientSecret: env.SLACK_CLIENT_SECRET,
        authorizeUrl: "https://slack.com/oauth/v2/authorize",
        tokenUrl: "https://slack.com/api/oauth.v2.access",
        profileUrl: "https://slack.com/api/users.identity",
        scopes: ["incoming-webhook", "chat:write", "commands"],
    },
};
