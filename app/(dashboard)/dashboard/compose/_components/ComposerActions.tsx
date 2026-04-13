/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Send, Calendar, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ComposerActionsProps {
    content: string;
    mediaUrls: string[];
    selectedPlatforms: string[];
    scheduledAt: Date | null;
}

export function ComposerActions({
    content,
    mediaUrls,
    selectedPlatforms,
    scheduledAt,
}: ComposerActionsProps) {
    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
    const router = useRouter();

    const handleAction = async (status: "draft" | "scheduled" | "published") => {
        if (selectedPlatforms.length === 0) {
            toast.error("Please select at least one platform");
            return;
        }

        if (!content.trim() && mediaUrls.length === 0) {
            toast.error("Please add some content or media");
            return;
        }

        if (status === "scheduled" && !scheduledAt) {
            toast.error("Please pick a date and time for scheduling");
            return;
        }

        setIsSubmitting(status);
        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                body: JSON.stringify({
                    content,
                    mediaUrls,
                    platforms: selectedPlatforms,
                    status,
                    scheduledAt: status === "scheduled" ? scheduledAt?.toISOString() : null,
                }),
            });

            if (!res.ok) {
                const error = await res.text();
                throw new Error(error);
            }

            toast.success(
                status === "draft"
                    ? "Draft saved!"
                    : status === "scheduled"
                        ? "Post scheduled!"
                        : "Post published!"
            );

            router.push("/dashboard");
        } catch (error: any) {
            toast.error(error.message || "Failed to save post");
        } finally {
            setIsSubmitting(null);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => handleAction("draft")}
                disabled={!!isSubmitting}
            >
                {isSubmitting === "draft" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <FileText className="w-4 h-4" />
                )}
                Save Draft
            </Button>

            <Button
                variant="secondary"
                className="flex-1 gap-2"
                onClick={() => handleAction("scheduled")}
                disabled={!!isSubmitting}
            >
                {isSubmitting === "scheduled" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Calendar className="w-4 h-4" />
                )}
                Schedule
            </Button>

            <Button
                className="flex-1 gap-2"
                onClick={() => handleAction("published")}
                disabled={!!isSubmitting}
            >
                {isSubmitting === "published" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Send className="w-4 h-4" />
                )}
                Publish Now
            </Button>
        </div>
    );
}
