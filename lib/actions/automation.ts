import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { autoReplyRules, users, connectedAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getAutomationData() {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
    });

    if (!user) throw new Error("User not found");

    const rules = await db.query.autoReplyRules.findMany({
        where: eq(autoReplyRules.userId, user.id),
        orderBy: (autoReplyRules, { desc }) => [desc(autoReplyRules.createdAt)],
    });

    const accounts = await db.query.connectedAccounts.findMany({
        where: eq(connectedAccounts.userId, user.id),
    });

    return {
        user,
        rules,
        accounts,
    };
}
