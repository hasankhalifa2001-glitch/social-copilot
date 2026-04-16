/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToSlack({ post, account }: { post: any; account: any }) {
    const webhookUrl = decrypt(account.accessToken);

    const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: post.content,
        }),
    });

    if (!response.ok) {
        const result = await response.text();
        console.error("Slack API error:", result);
        throw new Error(result || "Failed to publish to Slack via Webhook");
    }

    // Webhooks don't always return a message ID, but we can return 'ok'
    return { platformPostId: "slack_webhook_ok" };
}
