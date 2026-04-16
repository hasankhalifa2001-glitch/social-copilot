"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil, RotateCcw } from "lucide-react";

export const PLATFORM_LIMITS: Record<string, number> = {
    twitter: 280,
    linkedin: 3000,
    facebook: 63206,
    instagram: 2200,
    tiktok: 2200,
    youtube: 5000,
    pinterest: 500,
    discord: 2000,
    slack: 40000,
};

interface ContentEditorProps {
    content: Record<string, string>;
    onChange: (content: Record<string, string>) => void;
    selectedPlatforms: string[];
}

export function ContentEditor({
    content,
    onChange,
    selectedPlatforms,
}: ContentEditorProps) {
    const [activeTab, setActiveTab] = useState<string>("base");

    const activeContent = content[activeTab] ?? content.base;
    const isOverride = activeTab !== "base" && content[activeTab] !== undefined;

    const charLimit = activeTab === "base"
        ? (selectedPlatforms.length > 0
            ? Math.min(...selectedPlatforms.map((p) => PLATFORM_LIMITS[p] || 5000))
            : 5000)
        : (PLATFORM_LIMITS[activeTab] || 5000);

    const charCount = activeContent.length;

    const getCountColor = () => {
        const ratio = charCount / charLimit;
        if (ratio > 1) return "text-destructive";
        if (ratio > 0.8) return "text-yellow-500";
        return "text-green-500";
    };

    const handleContentChange = (newText: string) => {
        onChange({
            ...content,
            [activeTab]: newText,
        });
    };

    const resetToDraft = () => {
        if (activeTab === "base") return;
        const newContent = { ...content };
        delete newContent[activeTab];
        onChange(newContent);
    };

    return (
        <div className="space-y-4">
            {selectedPlatforms.length > 0 && (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start h-auto p-1 bg-muted/50 overflow-x-auto flex-nowrap">
                        <TabsTrigger value="base" className="text-xs px-3 py-1.5">
                            All Platforms
                        </TabsTrigger>
                        {selectedPlatforms.map((p) => (
                            <TabsTrigger key={p} value={p} className="text-xs px-3 py-1.5 gap-1.5 capitalize">
                                {p}
                                {content[p] !== undefined && (
                                    <Pencil className="w-3 h-3 text-indigo-500" />
                                )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            )}

            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium capitalize">
                        {activeTab === "base" ? "Base Content" : `${activeTab} Content`}
                    </label>
                    <span className={cn("text-xs font-mono", getCountColor())}>
                        {charCount} / {charLimit}
                    </span>
                </div>
                <Textarea
                    placeholder={activeTab === "base" ? "Write your post content here... (shared across all platforms)" : `Customize content for ${activeTab}...`}
                    value={activeContent}
                    onChange={(e) => handleContentChange(e.target.value)}
                    className="min-h-40 resize-none"
                />
                {isOverride && (
                    <button
                        onClick={resetToDraft}
                        className="text-[11px] text-indigo-600 hover:text-indigo-700 underline flex items-center gap-1"
                    >
                        <RotateCcw className="w-3 h-3" />
                        Reset to base content
                    </button>
                )}
            </div>
        </div>
    );
}
