import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/lib/env";
import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ platform: string }> }
) {
    const { userId } = await auth();
    if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { platform } = await params;
    const state = randomBytes(32).toString("hex");
    const cookieStore = await cookies();

    cookieStore.set("oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 10, // 10 minutes
    });

    let authUrl = "";

    switch (platform) {
        case "twitter": {
            const codeVerifier = randomBytes(32).toString("base64url");
            const codeChallenge = createHash("sha256")
                .update(codeVerifier)
                .digest("base64url");

            cookieStore.set("oauth_code_verifier", codeVerifier, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 60 * 10,
            });

            const params = new URLSearchParams({
                response_type: "code",
                client_id: env.TWITTER_CLIENT_ID,
                redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/oauth/twitter/callback`,
                scope: "tweet.read tweet.write users.read offline.access",
                state: state,
                code_challenge: codeChallenge,
                code_challenge_method: "S256",
            });
            authUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
            break;
        }

        case "linkedin": {
            const params = new URLSearchParams({
                response_type: "code",
                client_id: env.LINKEDIN_CLIENT_ID,
                redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/oauth/linkedin/callback`,
                state: state,
                scope: "r_liteprofile r_emailaddress w_member_social",
            });
            authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
            break;
        }

        case "facebook":
        case "instagram": {
            const params = new URLSearchParams({
                client_id: env.META_APP_ID,
                redirect_uri: `${env.NEXT_PUBLIC_APP_URL}/api/oauth/${platform}/callback`,
                state: state,
                scope: "public_profile,email,instagram_basic,instagram_content_publish",
            });
            authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
            break;
        }

        default:
            return new NextResponse("Platform not supported", { status: 400 });
    }

    return NextResponse.redirect(authUrl);
}
