/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { PlatformSelector } from "./_components/PlatformSelector";
import { ContentEditor } from "./_components/ContentEditor";
import { AIAssistBar } from "./_components/AIAssistBar";
import { MediaUploader } from "./_components/MediaUploader";
import { SchedulePicker } from "./_components/SchedulePicker";
import { PostPreview } from "./_components/PostPreview";
import { ComposerActions } from "./_components/ComposerActions";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ComposePage() {
    const [content, setContent] = useState<Record<string, string>>({ base: "" });
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
    const [scheduledAt, setScheduledAt] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetch("/api/accounts");
                const accounts = await res.json();
                setConnectedPlatforms(accounts.map((a: any) => a.platform));
            } catch (error) {
                console.error("Failed to fetch accounts", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const togglePlatform = (platformId: string) => {
        setSelectedPlatforms((prev) =>
            prev.includes(platformId)
                ? prev.filter((p) => p !== platformId)
                : [...prev, platformId]
        );
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 max-w-6xl space-y-8">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-48 w-full" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <Skeleton className="h-150 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-2xl font-bold mb-8">Compose Post</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Left Column: Editor */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6 space-y-6">
                            <PlatformSelector
                                selectedPlatforms={selectedPlatforms}
                                connectedPlatforms={connectedPlatforms}
                                onTogglePlatform={togglePlatform}
                            />

                            <div className="space-y-4">
                                <ContentEditor
                                    content={content}
                                    onChange={setContent}
                                    selectedPlatforms={selectedPlatforms}
                                />
                                <AIAssistBar
                                    content={content.base}
                                    setContent={(newBase) => setContent(prev => ({ ...prev, base: newBase }))}
                                    selectedPlatforms={selectedPlatforms}
                                />
                            </div>

                            <MediaUploader
                                mediaUrls={mediaUrls}
                                setMediaUrls={setMediaUrls}
                            />

                            <SchedulePicker
                                scheduledAt={scheduledAt}
                                setScheduledAt={setScheduledAt}
                                selectedPlatforms={selectedPlatforms}
                            />

                            <ComposerActions
                                content={content}
                                mediaUrls={mediaUrls}
                                selectedPlatforms={selectedPlatforms}
                                scheduledAt={scheduledAt}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Preview */}
                <div className="lg:sticky lg:top-24">
                    <h2 className="text-sm font-medium mb-4 text-muted-foreground uppercase tracking-wider">Preview</h2>
                    <PostPreview
                        content={content}
                        mediaUrls={mediaUrls}
                        selectedPlatforms={selectedPlatforms}
                    />
                </div>
            </div>
        </div>
    );
}
