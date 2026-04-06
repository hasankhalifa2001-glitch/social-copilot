"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
    { title: "Features", href: "#features" },
    { title: "Pricing", href: "#pricing" },
    { title: "Blog", href: "#blog" },
]

export function Navbar() {
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <nav
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-300",
                isScrolled
                    ? "border-b bg-background/80 backdrop-blur-md"
                    : "bg-transparent"
            )}
        >
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Social Copilot</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex md:items-center md:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.title}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            {link.title}
                        </Link>
                    ))}
                    <div className="flex items-center gap-4 border-l pl-8">
                        <ThemeToggle />
                        <Button asChild size="sm">
                            <Link href="/sign-up">Get Started Free</Link>
                        </Button>
                    </div>
                </div>

                {/* Mobile Nav */}
                <div className="flex items-center gap-4 md:hidden">
                    <ThemeToggle />
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <div className="flex flex-col gap-8 py-8">
                                <Link href="/" className="flex items-center gap-2">
                                    <Sparkles className="h-6 w-6 text-primary" />
                                    <span className="text-xl font-bold">Social Copilot</span>
                                </Link>
                                <div className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.title}
                                            href={link.href}
                                            className="text-lg font-medium text-muted-foreground hover:text-primary"
                                        >
                                            {link.title}
                                        </Link>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-4 pt-4">
                                    <Button asChild className="w-full">
                                        <Link href="/sign-up">Get Started Free</Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full">
                                        <Link href="/sign-in">Sign In</Link>
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}
