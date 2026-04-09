"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { platformEnum } from "@/lib/db/schema";
import {
    Music2, // For TikTok
    Pin, // For Pinterest
    Hash, // For Slack/Discord generic
    MessageSquare
} from "lucide-react";
import {
    SiX,
    SiFacebook,
    SiInstagram,
    SiYoutube
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";


const PLATFORMS = [
    { id: "twitter", name: "Twitter", icon: SiX },
    { id: "linkedin", name: "LinkedIn", icon: FaLinkedin },
    { id: "facebook", name: "Facebook", icon: SiFacebook },
    { id: "instagram", name: "Instagram", icon: SiInstagram },
    { id: "tiktok", name: "TikTok", icon: Music2 },
    { id: "youtube", name: "YouTube", icon: SiYoutube },
    { id: "pinterest", name: "Pinterest", icon: Pin },
    { id: "discord", name: "Discord", icon: MessageSquare },
    { id: "slack", name: "Slack", icon: Hash },
] as const;

interface PlatformSelectorProps {
    selectedPlatforms: string[];
    connectedPlatforms: string[];
    onTogglePlatform: (platformId: string) => void;
}

export function PlatformSelector({
    selectedPlatforms,
    connectedPlatforms,
    onTogglePlatform,
}: PlatformSelectorProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium">Select Platforms</h3>
            <div className="flex flex-wrap gap-2">
                <TooltipProvider>
                    {PLATFORMS.map((platform) => {
                        const isConnected = connectedPlatforms.includes(platform.id);
                        const isSelected = selectedPlatforms.includes(platform.id);
                        const Icon = platform.icon;

                        return (
                            <Tooltip key={platform.id}>
                                <TooltipTrigger asChild>
                                    <div
                                        onClick={() => isConnected && onTogglePlatform(platform.id)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all",
                                            isConnected
                                                ? isSelected
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background hover:border-primary/50"
                                                : "opacity-50 cursor-not-allowed bg-muted"
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-xs font-medium">{platform.name}</span>
                                    </div>
                                </TooltipTrigger>
                                {!isConnected && (
                                    <TooltipContent>
                                        <p>Connect account first</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        );
                    })}
                </TooltipProvider>
            </div>
        </div>
    );
}
