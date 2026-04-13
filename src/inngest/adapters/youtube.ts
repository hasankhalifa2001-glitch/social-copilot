import { decrypt } from "@/lib/crypto";

export async function publishToYoutube({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    console.log(`Publishing to YouTube: ${post.content}`);
    return { platformPostId: "yt_" + Math.random().toString(36).substr(2, 9) };
}
