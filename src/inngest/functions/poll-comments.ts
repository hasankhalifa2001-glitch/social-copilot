import { inngest } from "../client";
import { db } from "@/lib/db";
import { autoReplyRules, connectedAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/crypto";
import { geminiModel } from "@/lib/gemini";

export const pollComments = inngest.createFunction(
    { id: "poll-comments" },
    { cron: "*/15 * * * *" },
    async ({ step }) => {
        const activeRules = await step.run("fetch-active-rules", async () => {
            return await db.query.autoReplyRules.findMany({
                where: eq(autoReplyRules.isActive, true),
                with: {
                    connectedAccount: true,
                },
            });
        });

        for (const rule of activeRules) {
            await step.run(`process-rule-${rule.id}`, async () => {
                const accessToken = decrypt(rule.connectedAccount.accessToken);

                // Simulate fetching recent comments from platform API
                const recentComments = [
                    { id: "c1", text: "Nice post!", username: "user1" },
                    { id: "c2", text: "How can I buy this?", username: "user2" },
                ];

                for (const comment of recentComments) {
                    let shouldReply = false;
                    if (rule.triggerType === "any_comment") {
                        shouldReply = true;
                    } else if (rule.triggerType === "keyword") {
                        const keywords = rule.keywords as string[];
                        shouldReply = keywords.some(kw => comment.text.toLowerCase().includes(kw.toLowerCase()));
                    }

                    if (shouldReply) {
                        let replyText = "";
                        if (rule.aiEnabled) {
                            const prompt = `Persona: ${rule.aiPersona}\nComment: ${comment.text}\nGenerate a short, friendly reply.`;
                            const result = await geminiModel.generateContent(prompt);
                            replyText = result.response.text();
                        } else {
                            replyText = rule.replyTemplate.replace("{{username}}", comment.username);
                        }

                        // Simulate posting reply via platform API
                        console.log(`Replying to ${comment.username} on ${rule.platform}: ${replyText}`);
                    }
                }
            });
        }
    }
);
