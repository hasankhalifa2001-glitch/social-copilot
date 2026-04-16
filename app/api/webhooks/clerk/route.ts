/* eslint-disable @typescript-eslint/no-explicit-any */
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local");
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error occured", {
            status: 400,
        });
    }

    const eventType = evt.type;

    if (eventType === "user.created" || eventType === "user.updated") {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        const email = email_addresses[0]?.email_address;
        const name = `${first_name || ""} ${last_name || ""}`.trim();

        if (!id || !email) {
            return new Response("Error occured -- missing data", {
                status: 400,
            });
        }

        await db.insert(users).values({
            clerkId: id,
            email,
            name,
            avatarUrl: image_url,
        }).onConflictDoUpdate({
            target: users.clerkId,
            set: {
                email,
                name,
                avatarUrl: image_url,
                updatedAt: new Date(),
            }
        });
    }

    if (eventType === "user.deleted") {
        const { id } = evt.data;
        if (id) {
            await db.delete(users).where(eq(users.clerkId, id));
        }
    }

    if (eventType as string === "subscription.created" || eventType as string === "subscription.updated") {
        const subData = (evt as any).data;

        // Extraction based on the actual payload
        const clerkUserId = subData.payer?.user_id;
        // Find the active subscription item
        const activeItem = subData.items?.find((item: any) => item.status === "active");
        const planSlug = activeItem?.plan?.slug;
        const status = subData.status;
        const subscriptionId = subData.id;

        // Handle dates - Clerk uses milliseconds for some timestamps or Date objects depending on SDK
        const current_period_start = subData.current_period_start || (activeItem?.period_start);
        const current_period_end = subData.current_period_end || (activeItem?.period_end);

        console.log(`Processing ${eventType}:`, {
            subscriptionId,
            clerkUserId,
            planSlug,
            status,
        });

        if (!clerkUserId) {
            console.error(`User ID is missing in ${eventType} event`);
            return new Response("User ID missing", { status: 400 });
        }

        // Map planSlug to application plan
        let plan: "free" | "pro" | "agency" = "free";
        if (planSlug === 'free' || planSlug === 'free_user') {
            plan = "free";
        } else if (planSlug === 'pro' || planSlug?.toLowerCase().includes("pro")) {
            plan = "pro";
        } else if (planSlug === 'agency' || planSlug?.toLowerCase().includes("agency")) {
            plan = "agency";
        }

        const user = await db.query.users.findFirst({
            where: eq(users.clerkId, clerkUserId),
        });

        if (user) {
            try {
                // Update user's plan directly
                await db.update(users).set({
                    plan,
                    updatedAt: new Date(),
                }).where(eq(users.clerkId, clerkUserId));

                // Upsert subscription record
                await db.insert(subscriptions).values({
                    clerkSubscriptionId: subscriptionId,
                    userId: user.id,
                    plan,
                    status,
                    currentPeriodStart: new Date(current_period_start || Date.now()),
                    currentPeriodEnd: new Date(current_period_end || Date.now() + 30 * 24 * 60 * 60 * 1000),
                }).onConflictDoUpdate({
                    target: subscriptions.userId,
                    set: {
                        clerkSubscriptionId: subscriptionId,
                        plan,
                        status,
                        currentPeriodStart: new Date(current_period_start || Date.now()),
                        currentPeriodEnd: new Date(current_period_end || Date.now() + 30 * 24 * 60 * 60 * 1000),
                    }
                });

                console.log("Plan updated to:", planSlug, "for user:", clerkUserId);
            } catch (error) {
                console.error("Error updating subscription in DB:", error);
                return new Response("Error updating subscription", { status: 500 });
            }
        } else {
            console.warn(`User with clerkId ${clerkUserId} not found for subscription event`);
        }
    }

    if (eventType as string === "subscription.deleted") {
        const { user_id } = (evt as any).data;

        console.log(`Processing ${eventType} for user:`, user_id);

        const user = await db.query.users.findFirst({
            where: eq(users.clerkId, user_id),
        });

        if (user) {
            try {
                // Update user's plan to free
                await db.update(users).set({
                    plan: "free",
                    updatedAt: new Date(),
                }).where(eq(users.clerkId, user_id));

                // Update subscription status to cancelled
                await db.update(subscriptions).set({
                    status: "cancelled",
                    plan: "free",
                }).where(eq(subscriptions.userId, user.id));

                console.log(`Successfully cancelled subscription for user ${user_id}`);
            } catch (error) {
                console.error("Error cancelling subscription in DB:", error);
                return new Response("Error cancelling subscription", { status: 500 });
            }
        } else {
            console.warn(`User with clerkId ${user_id} not found for subscription.deleted event`);
        }
    }

    return new Response("", { status: 200 });
}
