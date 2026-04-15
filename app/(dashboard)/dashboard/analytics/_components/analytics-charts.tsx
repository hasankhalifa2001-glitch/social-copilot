"use strict";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

interface AnalyticsData {
    date: string | Date;
    followers: number | null;
    impressions: number | null;
    engagements: number | null;
    platform: string;
}

interface ChartDataItem {
    date: string;
    followers: number;
    impressions: number;
    engagements: number;
}

interface PlatformDataItem {
    name: string;
    value: number;
}

export function AnalyticsCharts({ data }: { data: AnalyticsData[] }) {
    // Process data for different charts
    const chartData = data.reduce((acc: ChartDataItem[], curr) => {
        const date = new Date(curr.date).toLocaleDateString();
        const existing = acc.find(a => a.date === date);
        if (existing) {
            existing.followers += curr.followers || 0;
            existing.impressions += curr.impressions || 0;
            existing.engagements += curr.engagements || 0;
        } else {
            acc.push({
                date,
                followers: curr.followers || 0,
                impressions: curr.impressions || 0,
                engagements: curr.engagements || 0,
            });
        }
        return acc;
    }, []).reverse();

    const platformData = data.reduce((acc: PlatformDataItem[], curr) => {
        const existing = acc.find(a => a.name === curr.platform);
        if (existing) {
            existing.value += curr.impressions || 0;
        } else if (curr.platform) {
            acc.push({ name: curr.platform, value: curr.impressions || 0 });
        }
        return acc;
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Follower Growth</CardTitle>
                </CardHeader>
                <CardContent className="h-75">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="followers" stroke="#8884d8" name="Total Followers" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Weekly Impressions</CardTitle>
                </CardHeader>
                <CardContent className="h-75">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="impressions" fill="#82ca9d" name="Impressions" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Engagement Rate Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-75">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="engagements" stroke="#ffc658" fill="#ffc658" name="Engagements" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Platform Breakdown (Impressions)</CardTitle>
                </CardHeader>
                <CardContent className="h-75">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={platformData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                            >
                                {platformData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
