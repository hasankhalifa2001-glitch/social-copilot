import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { inngest } from "@/src/inngest/client";

export async function GET(req: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

        const user = await db.query.users.findFirst({
            where: eq(users.clerkId, clerkId),
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        const { searchParams } = new URL(req.url);
        const from = searchParams.get("from");
        const to = searchParams.get("to");
        const platform = searchParams.get("platform");
        const status = searchParams.get("status");

        const filters = [eq(posts.userId, user.id)];

        if (from) {
            filters.push(gte(posts.scheduledAt, new Date(from)));
        }
        if (to) {
            filters.push(lte(posts.scheduledAt, new Date(to)));
        }
        if (status && status !== "all") {
            filters.push(eq(posts.status, status as "draft" | "scheduled" | "published" | "failed"));
        }

        let userPosts = await db.query.posts.findMany({
            where: and(...filters),
            with: {
                platformResults: true,
            },
            orderBy: (posts, { asc }) => [asc(posts.scheduledAt)],
        });

        // Manual platform filtering if needed (since platforms is jsonb)
        if (platform && platform !== "all") {
            userPosts = userPosts.filter((post) =>
                (post.platforms as string[]).includes(platform)
            );
        }

        return NextResponse.json(userPosts);
    } catch (error) {
        console.error("[POSTS_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

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
                    eq(posts.status, "scheduled"),
                    gte(posts.scheduledAt, startOfMonth)
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
            scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
        }).returning();

        if (status === "scheduled" && scheduledAt) {
            await inngest.send({
                name: "post.scheduled",
                data: {
                    postId: newPost.id,
                    scheduledAt: new Date(scheduledAt).toISOString(),
                },
            });
        } else if (status === "published") {
            await inngest.send({
                name: "post.scheduled",
                data: {
                    postId: newPost.id,
                    scheduledAt: new Date().toISOString(),
                },
            });
        }

        return NextResponse.json(newPost);
    } catch (error) {
        console.error("[POSTS_CREATE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
