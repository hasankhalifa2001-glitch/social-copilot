import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { geminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { platforms } = await req.json();

        const prompt = `You are a social media analytics expert. Based on typical engagement patterns for ${platforms.join(", ")}, suggest the best time to post today. Return ONLY the ISO string for that time today.`;

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        // Basic validation of ISO string
        let suggestedTime = text;
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(text)) {
            // Fallback: 2 hours from now
            suggestedTime = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
        }

        return NextResponse.json({ suggestedTime });
    } catch (error) {
        console.error("[AI_BEST_TIME_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
