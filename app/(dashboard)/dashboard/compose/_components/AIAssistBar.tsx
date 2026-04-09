"use client";

import { Button } from "@/components/ui/button";
import {
    Sparkles,
    RotateCw,
    Hash,
    Lightbulb,
    Loader2
} from "lucide-react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface AIAssistBarProps {
    content: string;
    setContent: (content: string) => void;
    selectedPlatforms: string[];
}

export function AIAssistBar({
    content,
    setContent,
    selectedPlatforms,
}: AIAssistBarProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRewriting, setIsRewriting] = useState(false);
    const [isSuggestingHashtags, setIsSuggestingHashtags] = useState(false);
    const [isFetchingIdeas, setIsFetchingIdeas] = useState(false);

    const [generateModalOpen, setGenerateModalOpen] = useState(false);
    const [ideasSheetOpen, setIdeasSheetOpen] = useState(false);

    const [topic, setTopic] = useState("");
    const [tone, setTone] = useState("professional");
    const [ideas, setIdeas] = useState<string[]>([]);

    const handleGenerate = async () => {
        if (!topic || selectedPlatforms.length === 0) {
            toast.error("Please select a platform and enter a topic");
            return;
        }

        setIsGenerating(true);
        try {
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                body: JSON.stringify({
                    topic,
                    tone,
                    platform: selectedPlatforms[0],
                    charLimit: 280, // Default for now
                }),
            });

            const data = await res.json();
            setContent(data.text);
            setGenerateModalOpen(false);
            toast.success("Content generated!");
        } catch (error) {
            toast.error("Failed to generate content");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRewrite = async () => {
        if (!content || selectedPlatforms.length === 0) {
            toast.error("Nothing to rewrite!");
            return;
        }

        setIsRewriting(true);
        try {
            const res = await fetch("/api/ai/rewrite", {
                method: "POST",
                body: JSON.stringify({
                    content,
                    platform: selectedPlatforms[0],
                    tone,
                }),
            });

            const data = await res.json();
            setContent(data.text);
            toast.success("Content rewritten!");
        } catch (error) {
            toast.error("Failed to rewrite content");
        } finally {
            setIsRewriting(false);
        }
    };

    const handleHashtags = async () => {
        if (!content || selectedPlatforms.length === 0) {
            toast.error("Nothing to analyze!");
            return;
        }

        setIsSuggestingHashtags(true);
        try {
            const res = await fetch("/api/ai/hashtags", {
                method: "POST",
                body: JSON.stringify({
                    content,
                    platform: selectedPlatforms[0],
                }),
            });

            const data = await res.json();
            setContent(content + "\n\n" + data.text);
            toast.success("Hashtags added!");
        } catch (error) {
            toast.error("Failed to suggest hashtags");
        } finally {
            setIsSuggestingHashtags(false);
        }
    };

    const handleFetchIdeas = async () => {
        if (selectedPlatforms.length === 0) {
            toast.error("Select a platform first!");
            return;
        }

        setIsFetchingIdeas(true);
        setIdeasSheetOpen(true);
        try {
            const res = await fetch("/api/ai/ideas", {
                method: "POST",
                body: JSON.stringify({
                    platform: selectedPlatforms[0],
                }),
            });

            const data = await res.json();
            setIdeas(data);
        } catch (error) {
            toast.error("Failed to fetch ideas");
        } finally {
            setIsFetchingIdeas(false);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 py-2">
            <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setGenerateModalOpen(true)}
                disabled={isGenerating}
            >
                <Sparkles className="w-4 h-4" />
                AI Generate
            </Button>

            <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleRewrite}
                disabled={isRewriting || !content}
            >
                {isRewriting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <RotateCw className="w-4 h-4" />
                )}
                Rewrite
            </Button>

            <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleHashtags}
                disabled={isSuggestingHashtags || !content}
            >
                {isSuggestingHashtags ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Hash className="w-4 h-4" />
                )}
                Hashtags
            </Button>

            <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleFetchIdeas}
                disabled={isFetchingIdeas}
            >
                <Lightbulb className="w-4 h-4" />
                Ideas
            </Button>

            {/* Generate Modal */}
            <Dialog open={generateModalOpen} onOpenChange={setGenerateModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>AI Content Generator</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>What is this post about?</Label>
                            <Input
                                placeholder="e.g. New feature launch for Social Copilot"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tone</Label>
                            <Select value={tone} onValueChange={setTone}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="casual">Casual</SelectItem>
                                    <SelectItem value="witty">Witty</SelectItem>
                                    <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleGenerate} disabled={isGenerating}>
                            {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate Post
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Ideas Sheet */}
            <Sheet open={ideasSheetOpen} onOpenChange={setIdeasSheetOpen}>
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Content Ideas</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-100px)] mt-4">
                        <div className="space-y-4 pr-4">
                            {isFetchingIdeas ? (
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div
                                            key={i}
                                            className="h-20 w-full bg-muted animate-pulse rounded-lg"
                                        />
                                    ))}
                                </div>
                            ) : (
                                ideas.map((idea, index) => (
                                    <div
                                        key={index}
                                        className="p-4 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                                        onClick={() => {
                                            setTopic(idea);
                                            setGenerateModalOpen(true);
                                            setIdeasSheetOpen(false);
                                        }}
                                    >
                                        <p className="text-sm">{idea}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
}
