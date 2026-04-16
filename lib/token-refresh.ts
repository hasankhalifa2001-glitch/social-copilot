import { db } from "./db";
import { connectedAccounts } from "./db/schema";
import { eq } from "drizzle-orm";
import { decrypt, encrypt } from "./crypto";
import { OAUTH_CONFIG, Platform } from "./oauth-configs";

interface ConnectedAccount {
    id: string;
    platform: Platform;
    accessToken: string;
    refreshToken: string | null;
    expiresAt: Date | string | null;
}

/**
 * Checks if a token is expired or about to expire within 5 minutes.
 */
function isTokenExpired(expiresAt: Date | string | null): boolean {
    if (!expiresAt) return false; // If no expiry date, assume it doesn't expire or we don't know
    const expires = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
    const buffer = 5 * 60 * 1000; // 5 minutes buffer
    return expires.getTime() - buffer < Date.now();
}

/**
 * Refreshes an OAuth token for a given platform.
 */
async function refreshPlatformToken(account: ConnectedAccount): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
} | null> {
    const config = OAUTH_CONFIG[account.platform];
    const refreshToken = account.refreshToken ? decrypt(account.refreshToken) : null;

    if (!refreshToken && !["facebook", "instagram"].includes(account.platform)) {
        return null;
    }

    try {
        let response;
        const body = new URLSearchParams();

        switch (account.platform) {
            case "twitter":
                body.append("grant_type", "refresh_token");
                body.append("refresh_token", refreshToken!);
                response = await fetch(config.tokenUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Basic ${Buffer.from(
                            `${config.clientId}:${config.clientSecret}`
                        ).toString("base64")}`,
                    },
                    body: body.toString(),
                });
                break;

            case "linkedin":
            case "pinterest":
                body.append("grant_type", "refresh_token");
                body.append("refresh_token", refreshToken!);
                body.append("client_id", config.clientId);
                body.append("client_secret", config.clientSecret);
                response = await fetch(config.tokenUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: body.toString(),
                });
                break;

            case "youtube":
            case "tiktok":
                body.append("grant_type", "refresh_token");
                body.append("refresh_token", refreshToken!);
                body.append("client_id", config.clientId);
                body.append("client_secret", config.clientSecret);
                // TikTok also needs client_key which is handled by OAUTH_CONFIG if needed but here we use standard body
                response = await fetch(config.tokenUrl, {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: body.toString(),
                });
                break;

            case "facebook":
            case "instagram":
                // Facebook/Instagram use token exchange for long-lived tokens
                const fbUrl = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${config.clientId}&client_secret=${config.clientSecret}&fb_exchange_token=${decrypt(account.accessToken)}`;
                response = await fetch(fbUrl);
                break;

            default:
                return null;
        }

        if (!response.ok) {
            const error = await response.text();
            console.error(`Failed to refresh ${account.platform} token:`, error);
            return null;
        }

        const data = await response.json();
        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token, // Some platforms might return a new refresh token
            expiresIn: data.expires_in,
        };
    } catch (error) {
        console.error(`Error refreshing ${account.platform} token:`, error);
        return null;
    }
}

/**
 * Gets a valid access token, refreshing it if necessary.
 */
export async function getValidAccessToken(account: ConnectedAccount): Promise<string> {
    if (!isTokenExpired(account.expiresAt)) {
        return decrypt(account.accessToken);
    }

    const refreshed = await refreshPlatformToken(account);

    if (!refreshed) {
        // If refresh fails, return the current token and hope for the best, 
        // or we could throw an error. Given the AC, it's better to return 
        // decrypted token if refresh is not possible (e.g. Slack/Discord).
        return decrypt(account.accessToken);
    }

    // Update the database with the new tokens
    const newExpiresAt = refreshed.expiresIn
        ? new Date(Date.now() + refreshed.expiresIn * 1000)
        : typeof account.expiresAt === "string"
            ? new Date(account.expiresAt)
            : account.expiresAt;

    await db.update(connectedAccounts)
        .set({
            accessToken: encrypt(refreshed.accessToken),
            refreshToken: refreshed.refreshToken ? encrypt(refreshed.refreshToken) : account.refreshToken,
            expiresAt: newExpiresAt,
        })
        .where(eq(connectedAccounts.id, account.id));

    return refreshed.accessToken;
}
