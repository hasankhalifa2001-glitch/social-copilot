import { decrypt } from "@/lib/crypto";

export async function publishToTiktok({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    console.log(`Publishing to TikTok: ${post.content}`);
    return { platformPostId: "tt_" + Math.random().toString(36).substr(2, 9) };
}
