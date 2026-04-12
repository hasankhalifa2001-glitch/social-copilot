import CalendarShell from "./_components/CalendarShell";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CalendarPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <Suspense fallback={<CalendarLoading />}>
                <CalendarShell />
            </Suspense>
        </div>
    );
}

function CalendarLoading() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-50" />
                    <Skeleton className="h-4 w-75" />
                </div>
                <Skeleton className="h-10 w-30" />
            </div>
            <Skeleton className="h-150 w-full" />
        </div>
    );
}
