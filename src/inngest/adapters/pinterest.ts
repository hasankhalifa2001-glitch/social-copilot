/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToPinterest({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    console.log(`Publishing to Pinterest: ${post.content}`);
    return { platformPostId: "pin_" + Math.random().toString(36).substr(2, 9) };
}
