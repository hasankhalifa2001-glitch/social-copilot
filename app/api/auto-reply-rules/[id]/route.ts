import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { autoReplyRules, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const updateRuleSchema = z.object({
    name: z.string().min(1).optional(),
    connectedAccountId: z.string().uuid().optional(),
    triggerType: z.enum(["keyword", "any_comment"]).optional(),
    keywords: z.array(z.string()).optional(),
    replyTemplate: z.string().min(1).optional(),
    aiEnabled: z.boolean().optional(),
    aiPersona: z.string().optional(),
    isActive: z.boolean().optional(),
});

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
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

        const body = await req.json();
        const validatedData = updateRuleSchema.parse(body);

        const rule = await db.query.autoReplyRules.findFirst({
            where: and(
                eq(autoReplyRules.id, params.id),
                eq(autoReplyRules.userId, user.id)
            ),
        });

        if (!rule) {
            return new NextResponse("Not Found", { status: 404 });
        }

        const [updatedRule] = await db
            .update(autoReplyRules)
            .set(validatedData)
            .where(eq(autoReplyRules.id, params.id))
            .returning();

        return NextResponse.json(updatedRule);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.flatten()), { status: 400 });
        }
        console.error("[AUTO_REPLY_RULE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
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

        const rule = await db.query.autoReplyRules.findFirst({
            where: and(
                eq(autoReplyRules.id, params.id),
                eq(autoReplyRules.userId, user.id)
            ),
        });

        if (!rule) {
            return new NextResponse("Not Found", { status: 404 });
        }

        await db.delete(autoReplyRules).where(eq(autoReplyRules.id, params.id));

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[AUTO_REPLY_RULE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
