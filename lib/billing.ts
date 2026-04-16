import { db } from "./db";
import { users, posts, connectedAccounts, autoReplyRules } from "./db/schema";
import { eq, and, gte, count } from "drizzle-orm";

export type Plan = "free" | "pro" | "agency";

export const PLAN_LIMITS = {
    free: {
        accounts: 2,
        postsPerMonth: 20,
        aiGenerationsPerMonth: 5,
        autoReplyRules: 1,
    },
    pro: {
        accounts: 10,
        postsPerMonth: 200,
        aiGenerationsPerMonth: 100,
        autoReplyRules: 10,
    },
    agency: {
        accounts: 50,
        postsPerMonth: 1000,
        aiGenerationsPerMonth: 500,
        autoReplyRules: 50,
    },
};

export async function getUserPlan(clerkUserId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkUserId),
        with: {
            subscription: true,
        },
    });

    if (!user) return "free" as Plan;

    // Even if we have a subscription record, we trust the 'plan' field on the user
    // which is kept in sync by webhooks.
    return user.plan as Plan;
}

export async function getUsage(clerkUserId: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkUserId),
    });

    if (!user) return null;

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [accountsCount] = await db
        .select({ value: count() })
        .from(connectedAccounts)
        .where(eq(connectedAccounts.userId, user.id));

    const [postsCount] = await db
        .select({ value: count() })
        .from(posts)
        .where(
            and(
                eq(posts.userId, user.id),
                gte(posts.createdAt, startOfMonth)
            )
        );

    const [aiCount] = await db
        .select({ value: count() })
        .from(posts)
        .where(
            and(
                eq(posts.userId, user.id),
                eq(posts.aiGenerated, true),
                gte(posts.createdAt, startOfMonth)
            )
        );

    const [rulesCount] = await db
        .select({ value: count() })
        .from(autoReplyRules)
        .where(eq(autoReplyRules.userId, user.id));

    return {
        accounts: accountsCount.value,
        postsPerMonth: postsCount.value,
        aiGenerationsPerMonth: aiCount.value,
        autoReplyRules: rulesCount.value,
    };
}

export async function checkLimit(
    clerkUserId: string,
    feature: keyof typeof PLAN_LIMITS.free
) {
    const plan = await getUserPlan(clerkUserId);
    const usage = await getUsage(clerkUserId);

    if (!usage) return { allowed: false, limit: 0, current: 0 };

    const limit = PLAN_LIMITS[plan][feature];
    const current = usage[feature as keyof typeof usage] || 0;

    return {
        allowed: current < limit,
        limit,
        current,
    };
}

export async function requirePlan(clerkUserId: string, minPlan: Plan) {
    const plan = await getUserPlan(clerkUserId);

    const planHierarchy: Plan[] = ["free", "pro", "agency"];
    const userPlanIndex = planHierarchy.indexOf(plan);
    const minPlanIndex = planHierarchy.indexOf(minPlan);

    if (userPlanIndex < minPlanIndex) {
        throw new Error("Forbidden: Higher plan required");
    }

    return plan;
}
