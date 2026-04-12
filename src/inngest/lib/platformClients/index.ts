import { TwitterClient } from "./twitter";
import { InstagramClient } from "./instagram";
import { LinkedInClient } from "./linkedin";
import { PlatformClient, PlatformType } from "./types";

export function getPlatformClient(platform: PlatformType): PlatformClient {
    switch (platform) {
        case "twitter":
            return new TwitterClient();
        case "instagram":
        case "facebook":
            return new InstagramClient();
        case "linkedin":
            return new LinkedInClient();
        default:
            throw new Error(`Platform ${platform} not supported`);
    }
}
