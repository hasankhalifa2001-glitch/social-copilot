"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Sparkles, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SchedulePickerProps {
    scheduledAt: Date | null;
    setScheduledAt: (date: Date | null) => void;
    selectedPlatforms: string[];
}

export function SchedulePicker({
    scheduledAt,
    setScheduledAt,
    selectedPlatforms,
}: SchedulePickerProps) {
    const [isFindingBestTime, setIsFindingBestTime] = useState(false);
    const [time, setTime] = useState(scheduledAt ? format(scheduledAt, "HH:mm") : "12:00");

    const handleDateSelect = (date: Date | undefined) => {
        if (!date) return;
        const [hours, minutes] = time.split(":").map(Number);
        date.setHours(hours, minutes);
        setScheduledAt(date);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setTime(newTime);
        if (scheduledAt) {
            const [hours, minutes] = newTime.split(":").map(Number);
            const newDate = new Date(scheduledAt);
            newDate.setHours(hours, minutes);
            setScheduledAt(newDate);
        }
    };

    const findBestTime = async () => {
        if (selectedPlatforms.length === 0) {
            toast.error("Select platforms first!");
            return;
        }

        setIsFindingBestTime(true);
        try {
            const res = await fetch("/api/ai/best-time", {
                method: "POST",
                body: JSON.stringify({ platforms: selectedPlatforms }),
            });
            const data = await res.json();
            const suggestedDate = new Date(data.suggestedTime);
            setScheduledAt(suggestedDate);
            setTime(format(suggestedDate, "HH:mm"));
            toast.success("Optimal time suggested!");
        } catch {
            toast.error("Failed to fetch best time");
        } finally {
            setIsFindingBestTime(false);
        }
    };

    return (
        <div className="space-y-4 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Schedule Post
                </label>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] h-7 gap-1 text-primary hover:text-primary hover:bg-primary/10"
                    onClick={findBestTime}
                    disabled={isFindingBestTime}
                >
                    {isFindingBestTime ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <Sparkles className="w-3 h-3" />
                    )}
                    AI Best Time
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "justify-start text-left font-normal flex-1",
                                !scheduledAt && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduledAt ? format(scheduledAt, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={scheduledAt || undefined}
                            onSelect={handleDateSelect}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <div className="relative flex-1">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                        type="time"
                        value={time}
                        onChange={handleTimeChange}
                        aria-label="Select time"
                        className="w-full h-10 rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>

            {scheduledAt && (
                <p className="text-[10px] text-muted-foreground text-center">
                    Will be posted on {format(scheduledAt, "PPP 'at' p")} ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                </p>
            )}
        </div>
    );
}
