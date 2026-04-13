import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/lib/env";
import { OAUTH_CONFIG, Platform } from "@/lib/oauth-configs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { connectedAccounts, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { encrypt } from "@/lib/crypto";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ platform: string }> }
) {
    const { platform } = await params;
    const { userId: clerkId } = await auth();
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (!clerkId) {
        return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/sign-in`);
    }

    if (error) {
        return NextResponse.redirect(
            `${env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=true&message=${searchParams.get(
                "error_description"
            ) || error}`
        );
    }

    const cookieStore = await cookies();
    const savedState = cookieStore.get(`oauth_state_${platform}`)?.value;

    if (!state || state !== savedState) {
        return NextResponse.redirect(
            `${env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=true&message=Invalid state`
        );
    }

    const config = OAUTH_CONFIG[platform as Platform];
    if (!config) {
        return NextResponse.redirect(
            `${env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=true&message=Platform not supported`
        );
    }

    try {
        // 1. Exchange code for tokens
        const redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/oauth/${platform}/callback`;
        const tokenParams = new URLSearchParams({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code: code!,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
        });

        const codeVerifier = cookieStore.get(`oauth_code_verifier_${platform}`)?.value;
        if (codeVerifier) {
            tokenParams.set("code_verifier", codeVerifier);
        }

        // TikTok requires client_key instead of client_id in some places, but here we use what's in config
        if (platform === "tiktok") {
            tokenParams.set("client_key", config.clientId);
        }

        const tokenResponse = await fetch(config.tokenUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body: tokenParams,
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error(`Token exchange error for ${platform}:`, tokenData);
            return NextResponse.redirect(
                `${env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=true&message=Failed to exchange token`
            );
        }

        const accessToken = tokenData.access_token;
        const refreshToken = tokenData.refresh_token || null;
        const expiresAt = tokenData.expires_in
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : null;

        // 2. Fetch user profile
        const profileUrl = config.profileUrl;
        const profileResponse = await fetch(profileUrl, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
            console.error(`Profile fetch error for ${platform}:`, profileData);
            return NextResponse.redirect(
                `${env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=true&message=Failed to fetch profile`
            );
        }

        // 3. Extract profile info based on platform
        let platformUserId = "";
        let platformUsername = "";
        let avatarUrl = "";

        switch (platform) {
            case "twitter":
                platformUserId = profileData.data.id;
                platformUsername = profileData.data.username;
                avatarUrl = profileData.data.profile_image_url;
                break;
            case "linkedin":
                platformUserId = profileData.sub;
                platformUsername = profileData.name;
                avatarUrl = profileData.picture;
                break;
            case "facebook":
                platformUserId = profileData.id;
                platformUsername = profileData.name;
                avatarUrl = profileData.picture?.data?.url;
                break;
            case "instagram":
                // For Instagram, we might need to get the business account ID
                const igAccount = profileData.data?.[0]?.instagram_business_account;
                if (!igAccount) {
                    return NextResponse.redirect(
                        `${env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=true&message=No Instagram Business account found`
                    );
                }
                platformUserId = igAccount.id;
                platformUsername = igAccount.username;
                avatarUrl = igAccount.profile_picture_url;
                break;
            case "tiktok":
                platformUserId = profileData.data.user.open_id;
                platformUsername = profileData.data.user.display_name;
                avatarUrl = profileData.data.user.avatar_url;
                break;
            case "youtube":
                const channel = profileData.items?.[0];
                platformUserId = channel.id;
                platformUsername = channel.snippet.title;
                avatarUrl = channel.snippet.thumbnails.default.url;
                break;
            case "pinterest":
                platformUserId = profileData.username; // Pinterest V5 uses username as unique ID for many things or just has ID
                platformUsername = profileData.username;
                avatarUrl = profileData.profile_image;
                break;
            case "slack":
                platformUserId = profileData.user.id;
                platformUsername = profileData.user.name;
                avatarUrl = profileData.user.image_512;
                break;
        }

        // 4. Save to database
        const user = await db.query.users.findFirst({
            where: eq(users.clerkId, clerkId),
        });

        if (!user) {
            return NextResponse.redirect(
                `${env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=true&message=User not found`
            );
        }

        const encryptedAccessToken = encrypt(accessToken);
        const encryptedRefreshToken = refreshToken ? encrypt(refreshToken) : null;

        await db
            .insert(connectedAccounts)
            .values({
                userId: user.id,
                platform: platform as Platform,
                platformUserId,
                platformUsername,
                avatarUrl,
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
                expiresAt,
                scopes: config.scopes.join(" "),
            })
            .onConflictDoUpdate({
                target: [
                    connectedAccounts.userId,
                    connectedAccounts.platform,
                    connectedAccounts.platformUserId,
                ],
                set: {
                    platformUsername,
                    avatarUrl,
                    accessToken: encryptedAccessToken,
                    refreshToken: encryptedRefreshToken,
                    expiresAt,
                    scopes: config.scopes.join(" "),
                },
            });

        // Clean up cookies
        cookieStore.delete(`oauth_state_${platform}`);
        if (codeVerifier) {
            cookieStore.delete(`oauth_code_verifier_${platform}`);
        }

        return NextResponse.redirect(
            `${env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?success=true`
        );
    } catch (err) {
        console.error(`OAuth callback error for ${platform}:`, err);
        return NextResponse.redirect(
            `${env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=true&message=Internal server error`
        );
    }
}
