import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { geminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

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
            return NextResponse.json(ideas);
        } catch (e) {
            // Fallback: if JSON parsing fails, just return the lines
            const ideas = text.split('\n').filter(line => line.trim().length > 0).slice(0, 5);
            return NextResponse.json(ideas);
        }
    } catch (error) {
        console.error("[AI_IDEAS_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
