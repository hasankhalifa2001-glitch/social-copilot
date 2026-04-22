/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToLinkedin({ post, account }: { post: any; account: any }) {
    const accessToken = account.accessToken;
    const author = `urn:li:person:${account.platformUserId}`;

    let mediaAsset = null;
    const imageUrl = post.mediaUrls?.[0];

    if (imageUrl) {
        // Step 1: Register Upload
        const registerRes = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                registerUploadRequest: {
                    recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                    owner: author,
                    serviceRelationships: [
                        {
                            relationshipType: "OWNER",
                            identifier: "urn:li:userGeneratedContent",
                        },
                    ],
                },
            }),
        });

        const registerData = await registerRes.json();
        if (!registerRes.ok) {
            throw new Error(`LinkedIn registerUpload failed: ${JSON.stringify(registerData)}`);
        }

        const uploadUrl = registerData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
        mediaAsset = registerData.value.asset;

        // Step 2: Upload Image
        const imageRes = await fetch(imageUrl);
        const imageBlob = await imageRes.blob();

        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: imageBlob,
        });

        if (!uploadRes.ok) {
            throw new Error(`LinkedIn image upload failed: ${uploadRes.statusText}`);
        }
    }

    const body: any = {
        author,
        lifecycleState: "PUBLISHED",
        specificContent: {
            "com.linkedin.ugc.ShareContent": {
                shareCommentary: {
                    text: post.content,
                },
                shareMediaCategory: mediaAsset ? "IMAGE" : "NONE",
            },
        },
        visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
    };

    if (mediaAsset) {
        body.specificContent["com.linkedin.ugc.ShareContent"].media = [
            {
                status: "READY",
                media: mediaAsset,
            },
        ];
    }

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