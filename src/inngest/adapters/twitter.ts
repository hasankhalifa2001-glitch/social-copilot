/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from "@/lib/crypto";

export async function publishToTwitter({ post, account }: { post: any; account: any }) {
    const accessToken = decrypt(account.accessToken);

    const options = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: post.content
        })
    };

    const response = await fetch('https://api.x.com/2/tweets', options);
    const result = await response.json();

    if (!response.ok) {
        console.error('Twitter API error:', result);
        throw new Error(result.detail || 'Failed to publish to Twitter');
    }

    return { platformPostId: result.data.id };
}
