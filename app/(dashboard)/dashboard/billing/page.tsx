import { db } from "@/lib/db";
import { users, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { PLAN_LIMITS, getUserPlan, checkLimit } from "@/lib/billing";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Check, X, ArrowUpCircle, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PricingTable } from "@clerk/nextjs";

export default async function BillingPage() {
    const { userId: clerkId } = await auth();
    if (!clerkId) return null;

    const user = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
        with: {
            subscription: true,
        },
    });

    if (!user) return null;

    const plan = await getUserPlan(clerkId);
    const accountsUsage = await checkLimit(clerkId, "accounts");
    const postsUsage = await checkLimit(clerkId, "postsPerMonth");
    const aiUsage = await checkLimit(clerkId, "aiGenerationsPerMonth");
    const rulesUsage = await checkLimit(clerkId, "autoReplyRules");

    const plans = [
        {
            name: "free",
            label: "Free",
            price: "$0",
            features: {
                accounts: "2 Accounts",
                posts: "10 Posts/mo",
                ai: "5 AI gens/mo",
                rules: "1 Automation",
            },
        },
        {
            name: "pro",
            label: "Pro",
            price: "$19",
            features: {
                accounts: "10 Accounts",
                posts: "200 Posts/mo",
                ai: "100 AI gens/mo",
                rules: "10 Automations",
            },
        },
        {
            name: "agency",
            label: "Agency",
            price: "$49",
            features: {
                accounts: "50 Accounts",
                posts: "1,000 Posts/mo",
                ai: "500 AI gens/mo",
                rules: "50 Automations",
            },
        },
    ];

    const getProgressColor = (current: number, limit: number) => {
        const percent = (current / limit) * 100;
        if (percent >= 80) return "bg-red-500";
        if (percent >= 50) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="container mx-auto py-10 space-y-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
                <p className="text-muted-foreground">Manage your plan and usage limits.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Plan Card */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle>Current Plan</CardTitle>
                                <CardDescription>You are currently on the {plan} plan.</CardDescription>
                            </div>
                            <Badge variant={plan === "free" ? "secondary" : "default"} className="capitalize">
                                {plan}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {user.subscription ? (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Billing Period</p>
                                    <p className="font-medium">Monthly</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Next Billing Date</p>
                                    <p className="font-medium">
                                        {user.subscription.currentPeriodEnd.toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No active paid subscription found. Upgrade to unlock more features.
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="flex gap-4">
                        <Button variant="outline" asChild>
                            <Link href="https://dashboard.clerk.com/user/billing" target="_blank">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Manage Billing
                            </Link>
                        </Button>
                        {plan === "free" && (
                            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                                <ArrowUpCircle className="mr-2 h-4 w-4" />
                                Upgrade to Pro
                            </Button>
                        )}
                    </CardFooter>
                </Card>

                {/* Usage Meters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Usage This Month</CardTitle>
                        <CardDescription>Limits reset on the 1st.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Connected Accounts</span>
                                <span className="text-muted-foreground">
                                    {accountsUsage.current ?? 0} / {accountsUsage.limit}
                                </span>
                            </div>
                            <Progress
                                value={((accountsUsage.current ?? 0) / accountsUsage.limit) * 100}
                                className="h-2"
                            // Note: Standard shadcn Progress doesn't support custom bg colors via props easily, 
                            // usually handled via CSS or custom component
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Scheduled Posts</span>
                                <span className="text-muted-foreground">
                                    {postsUsage.current ?? 0} / {postsUsage.limit}
                                </span>
                            </div>
                            <Progress value={((postsUsage.current ?? 0) / postsUsage.limit) * 100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>AI Generations</span>
                                <span className="text-muted-foreground">
                                    {aiUsage.current ?? 0} / {aiUsage.limit}
                                </span>
                            </div>
                            <Progress value={((aiUsage.current ?? 0) / aiUsage.limit) * 100} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Auto-reply Rules</span>
                                <span className="text-muted-foreground">
                                    {rulesUsage.current ?? 0} / {rulesUsage.limit}
                                </span>
                            </div>
                            <Progress value={((rulesUsage.current ?? 0) / rulesUsage.limit) * 100} className="h-2" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Plan Comparison Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Compare Plans</CardTitle>
                    <CardDescription>Choose the right plan for your needs.</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* <PricingTable checkoutSuccessUrl="/dashboard/billing" /> */}
                    <PricingTable newSubscriptionRedirectUrl="/dashboard/billing" />
                </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
                <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>View and download your past invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Invoice</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                                    No invoices found. Past invoices will appear here after your first payment.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
