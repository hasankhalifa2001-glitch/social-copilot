import { Suspense } from "react";
import { Plus, Zap } from "lucide-react";
import { getAutomationData } from "@/lib/actions/automation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { RulesList } from "./_components/rules-list";

function AutomationHeader({ plan }: { plan: string }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Automation</h2>
                <p className="text-muted-foreground mt-1">
                    Manage your auto-reply rules and AI interactions.
                </p>
            </div>
            {plan !== "free" && (
                <Suspense fallback={<Button disabled><Plus className="mr-2 h-4 w-4" /> New Rule</Button>}>
                    <AutomationCreateButton />
                </Suspense>
            )}
        </div>
    );
}

async function AutomationCreateButton() {
    const { accounts } = await getAutomationData();
    return <RulesList.CreateButton accounts={accounts} />;
}

function PlanLimitsCard({ plan, count }: { plan: string, count: number }) {
    if (plan === "free") return null;

    const max = plan === "pro" ? 5 : "Unlimited";
    const percentage = typeof max === "number" ? (count / max) * 100 : 0;

    return (
        <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Plan Usage</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">{count} <span className="text-sm font-normal text-muted-foreground">/ {max} rules</span></span>
                </div>
                {typeof max === "number" && (
                    <Progress value={percentage} className="h-2" />
                )}
            </CardContent>
        </Card>
    );
}

async function AutomationContent() {
    const { user, rules, accounts } = await getAutomationData();

    if (user.plan === "free") {
        return (
            <div className="mt-8">
                <Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">Automation is a Pro Feature</CardTitle>
                    <CardDescription className="max-w-md mx-auto mb-6">
                        Auto-reply rules allow you to automatically respond to comments on your posts using keywords or AI. Upgrade to Pro to unlock this power.
                    </CardDescription>
                    <Button asChild size="lg" variant="default">
                        <Link href="/dashboard/billing">
                            Upgrade to Pro
                        </Link>
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PlanLimitsCard plan={user.plan} count={rules.length} />
                <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Triggers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {rules.filter(r => r.isActive).length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">AI Enabled</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {rules.filter(r => r.aiEnabled).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <RulesList rules={rules} accounts={accounts} />
        </div>
    );
}

function AutomationSkeleton() {
    return (
        <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-12" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-32 w-full" />
                ))}
            </div>
        </div>
    );
}

export default async function AutomationPage() {
    const { user } = await getAutomationData();

    return (
        <div className="container mx-auto">
            <AutomationHeader plan={user.plan} />
            <Suspense fallback={<AutomationSkeleton />}>
                <AutomationContent />
            </Suspense>
        </div>
    );
}
