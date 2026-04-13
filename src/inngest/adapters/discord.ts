/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToDiscord({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    console.log(`Publishing to Discord: ${post.content}`);
    return { platformPostId: "dc_" + Math.random().toString(36).substr(2, 9) };
}
