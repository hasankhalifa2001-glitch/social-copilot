"use strict";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BarChart2, MousePointer2, Send } from "lucide-react";

interface AnalyticsSnapshot {
    platform: string;
    date: Date | string;
    followers: number | null;
    impressions: number | null;
    engagements: number | null;
}

interface StatsProps {
    data: AnalyticsSnapshot[];
    totalPosts: number;
}

export function AnalyticsStats({ data, totalPosts }: StatsProps) {
    // Total Followers (sum across all accounts - latest snapshot per platform)
    const platforms = Array.from(new Set(data.map(d => d.platform)));
    const totalFollowers = platforms.reduce((sum, platform) => {
        const platformSnapshots = data.filter(d => d.platform === platform);
        const latest = platformSnapshots.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        return sum + (latest?.followers || 0);
    }, 0);

    const totalImpressions = data.reduce((sum, d) => sum + (d.impressions || 0), 0);
    const totalEngagements = data.reduce((sum, d) => sum + (d.engagements || 0), 0);

    const stats = [
        {
            title: "Total Followers",
            value: totalFollowers.toLocaleString(),
            icon: Users,
            description: "Across all platforms",
        },
        {
            title: "Total Impressions",
            value: totalImpressions.toLocaleString(),
            icon: BarChart2,
            description: "In selected period",
        },
        {
            title: "Total Engagements",
            value: totalEngagements.toLocaleString(),
            icon: MousePointer2,
            description: "In selected period",
        },
        {
            title: "Posts Published",
            value: totalPosts.toLocaleString(),
            icon: Send,
            description: "Total published posts",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        <stat.icon className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
