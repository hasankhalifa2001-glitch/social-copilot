import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { geminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { content, platform, tone } = await req.json();

        const prompt = `You are a social media content expert. Rewrite the following content to be better suited for ${platform} in a ${tone} tone:

"${content}"`;

        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error) {
        console.error("[AI_REWRITE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
