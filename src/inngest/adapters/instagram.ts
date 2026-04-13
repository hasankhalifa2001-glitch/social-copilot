/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToInstagram({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    console.log(`Publishing to Instagram: ${post.content}`);
    return { platformPostId: "ig_" + Math.random().toString(36).substr(2, 9) };
}
