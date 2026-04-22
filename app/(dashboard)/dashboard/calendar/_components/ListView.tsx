"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, MoreVertical } from "lucide-react";
import { FaXTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa6";
import PostDetailDrawer from "./PostDetailDrawer";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Post } from "./CalendarEvent";
import { IconType } from "react-icons";
import { cn, parsePostContent } from "@/lib/utils";

interface ListViewProps {
    posts: Post[];
    isLoading: boolean;
    onPostUpdate: () => void;
}

const platformIcons: Record<string, IconType> = {
    twitter: FaXTwitter,
    linkedin: FaLinkedin,
    facebook: FaFacebook,
    instagram: FaInstagram,
};

const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function ListView({ posts, isLoading, onPostUpdate }: ListViewProps) {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handlePostClick = (post: Post) => {
        setSelectedPost(post);
        setIsDrawerOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Post deleted successfully");
                onPostUpdate();
            }
        } catch {
            toast.error("Failed to delete post");
        }
    };

    if (posts.length === 0 && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-muted rounded-full p-6 mb-4">
                    <Edit2 className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No posts found</h3>
                <p className="text-muted-foreground max-w-sm">
                    No posts scheduled for this period. Start by creating a new post.
                </p>
            </div>
        );
    }

    // Group posts by date
    const groupedPosts: Record<string, Post[]> = {};
    posts.forEach((post) => {
        const dateKey = post.scheduledAt
            ? format(new Date(post.scheduledAt), "yyyy-MM-dd")
            : "unscheduled";
        if (!groupedPosts[dateKey]) groupedPosts[dateKey] = [];
        groupedPosts[dateKey].push(post);
    });

    const sortedDates = Object.keys(groupedPosts).sort();

    return (
        <div className="space-y-8">
            {sortedDates.map((dateKey) => (
                <div key={dateKey}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4 bg-muted/50 px-3 py-1 rounded-md inline-block">
                        {dateKey === "unscheduled"
                            ? "Unscheduled"
                            : format(new Date(dateKey), "EEEE, MMMM do, yyyy")}
                    </h3>
                    <div className="space-y-3">
                        {groupedPosts[dateKey].map((post) => (
                            <div
                                key={post.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                                onClick={() => handlePostClick(post)}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="flex -space-x-2">
                                        {(post.platforms as string[]).map((p) => {
                                            const Icon = platformIcons[p] || FaXTwitter;
                                            return (
                                                <div key={p} className="bg-background border rounded-full p-1.5 shadow-sm">
                                                    <Icon className="h-4 w-4" />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate max-w-125">
                                            {parsePostContent(post.content)}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-muted-foreground">
                                                {post.scheduledAt ? format(new Date(post.scheduledAt), "h:mm a") : "No time"}
                                            </span>
                                            <Badge variant="secondary" className={cn("text-[10px] uppercase", statusColors[post.status])}>
                                                {post.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handlePostClick(post)}>
                                                View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(post.id)}>
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

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
