/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    SiX,
    SiFacebook,
    SiInstagram,
    SiYoutube
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Music2, Pin, Hash, MessageSquare, MoreHorizontal, Heart, MessageCircle, Share2, Bookmark, RotateCw, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PostPreviewProps {
    content: Record<string, string>;
    mediaUrls: string[];
    selectedPlatforms: string[];
}

const PLATFORM_ICONS: Record<string, any> = {
    twitter: SiX,
    linkedin: FaLinkedin,
    facebook: SiFacebook,
    instagram: SiInstagram,
    tiktok: Music2,
    youtube: SiYoutube,
    pinterest: Pin,
    discord: MessageSquare,
    slack: Hash,
};

export function PostPreview({
    content,
    mediaUrls,
    selectedPlatforms,
}: PostPreviewProps) {
    if (selectedPlatforms.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-12 text-center">
                <div className="bg-muted p-4 rounded-full mb-4">
                    < MoreHorizontal className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium">Select a platform to see a preview</p>
            </div>
        );
    }

    return (
        <Tabs defaultValue={selectedPlatforms[0]} className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50 flex-nowrap">
                {selectedPlatforms.map((platform) => {
                    const Icon = PLATFORM_ICONS[platform];
                    return (
                        <TabsTrigger key={platform} value={platform} className="gap-2 px-4 py-2 capitalize shrink-0">
                            {Icon && <Icon className="w-3 h-3" />}
                            {platform}
                        </TabsTrigger>
                    );
                })}
            </TabsList>

            {selectedPlatforms.map((platform) => {
                const platformContent = content[platform] ?? content.base;
                return (
                    <TabsContent key={platform} value={platform} className="mt-6">
                        <div className="max-w-100 mx-auto">
                            {platform === "twitter" && (
                                <TwitterPreview content={platformContent} mediaUrls={mediaUrls} />
                            )}
                            {platform === "instagram" && (
                                <InstagramPreview content={platformContent} mediaUrls={mediaUrls} />
                            )}
                            {(platform !== "twitter" && platform !== "instagram") && (
                                <GenericPreview platform={platform} content={platformContent} mediaUrls={mediaUrls} />
                            )}
                        </div>
                    </TabsContent>
                );
            })}
        </Tabs>
    );
}

function TwitterPreview({ content, mediaUrls }: { content: string; mediaUrls: string[] }) {
    return (
        <Card className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-4 space-y-3">
                <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-sm truncate">User Name</span>
                            <span className="text-muted-foreground text-sm truncate">@username · 1m</span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap mt-1">{content || "Post content will appear here..."}</p>
                    </div>
                </div>

                {mediaUrls.length > 0 && (
                    <div className={cn(
                        "rounded-xl overflow-hidden border grid gap-0.5",
                        mediaUrls.length === 1 ? "grid-cols-1" : "grid-cols-2"
                    )}>
                        {mediaUrls.slice(0, 4).map((url) => (
                            <div key={url} className="relative aspect-video bg-muted">
                                <Image src={url} alt="Media" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between text-muted-foreground pt-1">
                    <MessageCircle className="w-4 h-4" />
                    <RotateCw className="w-4 h-4" />
                    <Heart className="w-4 h-4" />
                    <Share2 className="w-4 h-4" />
                </div>
            </CardContent>
        </Card>
    );
}

function InstagramPreview({ content, mediaUrls }: { content: string; mediaUrls: string[] }) {
    return (
        <Card className="border shadow-sm overflow-hidden rounded-md">
            <CardHeader className="p-3 flex-row items-center gap-3 space-y-0">
                <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-linear-to-tr from-yellow-400 via-red-500 to-purple-600" />
                </Avatar>
                <span className="text-xs font-semibold">username</span>
                <MoreHorizontal className="w-4 h-4 ml-auto" />
            </CardHeader>

            <div className="relative aspect-square bg-muted flex items-center justify-center">
                {mediaUrls.length > 0 ? (
                    <Image src={mediaUrls[0]} alt="Media" fill className="object-cover" />
                ) : (
                    <ImageIcon className="w-12 h-12 text-muted-foreground/20" />
                )}
            </div>

            <CardContent className="p-3 space-y-2">
                <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5" />
                    <MessageCircle className="w-5 h-5" />
                    <Share2 className="w-5 h-5" />
                    <Bookmark className="w-5 h-5 ml-auto" />
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-bold">12,345 likes</p>
                    <div className="text-xs whitespace-pre-wrap">
                        <span className="font-bold mr-2">username</span>
                        {content || "Your caption here..."}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase">1 minute ago</p>
                </div>
            </CardContent>
        </Card>
    );
}

function GenericPreview({ platform, content, mediaUrls }: { platform: string; content: string; mediaUrls: string[] }) {
    const Icon = PLATFORM_ICONS[platform];
    return (
        <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="p-4 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-primary" />}
                    <CardTitle className="text-xs font-semibold capitalize">{platform} Preview</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <p className="text-sm whitespace-pre-wrap">{content || "Post content will appear here..."}</p>
                {mediaUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {mediaUrls.map((url) => (
                            <div key={url} className="relative aspect-video rounded-md overflow-hidden border">
                                <Image src={url} alt="Media" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
