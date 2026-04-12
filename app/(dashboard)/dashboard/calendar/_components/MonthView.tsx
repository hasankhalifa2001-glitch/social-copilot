"use client";

import { useState } from "react";
import { format, isSameMonth, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { cn } from "@/lib/utils";
import CalendarEvent, { Post } from "./CalendarEvent";
import { Skeleton } from "@/components/ui/skeleton";
import PostDetailDrawer from "./PostDetailDrawer";

interface MonthViewProps {
    currentDate: Date;
    posts: Post[];
    isLoading: boolean;
    onPostUpdate: () => void;
}

export default function MonthView({ currentDate, posts, isLoading, onPostUpdate }: MonthViewProps) {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const getPostsForDay = (day: Date) => {
        return posts.filter((post) => {
            const postDate = post.scheduledAt ? new Date(post.scheduledAt) : null;
            return postDate && isSameDay(postDate, day);
        });
    };

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
        setIsDrawerOpen(true);
    };

    return (
        <div className="flex flex-col h-full border rounded-lg overflow-hidden">
            <div className="grid grid-cols-7 bg-muted/50 border-b">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 flex-1">
                {calendarDays.map((day) => {
                    const dayPosts = getPostsForDay(day);
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-30 p-2 border-r border-b last:border-r-0 transition-colors hover:bg-muted/30",
                                !isCurrentMonth && "bg-muted/10 text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className={cn(
                                        "inline-flex items-center justify-center w-7 h-7 text-sm rounded-full",
                                        isToday && "bg-indigo-600 text-white font-bold"
                                    )}
                                >
                                    {format(day, "d")}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {isLoading ? (
                                    <Skeleton className="h-6 w-full" />
                                ) : (
                                    <>
                                        {dayPosts.slice(0, 3).map((post) => (
                                            <CalendarEvent
                                                key={post.id}
                                                post={post}
                                                onClick={() => handlePostClick(post)}
                                            />
                                        ))}
                                        {dayPosts.length > 3 && (
                                            <p className="text-xs text-muted-foreground font-medium pl-1">
                                                + {dayPosts.length - 3} more
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {selectedPost && (
                <PostDetailDrawer
                    post={selectedPost}
                    isOpen={isDrawerOpen}
                    onClose={() => {
                        setIsDrawerOpen(false);
                        setSelectedPost(null);
                    }}
                    onUpdate={onPostUpdate}
                />
            )}
        </div>
    );
}
