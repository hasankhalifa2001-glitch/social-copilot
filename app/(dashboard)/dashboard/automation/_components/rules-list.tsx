/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    MessageSquare,
    Bot,
    Zap,
} from "lucide-react";
import {
    Card,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { RuleForm } from "./rule-form";

interface RulesListProps {
    rules: any[];
    accounts: any[];
}

export function RulesList({ rules, accounts }: RulesListProps) {
    const router = useRouter();
    const [editingRule, setEditingRule] = useState<any>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Expose setter for the create button component
    (RulesList as any).setOpen = setIsCreateModalOpen;

    const toggleActive = async (ruleId: string, currentState: boolean) => {
        try {
            const response = await fetch(`/api/auto-reply-rules/${ruleId}`, {
                method: "PATCH",
                body: JSON.stringify({ isActive: !currentState }),
            });

            if (!response.ok) throw new Error("Failed to toggle rule");

            toast.success(currentState ? "Rule disabled" : "Rule enabled");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    const deleteRule = async (ruleId: string) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;

        try {
            const response = await fetch(`/api/auto-reply-rules/${ruleId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete rule");

            toast.success("Rule deleted");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    };

    if (rules.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 mt-8">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-full mb-4">
                    <MessageSquare className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="text-lg font-medium">No rules yet</h3>
                <p className="text-muted-foreground max-w-sm text-center mt-2 mb-6">
                    Create your first auto-reply rule to start engaging with your audience automatically.
                </p>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Rule
                </Button>
                <RuleForm
                    open={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                    accounts={accounts}
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {rules.map((rule) => (
                <Card key={rule.id} className="group overflow-hidden">
                    <div className="flex items-center p-6 gap-6">
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{rule.name}</h3>
                                <Badge variant="secondary" className="capitalize">
                                    {rule.platform}
                                </Badge>
                                {rule.aiEnabled && (
                                    <Badge variant="outline" className="text-blue-500 border-blue-500 gap-1">
                                        <Bot className="h-3 w-3" />
                                        AI Powered
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    {rule.triggerType === "any_comment" ? "Any Comment" : "Keyword Match"}
                                </span>
                                {rule.triggerType === "keyword" && rule.keywords?.length > 0 && (
                                    <div className="flex items-center gap-1 overflow-hidden">
                                        {rule.keywords.slice(0, 3).map((k: string) => (
                                            <Badge key={k} variant="secondary" className="text-[10px] h-4">
                                                {k}
                                            </Badge>
                                        ))}
                                        {rule.keywords.length > 3 && (
                                            <span className="text-[10px]">+{rule.keywords.length - 3} more</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end gap-1">
                                <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1">
                                    {rule.isActive ? "Active" : "Paused"}
                                </span>
                                <Switch
                                    checked={rule.isActive}
                                    onCheckedChange={() => toggleActive(rule.id, rule.isActive)}
                                />
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setEditingRule(rule)}>
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => deleteRule(rule.id)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="px-6 pb-6 pt-0">
                        <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-md p-3 border border-zinc-100 dark:border-zinc-800 text-sm italic text-zinc-600 dark:text-zinc-400">
                            &quot;{rule.replyTemplate}&quot;
                        </div>
                    </div>
                </Card>
            ))}

            {editingRule && (
                <RuleForm
                    open={!!editingRule}
                    onOpenChange={(open) => !open && setEditingRule(null)}
                    accounts={accounts}
                    initialData={editingRule}
                />
            )}

            <RuleForm
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                accounts={accounts}
            />
        </div>
    );
}

RulesList.CreateButton = function CreateButton({ accounts }: { accounts: any[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                New Rule
            </Button>
            <RuleForm
                open={isOpen}
                onOpenChange={setIsOpen}
                accounts={accounts}
            />
        </>
    );
};
