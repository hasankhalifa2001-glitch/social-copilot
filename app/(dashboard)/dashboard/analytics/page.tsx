"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { AnalyticsStats } from "./_components/analytics-stats";
import { AnalyticsCharts } from "./_components/analytics-charts";
import { TopPostsTable } from "./_components/top-posts-table";
import { toast } from "sonner";
import Link from "next/link";

interface AnalyticsSnapshot {
    id: string;
    userId: string;
    connectedAccountId: string;
    platform: string;
    date: string | Date;
    followers: number | null;
    impressions: number | null;
    engagements: number | null;
    reach: number | null;
    profileViews: number | null;
}

interface AnalyticsPost {
    id: string;
    content: string;
    platforms: string[];
    status: string;
    publishedAt: string | Date | null;
    createdAt: string | Date;
}

interface AnalyticsData {
    snapshots: AnalyticsSnapshot[];
    totalPosts: number;
    topPosts: AnalyticsPost[];
    isMock: boolean;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocked, setIsLocked] = useState(false);
    const [days, setDays] = useState("30");
    const [platform, setPlatform] = useState("all");

    const fetchAnalytics = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/analytics?days=${days}&platform=${platform}`);

            if (response.status === 403) {
                setIsLocked(true);
                return;
            }

            if (!response.ok) throw new Error("Failed to fetch analytics");

            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load analytics");
        } finally {
            setIsLoading(false);
        }
    }, [days, platform]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    if (isLoading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isLocked) {
        return (
            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground">Detailed engagement and growth metrics.</p>
                </div>

                <Card className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
                        <div className="mb-4 rounded-full bg-primary/10 p-6">
                            <Lock className="h-12 w-12 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Pro Feature</h2>
                        <p className="text-muted-foreground max-w-md mb-6">
                            Analytics and growth tracking are available on Pro and Agency plans.
                            Upgrade now to see how your social presence is growing.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/dashboard/billing">
                                Upgrade Plan
                            </Link>
                        </Button>
                    </div>

                    <CardContent className="p-0 opacity-20 pointer-events-none select-none">
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="h-64 bg-muted animate-pulse rounded-lg" />
                                <div className="h-64 bg-muted animate-pulse rounded-lg" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const snapshots = data?.snapshots || [];
    const totalPosts = data?.totalPosts || 0;
    const topPosts = data?.topPosts || [];

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground">
                        {data?.isMock
                            ? "Showing mock data for demonstration. Connect accounts to see real data."
                            : "Track your growth and engagement across platforms."
                        }
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Select value={platform} onValueChange={setPlatform}>
                        <SelectTrigger className="w-37.5">
                            <SelectValue placeholder="Platform" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="twitter">Twitter / X</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={days} onValueChange={setDays}>
                        <SelectTrigger className="w-37.5">
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7">Last 7 Days</SelectItem>
                            <SelectItem value="30">Last 30 Days</SelectItem>
                            <SelectItem value="90">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <AnalyticsStats
                data={snapshots}
                totalPosts={totalPosts}
            />

            <AnalyticsCharts data={snapshots} />

            <Card>
                <CardHeader>
                    <CardTitle>Recent Posts Performance</CardTitle>
                    <CardDescription>Latest published posts and their reach.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TopPostsTable posts={topPosts} />
                </CardContent>
            </Card>
        </div>
    );
}
