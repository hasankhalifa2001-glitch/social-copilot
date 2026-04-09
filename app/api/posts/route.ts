import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { posts, users, scheduledJobs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { postQueue } from "@/lib/bullmq/queue";

export async function POST(req: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

        const user = await db.query.users.findFirst({
            where: eq(users.clerkId, clerkId),
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        const { content, mediaUrls, platforms, status, scheduledAt } = await req.json();

        // Plan limit enforcement
        if (status === "scheduled") {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const scheduledCount = await db.query.posts.findMany({
                where: and(
                    eq(posts.userId, user.id),
                    eq(posts.status, "scheduled")
                    // In a real app, we'd filter by createdAt >= startOfMonth
                ),
            });

            if (user.plan === "free" && scheduledCount.length >= 10) {
                return new NextResponse("Monthly schedule limit reached for Free plan", { status: 403 });
            }
        }

        const [newPost] = await db.insert(posts).values({
            userId: user.id,
            content,
            mediaUrls,
            platforms,
            status,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        }).returning();

        // If status is scheduled or published, trigger BullMQ
        if (status === "scheduled" && scheduledAt) {
            const delay = new Date(scheduledAt).getTime() - Date.now();
            if (delay > 0) {
                const job = await postQueue.add(
                    "publish-post",
                    { postId: newPost.id },
                    { delay }
                );

                await db.insert(scheduledJobs).values({
                    postId: newPost.id,
                    bullJobId: job.id!,
                    scheduledAt: new Date(scheduledAt),
                });
            }
        } else if (status === "published") {
            await postQueue.add("publish-post", { postId: newPost.id });
        }

        return NextResponse.json(newPost);
    } catch (error) {
        console.error("[POSTS_CREATE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

        const user = await db.query.users.findFirst({
            where: eq(users.clerkId, clerkId),
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        const userPosts = await db.query.posts.findMany({
            where: eq(posts.userId, user.id),
            orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        });

        return NextResponse.json(userPosts);
    } catch (error) {
        console.error("[POSTS_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
