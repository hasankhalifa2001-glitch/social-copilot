import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { posts, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { inngest } from "@/src/inngest/client";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId: clerkId } = await auth();
        if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

        const user = await db.query.users.findFirst({
            where: eq(users.clerkId, clerkId),
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        const { scheduledAt, content, platforms, mediaUrls } = await req.json();

        const [updatedPost] = await db.update(posts)
            .set({
                content,
                platforms,
                mediaUrls,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                updatedAt: new Date(),
            })
            .where(and(eq(posts.id, id), eq(posts.userId, user.id)))
            .returning();

        if (!updatedPost) return new NextResponse("Post not found", { status: 404 });

        if (updatedPost.status === "scheduled" && scheduledAt) {
            // Cancel previous job and re-trigger Inngest for reschedule
            await inngest.send([
                {
                    name: "post.cancelled",
                    data: { postId: updatedPost.id },
                },
                {
                    name: "post.scheduled",
                    data: {
                        postId: updatedPost.id,
                        scheduledAt: new Date(scheduledAt).toISOString(),
                    },
                }
            ]);
        }

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error("[POST_UPDATE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { userId: clerkId } = await auth();
        if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

        const user = await db.query.users.findFirst({
            where: eq(users.clerkId, clerkId),
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        const [deletedPost] = await db.delete(posts)
            .where(and(eq(posts.id, id), eq(posts.userId, user.id)))
            .returning();

        if (!deletedPost) return new NextResponse("Post not found", { status: 404 });

        // Inngest cancellation: If post was scheduled, we send a cancellation event.
        if (deletedPost.status === "scheduled") {
            await inngest.send({
                name: "post.cancelled",
                data: { postId: deletedPost.id },
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[POST_DELETE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
