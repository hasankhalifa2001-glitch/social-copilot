import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { connectedAccounts, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
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

    const accounts = await db.query.connectedAccounts.findMany({
        where: eq(connectedAccounts.userId, user.id),
        orderBy: (connectedAccounts, { desc }) => [desc(connectedAccounts.createdAt)],
    });

    // Remove sensitive data before sending to client
    const safeAccounts = accounts.map(({ accessToken, refreshToken, ...rest }) => rest);

    return NextResponse.json(safeAccounts);
}
