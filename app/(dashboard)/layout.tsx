"use client";

import React, { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
    LayoutDashboard,
    PenSquare,
    Calendar,
    UserCircle,
    Zap,
    CreditCard,
    Bell,
    Plus,
    Menu,
    X,
    BarChart3
} from "lucide-react";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
    { label: "Compose", icon: PenSquare, href: "/dashboard/compose" },
    { label: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
    { label: "Accounts", icon: UserCircle, href: "/dashboard/accounts" },
    { label: "Automation", icon: Zap, href: "/dashboard/automation" },
    { label: "Billing", icon: CreditCard, href: "/dashboard/billing" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { user } = useUser();

    return (
        <div className="flex h-screen overflow-hidden bg-[#ffffff] dark:bg-[#09090b] text-[#09090b] dark:text-[#fafafa]">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-60 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 md:bg-white md:dark:bg-zinc-950
                ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-6 flex items-center justify-between">
                    <Link href="/dashboard" className="font-bold text-xl block">
                        Social Copilot
                    </Link>
                    <button
                        title="Close sidebar"
                        className="md:hidden"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-zinc-100 dark:bg-white/5 text-sky-500 border-l-4 border-sky-500 rounded-l-none"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-50"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-4 h-4 transition-colors",
                                    isActive ? "text-sky-500 opacity-100" : "opacity-70"
                                )} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
                        <UserButton
                            appearance={{
                                elements: {
                                    avatarBox: "h-8 w-8"
                                }
                            }}
                        />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-semibold truncate text-zinc-900 dark:text-zinc-100">
                                {user?.fullName || user?.username || "User Profile"}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                                {user?.primaryEmailAddress?.emailAddress || "Free Plan"}
                            </span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header */}
                <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-6 flex items-center justify-between bg-white dark:bg-zinc-950">
                    <div className="flex items-center gap-4">
                        <button
                            title="Open sidebar"
                            className="md:hidden p-2 hover:bg-muted rounded-md"
                            onClick={() => setIsMobileSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="font-semibold text-lg">Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            title="Create new post"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 md:px-4 md:py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all duration-300 ease-in-out active:scale-95 shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden md:block">New Post</span>
                        </button>
                        <ThemeToggle />
                        <button
                            title="View notifications"
                            className="p-2 hover:bg-muted rounded-full transition-colors relative"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </button>
                        {/* <div className="md:hidden">
                            <UserButton />
                        </div> */}
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6 bg-zinc-50 dark:bg-zinc-900/30">
                    {children}
                </main>
            </div>
        </div>
    );
}
