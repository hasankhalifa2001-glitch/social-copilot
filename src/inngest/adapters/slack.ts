/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToSlack({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    console.log(`Publishing to Slack: ${post.content}`);
    return { platformPostId: "sl_" + Math.random().toString(36).substr(2, 9) };
}
