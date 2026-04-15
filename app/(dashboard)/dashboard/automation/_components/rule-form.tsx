/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldContent,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    connectedAccountId: z.string().min(1, "Account is required"),
    triggerType: z.enum(["keyword", "any_comment"]),
    keywords: z.array(z.string()).optional(),
    replyTemplate: z.string().min(1, "Reply template is required"),
    aiEnabled: z.boolean(),
    aiPersona: z.string().optional(),
});

type RuleFormValues = z.infer<typeof formSchema>;

interface RuleFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accounts: any[];
    initialData?: any;
}

export function RuleForm({ open, onOpenChange, accounts, initialData }: RuleFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [keywordInput, setKeywordInput] = useState("");

    const form = useForm<RuleFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            connectedAccountId: "",
            triggerType: "any_comment",
            keywords: [],
            replyTemplate: "",
            aiEnabled: false,
            aiPersona: "",
        },
    });

    const triggerType = form.watch("triggerType");
    const aiEnabled = form.watch("aiEnabled");
    const keywords = form.watch("keywords") || [];

    const onSubmit = async (values: RuleFormValues) => {
        try {
            setIsSubmitting(true);
            const account = accounts.find(a => a.id === values.connectedAccountId);

            const payload = {
                ...values,
                platform: account?.platform,
            };

            const response = await fetch(
                initialData
                    ? `/api/auto-reply-rules/${initialData.id}`
                    : "/api/auto-reply-rules",
                {
                    method: initialData ? "PATCH" : "POST",
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            toast.success(initialData ? "Rule updated" : "Rule created");
            onOpenChange(false);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const addKeyword = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const val = keywordInput.trim();
            if (val && !keywords.includes(val)) {
                form.setValue("keywords", [...keywords, val]);
                setKeywordInput("");
            }
        }
    };

    const removeKeyword = (keyword: string) => {
        form.setValue("keywords", keywords.filter(k => k !== keyword));
    };

    const { register, handleSubmit, formState: { errors }, setValue } = form;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-131.25 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Rule" : "Create New Rule"}</DialogTitle>
                    <DialogDescription>
                        Set up an automated reply for your social media comments.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Field>
                        <FieldLabel>Rule Name</FieldLabel>
                        <FieldContent>
                            <Input placeholder="Support Auto-Reply" {...register("name")} />
                            {errors.name && <FieldError>{errors.name.message}</FieldError>}
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Connected Account</FieldLabel>
                        <FieldContent>
                            <Select
                                onValueChange={(val) => setValue("connectedAccountId", val)}
                                defaultValue={form.getValues("connectedAccountId")}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select account" />
                                </SelectTrigger>
                                <SelectContent>
                                    {accounts.map((account) => (
                                        <SelectItem key={account.id} value={account.id}>
                                            <span className="capitalize">{account.platform}</span> ({account.platformUsername})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.connectedAccountId && <FieldError>{errors.connectedAccountId.message}</FieldError>}
                        </FieldContent>
                    </Field>

                    <Field>
                        <FieldLabel>Trigger Type</FieldLabel>
                        <FieldContent>
                            <RadioGroup
                                onValueChange={(val: any) => setValue("triggerType", val)}
                                defaultValue={form.getValues("triggerType")}
                                className="flex flex-col space-y-1"
                            >
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="any_comment" id="any_comment" />
                                    <label htmlFor="any_comment">Any Comment</label>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <RadioGroupItem value="keyword" id="keyword" />
                                    <label htmlFor="keyword">Keyword Match</label>
                                </div>
                            </RadioGroup>
                            {errors.triggerType && <FieldError>{errors.triggerType.message}</FieldError>}
                        </FieldContent>
                    </Field>

                    {triggerType === "keyword" && (
                        <Field>
                            <FieldLabel>Keywords</FieldLabel>
                            <FieldContent>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Press enter to add keywords"
                                        value={keywordInput}
                                        onChange={(e) => setKeywordInput(e.target.value)}
                                        onKeyDown={addKeyword}
                                    />
                                    <div className="flex flex-wrap gap-2">
                                        {keywords.map((k) => (
                                            <Badge key={k} variant="secondary">
                                                {k}
                                                <button
                                                    type="button"
                                                    onClick={() => removeKeyword(k)}
                                                    className="ml-1 hover:text-destructive"
                                                    aria-label={`Remove ${k}`}
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </FieldContent>
                        </Field>
                    )}

                    <Field>
                        <FieldLabel>Reply Template</FieldLabel>
                        <FieldContent>
                            <Textarea
                                placeholder="Hi {{username}}, thanks for the comment!"
                                {...register("replyTemplate")}
                            />
                            <div className="flex items-center justify-between mt-1">
                                <FieldDescription>
                                    Use <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-primary">{"{{username}}"}</code> to mention the commenter.
                                </FieldDescription>
                            </div>
                            {errors.replyTemplate && <FieldError>{errors.replyTemplate.message}</FieldError>}
                        </FieldContent>
                    </Field>

                    <Field orientation="horizontal" className="justify-between">
                        <FieldContent>
                            <FieldLabel>AI Powered Reply</FieldLabel>
                            <FieldDescription>
                                Use AI to generate personalized replies.
                            </FieldDescription>
                        </FieldContent>
                        <Switch
                            checked={aiEnabled}
                            onCheckedChange={(val) => setValue("aiEnabled", val)}
                        />
                    </Field>

                    {aiEnabled && (
                        <Field>
                            <FieldLabel>AI Persona / Instructions</FieldLabel>
                            <FieldContent>
                                <Textarea
                                    placeholder="Be helpful, professional and concise. Don't use emojis."
                                    {...register("aiPersona")}
                                />
                                {errors.aiPersona && <FieldError>{errors.aiPersona.message}</FieldError>}
                            </FieldContent>
                        </Field>
                    )}

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full"
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Update Rule" : "Create Rule"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
