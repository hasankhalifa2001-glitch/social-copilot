import Link from "next/link";
import { Plus, Calendar, ArrowUpRight } from "lucide-react";
import { getDashboardData } from "@/lib/actions/dashboard";
import { parsePostContent } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { format } from "date-fns";

async function StatsCards() {
    const data = await getDashboardData();
    const stats = [
        {
            label: "Total Posts",
            value: data.stats.totalPosts.value,
            trend: `${data.stats.totalPosts.trend} this week`
        },
        {
            label: "Scheduled",
            value: data.stats.scheduledPosts.value,
            trend: "All time"
        },
        {
            label: "Connected Accounts",
            value: data.stats.connectedAccounts.value,
            trend: `+${data.stats.connectedAccounts.trend} this week`
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
                <Card key={stat.label}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
                            {stat.trend}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-[100px]" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-[60px]" />
                        <Skeleton className="h-3 w-[80px] mt-2" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

async function RecentPosts() {
    const data = await getDashboardData();
    const posts = data.recentPosts;

    if (posts.length === 0) {
        return (
            <div className="p-12 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-muted p-4 rounded-full">
                    <Plus className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No posts yet</h3>
                <p className="text-muted-foreground max-w-xs">
                    Start by creating your first post to see it scheduled here.
                </p>
                <Button asChild>
                    <Link href="/dashboard/compose">
                        Create Your First Post
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium">
                Recent Posts
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {posts.map((post) => (
                    <div key={post.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                        <div className="flex flex-col space-y-1 max-w-[60%]">
                            <div className="flex gap-1">
                                {(post.platforms as string[]).map((p) => (
                                    <Badge key={p} variant="outline" className="text-[10px] capitalize">
                                        {p}
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-sm font-medium truncate">
                                {parsePostContent(post.content)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {post.scheduledAt ? format(new Date(post.scheduledAt), "PPP p") : "Not scheduled"}
                            </p>
                        </div>
                        <div>
                            <Badge
                                variant={
                                    post.status === "failed" ? "destructive" :
                                        post.status === "scheduled" ? "default" :
                                            "secondary"
                                }
                                className={
                                    post.status === "published" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                                        post.status === "scheduled" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                                            ""
                                }
                            >
                                {post.status}
                            </Badge>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RecentPostsSkeleton() {
    return (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 font-medium">
                Recent Posts
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex flex-col space-y-2 w-full">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    <Button asChild variant="outline">
                        <Link href="/dashboard/calendar">
                            <Calendar className="mr-2 h-4 w-4" />
                            View Calendar
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/dashboard/compose">
                            <Plus className="mr-2 h-4 w-4" />
                            New Post
                        </Link>
                    </Button>
                </div>
            </div>

            <Suspense fallback={<StatsSkeleton />}>
                <StatsCards />
            </Suspense>

            <Suspense fallback={<RecentPostsSkeleton />}>
                <RecentPosts />
            </Suspense>
        </div>
    );
}
