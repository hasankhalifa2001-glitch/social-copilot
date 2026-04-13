import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { posts, users, connectedAccounts } from "@/lib/db/schema";
import { eq, and, gte, count } from "drizzle-orm";

export async function getDashboardData() {
    const { userId: clerkId } = await auth();
    if (!clerkId) throw new Error("Unauthorized");

    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
    });

    if (!user) throw new Error("User not found");

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);

    // Fetch Stats
    const totalPostsResult = await db.select({ value: count() }).from(posts).where(eq(posts.userId, user.id));
    const totalPosts = totalPostsResult[0].value;

    const scheduledPostsResult = await db.select({ value: count() }).from(posts).where(
        and(
            eq(posts.userId, user.id),
            eq(posts.status, "scheduled")
        )
    );
    const scheduledPosts = scheduledPostsResult[0].value;

    const connectedAccountsResult = await db.select({ value: count() }).from(connectedAccounts).where(
        and(
            eq(connectedAccounts.userId, user.id),
            eq(connectedAccounts.isActive, true)
        )
    );
    const totalAccounts = connectedAccountsResult[0].value;

    // Fetch secondary stats (this week)
    const postsThisWeekResult = await db.select({ value: count() }).from(posts).where(
        and(
            eq(posts.userId, user.id),
            gte(posts.createdAt, startOfWeek)
        )
    );
    const postsThisWeek = postsThisWeekResult[0].value;

    const accountsThisWeekResult = await db.select({ value: count() }).from(connectedAccounts).where(
        and(
            eq(connectedAccounts.userId, user.id),
            gte(connectedAccounts.createdAt, startOfWeek)
        )
    );
    const accountsThisWeek = accountsThisWeekResult[0].value;

    // Fetch Recent Posts
    const recentPosts = await db.query.posts.findMany({
        where: eq(posts.userId, user.id),
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        limit: 5,
    });

    return {
        stats: {
            totalPosts: {
                value: totalPosts,
                trend: postsThisWeek
            },
            scheduledPosts: {
                value: scheduledPosts,
                trend: 0 // You can calculate this if needed
            },
            connectedAccounts: {
                value: totalAccounts,
                trend: accountsThisWeek
            }
        },
        recentPosts
    };
}
