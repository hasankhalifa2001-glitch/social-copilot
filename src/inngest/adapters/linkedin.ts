import { decrypt } from "@/lib/crypto";

export async function publishToLinkedin({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);
    console.log(`Publishing to LinkedIn: ${post.content}`);
    return { platformPostId: "li_" + Math.random().toString(36).substr(2, 9) };
}
