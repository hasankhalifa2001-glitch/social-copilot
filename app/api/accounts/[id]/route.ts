import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { connectedAccounts, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
    });

    if (!user) {
        return new NextResponse("User not found", { status: 404 });
    }

    // Verify account belongs to user and delete
    const result = await db
        .delete(connectedAccounts)
        .where(
            and(
                eq(connectedAccounts.id, id),
                eq(connectedAccounts.userId, user.id)
            )
        )
        .returning();

    if (result.length === 0) {
        return new NextResponse("Account not found or unauthorized", { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
}
