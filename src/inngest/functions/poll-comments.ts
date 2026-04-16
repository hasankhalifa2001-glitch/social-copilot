import { inngest } from "../client";
import { db } from "@/lib/db";
import { autoReplyRules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { geminiModel } from "@/lib/gemini";
import { getValidAccessToken } from "@/lib/token-refresh";
import { fetchTwitterComments, replyToTwitterComment } from "../adapters/twitter";
import { fetchInstagramComments, replyToInstagramComment } from "../adapters/instagram";
import { fetchFacebookComments, replyToFacebookComment } from "../adapters/facebook";

export const pollComments = inngest.createFunction(
    { id: "poll-comments", triggers: { cron: "*/15 * * * *" }, },

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
                const accessToken = await getValidAccessToken(rule.connectedAccount as Parameters<typeof getValidAccessToken>[0]);
                const repliedCommentIds = (rule.repliedCommentIds as string[]) || [];

                let recentComments: { id: string; text: string; username: string }[] = [];
                try {
                    switch (rule.platform) {
                        case "twitter":
                            recentComments = await fetchTwitterComments(accessToken, rule.connectedAccount.platformUsername || "");
                            break;
                        case "instagram":
                            recentComments = await fetchInstagramComments(accessToken, rule.connectedAccount.platformUserId);
                            break;
                        case "facebook":
                            recentComments = await fetchFacebookComments(accessToken, rule.connectedAccount.platformUserId);
                            break;
                        default:
                            console.log(`Auto-reply not supported for platform: ${rule.platform}`);
                            return;
                    }
                } catch (error) {
                    console.error(`Error fetching comments for ${rule.platform}:`, error);
                    return;
                }

                const newRepliedIds = [...repliedCommentIds];
                let hasNewReplies = false;

                for (const comment of recentComments) {
                    if (repliedCommentIds.includes(comment.id)) continue;

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

                        try {
                            switch (rule.platform) {
                                case "twitter":
                                    await replyToTwitterComment(accessToken, comment.id, replyText);
                                    break;
                                case "instagram":
                                    await replyToInstagramComment(accessToken, comment.id, replyText);
                                    break;
                                case "facebook":
                                    await replyToFacebookComment(accessToken, comment.id, replyText);
                                    break;
                            }
                            newRepliedIds.push(comment.id);
                            hasNewReplies = true;
                        } catch (error) {
                            console.error(`Error posting reply to ${rule.platform}:`, error);
                        }
                    }
                }

                if (hasNewReplies) {
                    await db.update(autoReplyRules)
                        .set({ repliedCommentIds: newRepliedIds })
                        .where(eq(autoReplyRules.id, rule.id));
                }
            });
        }
    }
);
