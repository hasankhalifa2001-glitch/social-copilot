import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { env } from "@/lib/env";
import { OAUTH_CONFIG, Platform } from "@/lib/oauth-configs";
import { cookies } from "next/headers";
import { randomBytes, createHash } from "crypto";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ platform: string }> }
) {
    const { platform } = await params;
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/sign-in`);
    }

    const config = OAUTH_CONFIG[platform as Platform];

    if (!config || !config.authorizeUrl) {
        return NextResponse.redirect(
            `${env.NEXT_PUBLIC_APP_URL}/dashboard/accounts?error=true&message=Platform not supported`
        );
    }

    const state = randomBytes(32).toString("hex");
    const cookieStore = await cookies();

    cookieStore.set(`oauth_state_${platform}`, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 10, // 10 minutes
    });

    const redirectUri = `${env.NEXT_PUBLIC_APP_URL}/api/oauth/${platform}/callback`;
    const url = new URL(config.authorizeUrl);

    url.searchParams.set("client_id", config.clientId);
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", config.scopes.join(" "));
    url.searchParams.set("state", state);

    if (config.additionalParams) {
        Object.entries(config.additionalParams).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    }

    // PKCE for Twitter (and others if needed)
    if (config.useCodeChallenge) {
        const codeVerifier = randomBytes(32).toString("base64url");
        cookieStore.set(`oauth_code_verifier_${platform}`, codeVerifier, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 10,
        });

        const codeChallenge = createHash("sha256")
            .update(codeVerifier)
            .digest("base64url");

        url.searchParams.set("code_challenge", codeChallenge);
        url.searchParams.set("code_challenge_method", "S256");
    }

    return NextResponse.redirect(url.toString());
}
