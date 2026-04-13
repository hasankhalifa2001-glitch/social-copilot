/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToFacebook({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    console.log(`Publishing to Facebook: ${post.content}`);
    return { platformPostId: "fb_" + Math.random().toString(36).substr(2, 9) };
}
