/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/lib/db";
import { connectedAccounts, autoReplyRules } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { decrypt } from "@/lib/crypto";
import { getPlatformClient } from "../lib/platformClients";
import { geminiModel } from "@/lib/gemini";

export async function handlePollComments(step: any) {
    const accounts = await step.run("fetch-active-accounts", async () => {
        return await db.query.connectedAccounts.findMany({
            where: eq(connectedAccounts.isActive, true),
        });
    });

    for (const account of accounts) {
        await step.run(`poll-account-${account.id}`, async () => {
            const accessToken = decrypt(account.accessToken);
            const client = getPlatformClient(account.platform);

            const comments = await client.fetchComments(account.platformUserId, accessToken);

            const rules = await db.query.autoReplyRules.findMany({
                where: and(
                    eq(autoReplyRules.connectedAccountId, account.id),
                    eq(autoReplyRules.isActive, true)
                ),
            });

            for (const comment of comments) {
                for (const rule of rules) {
                    let matched = false;
                    if (rule.triggerType === "any_comment") {
                        matched = true;
                    } else if (rule.triggerType === "keyword" && rule.keywords) {
                        const keywords = rule.keywords as string[];
                        matched = keywords.some(kw => comment.text.toLowerCase().includes(kw.toLowerCase()));
                    }

                    if (matched) {
                        let replyText = rule.replyTemplate;

                        if (rule.aiEnabled) {
                            const prompt = `
                                You are a social media assistant. 
                                Persona: ${rule.aiPersona || "Professional and helpful"}
                                Post Content: (Context would go here if available)
                                Comment: "${comment.text}"
                                Reply Template: "${rule.replyTemplate}"
                                Generate a contextual reply based on the template and persona. Keep it short.
                            `;
                            const result = await geminiModel.generateContent(prompt);
                            replyText = result.response.text();
                        }

                        // In a real implementation, we'd post the reply back to the platform
                        console.log(`Replying to ${comment.id} on ${account.platform} with: ${replyText}`);
                        // await client.postReply(comment.id, replyText, accessToken);
                    }
                }
            }
        });
    }
}
