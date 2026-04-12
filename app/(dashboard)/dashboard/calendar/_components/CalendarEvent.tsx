"use client";

import { posts } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { InferSelectModel } from "drizzle-orm";
import { FaXTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa6";
import { IconType } from "react-icons";

export type Post = InferSelectModel<typeof posts> & {
    platformResults?: {
        platform: string;
        status: string;
    }[];
};

interface CalendarEventProps {
    post: Post;
    onClick: () => void;
}

const platformIcons: Record<string, IconType> = {
    twitter: FaXTwitter,
    linkedin: FaLinkedin,
    facebook: FaFacebook,
    instagram: FaInstagram,
};

const platformColors: Record<string, string> = {
    twitter: "bg-[#000000] text-white",
    linkedin: "bg-[#0A66C2] text-white",
    instagram: "bg-[#E4405F] text-white",
    facebook: "bg-[#1877F2] text-white",
};

export default function CalendarEvent({ post, onClick }: CalendarEventProps) {
    const platforms = (post.platforms as string[]) || [];
    const firstPlatform = platforms[0] || "twitter";
    const Icon = platformIcons[firstPlatform] || FaXTwitter;

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-[10px] font-medium transition-opacity hover:opacity-80 truncate text-left",
                platformColors[firstPlatform] || "bg-muted text-muted-foreground"
            )}
        >
            <Icon className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{post.content}</span>
        </button>
    );
}
