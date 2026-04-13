"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PlatformPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    connectedPlatforms: string[];
}

const platforms = [
    { id: "twitter", name: "Twitter / X" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "instagram", name: "Instagram" },
    { id: "facebook", name: "Facebook" },
    { id: "tiktok", name: "TikTok" },
    { id: "youtube", name: "YouTube" },
    { id: "pinterest", name: "Pinterest" },
    { id: "discord", name: "Discord" },
    { id: "slack", name: "Slack" },
];

export function PlatformPickerModal({
    isOpen,
    onClose,
    connectedPlatforms,
}: PlatformPickerModalProps) {
    const router = useRouter();

    const handleConnect = (platformId: string) => {
        router.push(`/api/oauth/${platformId}/authorize`);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Connect Social Account</DialogTitle>
                    <DialogDescription>
                        Choose a platform to connect to Social-Copilot.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-3 gap-4 py-4">
                    {platforms.map((platform) => {
                        const isConnected = connectedPlatforms.includes(platform.id);
                        return (
                            <Button
                                key={platform.id}
                                variant="outline"
                                className={`flex flex-col items-center justify-center h-24 gap-2 relative ${isConnected ? "border-primary bg-primary/5" : ""
                                    }`}
                                onClick={() => handleConnect(platform.id)}
                                disabled={isConnected && (platform.id === 'twitter' || platform.id === 'linkedin')}
                            >
                                <Share2 className={`h-6 w-6 ${isConnected ? "text-primary" : "text-muted-foreground"}`} />
                                <span className="text-xs font-medium">{platform.name}</span>
                                {isConnected && (
                                    <CheckCircle2 className="h-4 w-4 text-primary absolute top-2 right-2" />
                                )}
                            </Button>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
