import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/lib/env";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { connectedAccounts, users } from "@/lib/db/schema";
import { encrypt } from "@/lib/crypto";
import { eq, and } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: { platform: string } }
) {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { platform } = params;
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/accounts?error=${error}`);
    }

    const cookieStore = await cookies();
    const storedState = cookieStore.get("oauth_state")?.value;

    if (!code || !state || state !== storedState) {
        return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/accounts?error=invalid_state`);
    }

    // Get internal user ID
    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
    });

    if (!user) {
        return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/accounts?error=user_not_found`);
    }

    // Plan limit check (Free users max 2 accounts)
    if (user.plan === "free") {
        const count = await db.query.connectedAccounts.findMany({
            where: eq(connectedAccounts.userId, user.id),
        });
        if (count.length >= 2) {
            return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/accounts?error=plan_limit_reached`);
        }
    }

    try {
        let accessToken = "";
        let refreshToken: string | null = null;
        let expiresAt: Date | null = null;
        let platformUserId = "";
        let platformUsername = "";
        let avatarUrl: string | null = null;

        if (platform === "twitter") {
            const codeVerifier = cookieStore.get("oauth_code_verifier")?.value;
            if (!codeVerifier) {
                return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/accounts?error=missing_verifier`);
            }

            const tokenResponse = await fetch("https://api.twitter.com/2/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(
                        `${env.TWITTER_CLIENT_ID}:${env.TWITTER_CLIENT_SECRET}`
                    ).toString("base64")}`,
                },
                body: new URLSearchParams({
                    code,
                    grant_type: "authorization_code",
                    client_id: env.TWITTER_CLIENT_ID,
                    redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/oauth/twitter/callback`,
                    code_verifier: codeVerifier,
                }),
            });

            const tokens = await tokenResponse.json();
            if (!tokenResponse.ok) throw new Error(tokens.error_description || "Twitter token exchange failed");

            accessToken = tokens.access_token;
            refreshToken = tokens.refresh_token;
            expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

            // Fetch Twitter Profile
            const userResponse = await fetch("https://api.twitter.com/2/users/me?user.fields=profile_image_url", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const userData = await userResponse.json();
            platformUserId = userData.data.id;
            platformUsername = userData.data.username;
            avatarUrl = userData.data.profile_image_url;

        } else if (platform === "linkedin") {
            const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    client_id: env.LINKEDIN_CLIENT_ID,
                    client_secret: env.LINKEDIN_CLIENT_SECRET,
                    redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/oauth/linkedin/callback`,
                }),
            });

            const tokens = await tokenResponse.json();
            if (!tokenResponse.ok) throw new Error(tokens.error_description || "LinkedIn token exchange failed");

            accessToken = tokens.access_token;
            refreshToken = tokens.refresh_token || null;
            expiresAt = tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000) : null;

            // Fetch LinkedIn Profile
            const userResponse = await fetch("https://api.linkedin.com/v2/me", {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const userData = await userResponse.json();
            platformUserId = userData.id;
            platformUsername = `${userData.localizedFirstName} ${userData.localizedLastName}`;

            // Avatar is more complex in LinkedIn, skipping for simplicity in stub or use default
            avatarUrl = null;
        } else {
            return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/accounts?error=unsupported_platform`);
        }

        // Upsert connected account
        const encryptedAccessToken = encrypt(accessToken);
        const encryptedRefreshToken = refreshToken ? encrypt(refreshToken) : null;

        await db
            .insert(connectedAccounts)
            .values({
                userId: user.id,
                platform: platform as "twitter" | "linkedin" | "facebook" | "instagram",
                platformUserId,
                platformUsername,
                avatarUrl,
                accessToken: encryptedAccessToken,
                refreshToken: encryptedRefreshToken,
                expiresAt,
            })
            .onConflictDoUpdate({
                target: [connectedAccounts.userId, connectedAccounts.platform, connectedAccounts.platformUserId],
                set: {
                    accessToken: encryptedAccessToken,
                    refreshToken: encryptedRefreshToken,
                    expiresAt,
                    platformUsername,
                    avatarUrl,
                    isActive: true,
                },
            });

        return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/accounts?success=true`);
    } catch (err) {
        const error = err as Error;
        console.error(`OAuth callback error for ${platform}:`, error);
        return NextResponse.redirect(
            `${env.NEXT_PUBLIC_APP_URL}/accounts?error=callback_failed&message=${encodeURIComponent(error.message)}`
        );
    } finally {
        cookieStore.delete("oauth_state");
        cookieStore.delete("oauth_code_verifier");
    }
}
