"use client";

import { useState } from "react";
import { format, startOfWeek, addHours, startOfDay, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import CalendarEvent, { Post } from "./CalendarEvent";
import PostDetailDrawer from "./PostDetailDrawer";

interface WeekViewProps {
    currentDate: Date;
    posts: Post[];
    isLoading: boolean;
    onPostUpdate: () => void;
}

export default function WeekView({ currentDate, posts, onPostUpdate }: WeekViewProps) {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const startDate = startOfWeek(currentDate);
    const days = Array.from({ length: 7 }, (_, i) => addHours(startDate, i * 24));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const getPostsForSlot = (day: Date, hour: number) => {
        return posts.filter((post) => {
            const postDate = post.scheduledAt ? new Date(post.scheduledAt) : null;
            return postDate && isSameDay(postDate, day) && postDate.getHours() === hour;
        });
    };

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
        setIsDrawerOpen(true);
    };

    return (
        <div className="flex flex-col h-full border rounded-lg overflow-hidden">
            <div className="grid grid-cols-[60px_repeat(7,1fr)] bg-muted/50 border-b">
                <div className="py-2 border-r"></div>
                {days.map((day) => (
                    <div key={day.toISOString()} className="py-2 text-center text-sm font-medium border-r last:border-r-0">
                        <div className="text-muted-foreground">{format(day, "EEE")}</div>
                        <div className={cn(
                            "inline-flex items-center justify-center w-7 h-7 mt-1 rounded-full",
                            isSameDay(day, new Date()) && "bg-indigo-600 text-white font-bold"
                        )}>
                            {format(day, "d")}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto max-h-150">
                <div className="grid grid-cols-[60px_repeat(7,1fr)]">
                    {hours.map((hour) => (
                        <>
                            <div key={`hour-${hour}`} className="py-4 text-center text-[10px] text-muted-foreground border-r border-b">
                                {format(addHours(startOfDay(new Date()), hour), "h a")}
                            </div>
                            {days.map((day) => {
                                const slotPosts = getPostsForSlot(day, hour);
                                return (
                                    <div key={`${day}-${hour}`} className="relative border-r border-b last:border-r-0 min-h-15 p-1">
                                        {slotPosts.map((post) => (
                                            <CalendarEvent
                                                key={post.id}
                                                post={post}
                                                onClick={() => handlePostClick(post)}
                                            />
                                        ))}
                                    </div>
                                );
                            })}
                        </>
                    ))}
                </div>
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
