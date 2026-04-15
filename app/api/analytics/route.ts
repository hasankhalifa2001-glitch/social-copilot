/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { analyticsSnapshots, users, posts } from "@/lib/db/schema";
import { eq, and, gte, sql, desc } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const { userId: clerkId } = await auth();
        if (!clerkId) return new NextResponse("Unauthorized", { status: 401 });

        const user = await db.query.users.findFirst({
            where: eq(users.clerkId, clerkId),
        });

        if (!user) return new NextResponse("User not found", { status: 404 });

        // Enforce plan limits
        if (user.plan === "free") {
            return NextResponse.json({
                error: "Analytics unavailable on Free plan",
                locked: true
            }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get("days") || "30");
        const platform = searchParams.get("platform") || "all";

        // Validate days based on plan
        let maxDays = 30;
        if (user.plan === "agency") maxDays = 90;
        const requestedDays = Math.min(days, maxDays);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - requestedDays);

        const filters = [
            eq(analyticsSnapshots.userId, user.id),
            gte(analyticsSnapshots.date, startDate)
        ];

        if (platform !== "all") {
            filters.push(eq(analyticsSnapshots.platform, platform as any));
        }

        const snapshots = await db.query.analyticsSnapshots.findMany({
            where: and(...filters),
            orderBy: [desc(analyticsSnapshots.date)],
        });

        // Get total posts count
        const totalPostsResult = await db.select({ count: sql<number>`count(*)` })
            .from(posts)
            .where(and(eq(posts.userId, user.id), eq(posts.status, "published")));

        // Get top posts
        const topPosts = await db.query.posts.findMany({
            where: and(eq(posts.userId, user.id), eq(posts.status, "published")),
            with: {
                platformResults: true
            },
            limit: 10,
            orderBy: [desc(posts.publishedAt)]
        });

        // Mock data if no snapshots exist (as per requirements)
        if (snapshots.length === 0) {
            return NextResponse.json({
                snapshots: generateMockSnapshots(user.id, requestedDays, platform),
                totalPosts: totalPostsResult[0]?.count || 0,
                topPosts: [],
                isMock: true
            });
        }

        return NextResponse.json({
            snapshots,
            totalPosts: totalPostsResult[0]?.count || 0,
            topPosts,
            isMock: false
        });

    } catch (error) {
        console.error("[ANALYTICS_GET_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

interface MockSnapshot {
    id: string;
    userId: string;
    connectedAccountId: string;
    platform: "twitter" | "linkedin" | "facebook" | "instagram";
    date: string;
    followers: number;
    impressions: number;
    engagements: number;
    reach: number;
    profileViews: number;
}

function generateMockSnapshots(userId: string, days: number, platformFilter: string) {
    const mockSnapshots: MockSnapshot[] = [];
    const platforms = ["twitter", "linkedin", "facebook", "instagram"] as const;

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        platforms.forEach(platform => {
            if (platformFilter !== "all" && platformFilter !== platform) return;

            mockSnapshots.push({
                id: crypto.randomUUID(),
                userId,
                connectedAccountId: crypto.randomUUID(),
                platform,
                date: date.toISOString(),
                followers: 1000 + Math.floor(Math.random() * 500) + (days - i) * 10,
                impressions: 5000 + Math.floor(Math.random() * 2000),
                engagements: 200 + Math.floor(Math.random() * 100),
                reach: 4000 + Math.floor(Math.random() * 1000),
                profileViews: 50 + Math.floor(Math.random() * 50),
            });
        });
    }
    return mockSnapshots;
}
