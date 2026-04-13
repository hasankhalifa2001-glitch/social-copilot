/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToTwitter({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    // In a real app, we would use twitter-api-v2 with this token.
    // For now, we simulate the API call.
    console.log(`Publishing to Twitter: ${post.content}`);
    return { platformPostId: "tw_" + Math.random().toString(36).substr(2, 9) };
}
