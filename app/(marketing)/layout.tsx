import React from "react";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b px-6 py-4 flex items-center justify-between">
                <div className="font-bold text-xl">Social Copilot</div>
                <nav>
                    {/* Nav items will go here */}
                </nav>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Social Copilot. All rights reserved.
            </footer>
        </div>
    );
}
