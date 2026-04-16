import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { geminiModel } from "@/lib/gemini";
import { checkLimit, trackAIUsage } from "@/lib/billing";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        // Plan limit enforcement
        const { allowed, limit } = await checkLimit(userId, "aiGenerationsPerMonth");

        if (!allowed) {
            return new NextResponse(`AI generation limit reached for your plan (${limit}/mo). Please upgrade to generate more.`, { status: 403 });
        }

        const { platform } = await req.json();

        const prompt = `You are a social media content expert. Provide 5 creative content ideas for a ${platform} post. Return them as a JSON array of strings.`;

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Basic cleanup to extract JSON if Gemini wraps it in markdown code blocks
        if (text.includes("```json")) {
            text = text.split("```json")[1].split("```")[0].trim();
        } else if (text.includes("```")) {
            text = text.split("```")[1].split("```")[0].trim();
        }

        try {
            const ideas = JSON.parse(text);
            await trackAIUsage(userId, "ideas");
            return NextResponse.json(ideas);
        } catch (e) {
            // Fallback: if JSON parsing fails, just return the lines
            const ideas = text.split("\n").filter(line => line.trim().length > 0).slice(0, 5);
            await trackAIUsage(userId, "ideas");
            return NextResponse.json(ideas);
        }
    } catch (error) {
        console.error("[AI_IDEAS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
