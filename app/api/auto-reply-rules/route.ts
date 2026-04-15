import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { autoReplyRules, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const createRuleSchema = z.object({
    name: z.string().min(1),
    connectedAccountId: z.string().uuid(),
    platform: z.enum(["twitter", "linkedin", "facebook", "instagram", "tiktok", "youtube", "pinterest", "discord", "slack"]),
    triggerType: z.enum(["keyword", "any_comment"]),
    isActive: z.boolean().default(true),
    keywords: z.array(z.string()).optional(),
    replyTemplate: z.string().min(1),
    aiEnabled: z.boolean().default(false),
    aiPersona: z.string().optional(),
});

export async function GET() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.clerkId, clerkId),
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const rules = await db.query.autoReplyRules.findMany({
            where: eq(autoReplyRules.userId, user.id),
            orderBy: (autoReplyRules, { desc }) => [desc(autoReplyRules.createdAt)],
        });

        return NextResponse.json(rules);
    } catch (error) {
        console.error("[AUTO_REPLY_RULES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.clerkId, clerkId),
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Plan Limits Check
        if (user.plan === "free") {
            return new NextResponse("Upgrade to Pro to use Auto-Reply rules", { status: 403 });
        }

        const existingRules = await db.query.autoReplyRules.findMany({
            where: eq(autoReplyRules.userId, user.id),
        });

        if (user.plan === "pro" && existingRules.length >= 5) {
            return new NextResponse("Pro plan limit reached (max 5 rules)", { status: 403 });
        }

        const body = await req.json();
        const validatedData = createRuleSchema.parse(body);

        const [newRule] = await db.insert(autoReplyRules).values({
            userId: user.id,
            ...validatedData,
        }).returning();

        return NextResponse.json(newRule);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.flatten()), { status: 400 });
        }
        console.error("[AUTO_REPLY_RULES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
