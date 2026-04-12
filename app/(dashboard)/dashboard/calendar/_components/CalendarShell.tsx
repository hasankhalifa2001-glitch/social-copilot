"use client";

import { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, LayoutGrid, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import ListView from "./ListView";
import CalendarFilters from "./CalendarFilters";
import { useRouter } from "next/navigation";

export default function CalendarShell() {
    const router = useRouter();

    const [view, setView] = useState<"month" | "week" | "list">("month");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        platform: "all",
        status: "all",
    });

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            let from, to;
            if (view === "month") {
                from = startOfMonth(currentDate).toISOString();
                to = endOfMonth(currentDate).toISOString();
            } else if (view === "week") {
                from = startOfWeek(currentDate).toISOString();
                to = endOfWeek(currentDate).toISOString();
            } else {
                // For list view, maybe fetch a wider range or just current month
                from = startOfMonth(currentDate).toISOString();
                to = endOfMonth(currentDate).toISOString();
            }

            const queryParams = new URLSearchParams({
                from,
                to,
                platform: filters.platform,
                status: filters.status,
            });

            const response = await fetch(`/api/posts?${queryParams.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentDate, view, filters]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handlePrev = () => {
        if (view === "month") setCurrentDate(subMonths(currentDate, 1));
        else setCurrentDate(addDays(currentDate, -7));
    };

    const handleNext = () => {
        if (view === "month") setCurrentDate(addMonths(currentDate, 1));
        else setCurrentDate(addDays(currentDate, 7));
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    return (
        <div className="flex flex-col space-y-4 h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Content Calendar</h1>
                    <p className="text-muted-foreground">
                        Manage and schedule your social media posts.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => router.push("/dashboard/compose")}
                        className="hidden md:flex"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Post
                    </Button>
                </div>
            </div>

            <Card className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-muted rounded-md p-1">
                            <Button variant="ghost" size="icon" onClick={handlePrev}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" className="px-3" onClick={handleToday}>
                                Today
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleNext}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <h2 className="text-lg font-semibold min-w-37.5 text-center">
                            {format(currentDate, view === "month" ? "MMMM yyyy" : "MMM d, yyyy")}
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <CalendarFilters filters={filters} setFilters={setFilters} />

                        <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week" | "list")} className="w-auto">
                            <TabsList>
                                <TabsTrigger value="month">
                                    <LayoutGrid className="h-4 w-4 mr-2" />
                                    Month
                                </TabsTrigger>
                                <TabsTrigger value="week">
                                    <CalendarIcon className="h-4 w-4 mr-2" />
                                    Week
                                </TabsTrigger>
                                <TabsTrigger value="list">
                                    <List className="h-4 w-4 mr-2" />
                                    List
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                <div className="min-h-150 relative">
                    {view === "month" && (
                        <MonthView
                            currentDate={currentDate}
                            posts={posts}
                            isLoading={isLoading}
                            onPostUpdate={fetchPosts}
                        />
                    )}
                    {view === "week" && (
                        <WeekView
                            currentDate={currentDate}
                            posts={posts}
                            isLoading={isLoading}
                            onPostUpdate={fetchPosts}
                        />
                    )}
                    {view === "list" && (
                        <ListView
                            posts={posts}
                            isLoading={isLoading}
                            onPostUpdate={fetchPosts}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
}
