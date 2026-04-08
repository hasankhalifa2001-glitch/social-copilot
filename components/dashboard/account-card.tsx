/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Trash2,
    RefreshCw,
    ExternalLink,
    AlertCircle
} from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
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
import { formatDistanceToNow } from "date-fns";

interface AccountCardProps {
    account: {
        id: string;
        platform: string;
        platformUsername: string | null;
        avatarUrl: string | null;
        isActive: boolean;
        createdAt: string;
    };
    onDisconnect: () => void;
}

const platformIcons: Record<string, any> = {
    twitter: FaXTwitter,
    linkedin: FaLinkedin,
    facebook: FaFacebook,
    instagram: FaInstagram,
};

export function AccountCard({ account, onDisconnect }: AccountCardProps) {
    const Icon = platformIcons[account.platform.toLowerCase()] || AlertCircle;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg bg-primary/10`}>
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold capitalize">{account.platform}</span>
                </div>
                <Badge variant={account.isActive ? "default" : "destructive"}>
                    {account.isActive ? "Active" : "Error"}
                </Badge>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border">
                        <AvatarImage src={account.avatarUrl || ""} alt={account.platformUsername || ""} />
                        <AvatarFallback>{account.platformUsername?.slice(0, 2).toUpperCase() || "??"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">
                            {account.platformUsername || "Connected Account"}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                            Connected {formatDistanceToNow(new Date(account.createdAt))} ago
                        </span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 mt-2">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Disconnect
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Disconnect Account?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will remove Social-Copilot&apos;s access to your {account.platform} account.
                                You will no longer be able to schedule posts for this account.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onDisconnect} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Disconnect
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {!account.isActive && (
                    <Button variant="outline" size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reconnect
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
