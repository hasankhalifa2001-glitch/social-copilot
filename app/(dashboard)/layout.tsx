"use client";

import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
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
    X
} from "lucide-react";

const sidebarItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
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

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-[240px] border-r bg-background flex flex-col transition-transform duration-300 md:relative md:translate-x-0 md:bg-muted/30
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
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors"
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 px-3 py-2">
                        <UserButton />
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">User Profile</span>
                            <span className="text-xs text-muted-foreground truncate">Free Plan</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header */}
                <header className="h-16 border-b px-4 md:px-6 flex items-center justify-between bg-background">
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
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            New Post
                        </button>
                        <button
                            title="View notifications"
                            className="p-2 hover:bg-muted rounded-full transition-colors relative"
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
                        </button>
                        <div className="md:hidden">
                            <UserButton />
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6 bg-muted/10">
                    {children}
                </main>
            </div>
        </div>
    );
}
