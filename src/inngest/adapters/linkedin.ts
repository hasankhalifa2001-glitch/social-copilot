/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToLinkedin({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);

    const body = {
        author: `urn:li:person:${account.platformUserId}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
            "com.linkedin.ugc.ShareContent": {
                shareCommentary: {
                    text: post.content,
                },
                shareMediaCategory: "NONE",
            },
        },
        visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
    };

    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
        console.error("LinkedIn API error:", result);
        throw new Error(result.message || "Failed to publish to LinkedIn");
    }

    return { platformPostId: result.id };
}


export async function fetchLinkedinAnalytics(accessToken: string, personUrn: string) {
    const response = await fetch(
        `https://api.linkedin.com/v2/networkSizes/${personUrn}?edgeType=CompanyFollowedByMember`,
        {
            headers: { Authorization: `Bearer ${accessToken}` },
        }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to fetch LinkedIn analytics");

    return {
        followers: data.firstDegreeSize || 0,
        impressions: 0,
        engagements: 0,
    };
}