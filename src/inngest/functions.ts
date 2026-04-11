import { inngest } from "./client";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";



export const helloWorld = inngest.createFunction(
    {
        id: "hello-world",
        triggers: { event: "test/hello.world" },
    },
    async ({ event, step }) => {
        // Your function code
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    }
);


export const processScheduledPost = inngest.createFunction(
    {
        id: "process-scheduled-post",
        triggers: { event: "post.scheduled" },
    },
    async ({ event, step }) => {
        const { postId } = event.data;

        const post = await step.run("fetch-post", async () => {
            return await db.query.posts.findFirst({
                where: eq(posts.id, postId),
            });
        });

        if (!post) return { error: "Post not found" };

        // Logic to publish to platforms would go here

        await step.run("update-post-status", async () => {
            await db.update(posts)
                .set({ status: "published", publishedAt: new Date() })
                .where(eq(posts.id, postId));
        });

        return { success: true, postId };
    }
);

export const functions = [helloWorld, processScheduledPost];
