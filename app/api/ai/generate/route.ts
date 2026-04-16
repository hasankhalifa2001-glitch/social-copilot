import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { geminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { topic, tone, platform, charLimit } = await req.json();

        // Plan limit enforcement
        const { checkLimit } = await import("@/lib/billing");
        const { allowed, limit } = await checkLimit(userId, "aiGenerationsPerMonth");

        if (!allowed) {
            return new NextResponse(`AI generation limit reached for your plan (${limit}/mo). Please upgrade to generate more.`, { status: 403 });
        }

        const prompt = `You are a social media content expert. Generate a ${platform}-optimised post about ${topic} in a ${tone} tone. Keep it under ${charLimit} characters. Include relevant emojis. Do not include hashtags unless asked.`;

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error) {
        console.error("[AI_GENERATE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
