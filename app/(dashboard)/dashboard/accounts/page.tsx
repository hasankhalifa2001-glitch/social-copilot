"use client";

import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner"
import { useSearchParams } from "next/navigation";
import { AccountCard } from "@/components/dashboard/account-card";
import { PlatformPickerModal } from "@/components/dashboard/platform-picker-modal";

interface ConnectedAccount {
    id: string;
    platform: string;
    platformUsername: string | null;
    avatarUrl: string | null;
    isActive: boolean;
    createdAt: string;
}

function AccountsContent() {
    const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const searchParams = useSearchParams();

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/accounts");
            if (!response.ok) throw new Error("Failed to fetch accounts");
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load connected accounts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();

        const success = searchParams.get("success");
        const error = searchParams.get("error");

        if (success) {
            toast.success("Account connected successfully");
        }

        if (error) {
            toast.error(searchParams.get("message") || "Failed to connect account");
        }
    }, [searchParams]);

    const handleDisconnect = async (id: string) => {
        try {
            const response = await fetch(`/api/accounts/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to disconnect");

            setAccounts(accounts.filter((a) => a.id !== id));
            toast.success("Account disconnected");
        } catch (error) {
            toast.error("Failed to disconnect account");
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Connected Accounts</h1>
                    <p className="text-muted-foreground">
                        Manage your social media connections and status.
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Connect Account
                </Button>
            </div>

            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : accounts.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="mb-4 rounded-full bg-muted p-6">
                        <Plus className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold">Connect your first account</h2>
                    <p className="mb-8 text-muted-foreground">
                        Authorize Social-Copilot to post on your behalf.
                    </p>
                    <div className="flex gap-4">
                        <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                            Connect Account
                        </Button>

                    </div>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {accounts.map((account) => (
                        <AccountCard
                            key={account.id}
                            account={account}
                            onDisconnect={() => handleDisconnect(account.id)}
                        />
                    ))}
                </div>
            )}

            <PlatformPickerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                connectedPlatforms={accounts.map((a) => a.platform)}
            />
        </div>
    );
}

export default function AccountsPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <AccountsContent />
        </Suspense>
    );
}
