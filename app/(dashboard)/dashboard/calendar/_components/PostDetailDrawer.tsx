"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter
} from "@/components/ui/sheet";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { FaXTwitter, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa6";
import { Calendar as CalendarIcon, Clock, Globe, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Post } from "./CalendarEvent";
import { IconType } from "react-icons";

interface PostDetailDrawerProps {
    post: Post;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const platformIcons: Record<string, IconType> = {
    twitter: FaXTwitter,
    linkedin: FaLinkedin,
    facebook: FaFacebook,
    instagram: FaInstagram,
};

const statusColors: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function PostDetailDrawer({ post, isOpen, onClose, onUpdate }: PostDetailDrawerProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Post deleted successfully");
                onUpdate();
                onClose();
            } else {
                toast.error("Failed to delete post");
            }
        } catch {
            toast.error("An error occurred");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = () => {
        router.push(`/dashboard/compose?id=${post.id}`);
    };

    const platforms = (post.platforms as string[]) || [];
    const platformResults = post.platformResults || [];
    const mediaUrls = (post.mediaUrls as string[]) || [];

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-md overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center justify-between">
                        <Badge className={cn("uppercase text-[10px]", statusColors[post.status])}>
                            {post.status}
                        </Badge>
                        <div className="flex -space-x-2">
                            {platforms.map((p) => {
                                const Icon = platformIcons[p] || FaXTwitter;
                                return (
                                    <div key={p} className="bg-background border rounded-full p-1 shadow-sm">
                                        <Icon className="h-3 w-3" />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <SheetTitle className="text-xl mt-4">Post Details</SheetTitle>
                    <SheetDescription>
                        View and manage your scheduled content.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            Content
                        </h4>
                        <div className="p-3 bg-muted/30 rounded-lg text-sm whitespace-pre-wrap border">
                            {post.content}
                        </div>
                    </div>

                    {mediaUrls.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Media</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {mediaUrls.map((url: string, i: number) => (
                                    <div key={i} className="aspect-square relative rounded-md overflow-hidden border">
                                        <Image
                                            src={url}
                                            alt={`Media ${i}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                Date
                            </span>
                            <p className="text-sm font-medium">
                                {post.scheduledAt ? format(new Date(post.scheduledAt), "MMM d, yyyy") : "N/A"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Time
                            </span>
                            <p className="text-sm font-medium">
                                {post.scheduledAt ? format(new Date(post.scheduledAt), "h:mm a") : "N/A"}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <h4 className="text-sm font-semibold">Platform Status</h4>
                        {platforms.map((p) => {
                            const result = platformResults.find((r) => r.platform === p);
                            const Icon = platformIcons[p] || FaXTwitter;

                            return (
                                <div key={p} className="flex items-center justify-between p-2 rounded-md border bg-muted/10">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        <span className="text-sm capitalize">{p}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {result ? (
                                            <Badge variant={result.status === "published" ? "default" : "destructive"} className="text-[10px]">
                                                {result.status}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px]">
                                                {post.status === "scheduled" ? "Pending" : "Not Started"}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <SheetFooter className="mt-8 flex-col sm:flex-col gap-2">
                    <Button className="w-full" variant="outline" onClick={handleEdit}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Post
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                className="w-full"
                                variant="destructive"
                                disabled={isDeleting}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {isDeleting ? "Deleting..." : "Delete Post"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    scheduled post and cancel any upcoming publishing.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Delete
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
