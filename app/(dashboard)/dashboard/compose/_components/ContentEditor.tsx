"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const PLATFORM_LIMITS: Record<string, number> = {
    twitter: 280,
    linkedin: 3000,
    facebook: 63206,
    instagram: 2200,
    tiktok: 2200,
    youtube: 5000,
    pinterest: 500,
    discord: 2000,
    slack: 4000,
};

interface ContentEditorProps {
    content: string;
    onChange: (content: string) => void;
    selectedPlatforms: string[];
}

export function ContentEditor({
    content,
    onChange,
    selectedPlatforms,
}: ContentEditorProps) {
    const mostRestrictiveLimit = useMemo(() => {
        if (selectedPlatforms.length === 0) return null;
        return Math.min(...selectedPlatforms.map((p) => PLATFORM_LIMITS[p] || 5000));
    }, [selectedPlatforms]);

    const charCount = content.length;

    const getCountColor = () => {
        if (!mostRestrictiveLimit) return "text-muted-foreground";
        const ratio = charCount / mostRestrictiveLimit;
        if (ratio > 1) return "text-destructive";
        if (ratio > 0.8) return "text-yellow-500";
        return "text-green-500";
    };

    // Simple hashtag highlighting (simulated with CSS for now, as real Textarea highlighting is complex)
    // For a production app, we'd use a ContentEditable or a library like Draft.js/Slate

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Post Content</label>
                {mostRestrictiveLimit && (
                    <span className={cn("text-xs font-mono", getCountColor())}>
                        {charCount} / {mostRestrictiveLimit}
                    </span>
                )}
            </div>
            <Textarea
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => onChange(e.target.value)}
                className="min-h-50 resize-none"
            />
            {selectedPlatforms.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPlatforms.map((p) => (
                        <div key={p} className="text-[10px] px-2 py-0.5 rounded bg-muted border">
                            <span className="capitalize">{p}:</span> {PLATFORM_LIMITS[p] || "N/A"}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
