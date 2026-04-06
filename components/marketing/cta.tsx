import Link from "next/link"
import { Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CTA() {
    return (
        <section className="py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative overflow-hidden rounded-3xl bg-indigo-600 px-6 py-16 text-center text-white shadow-2xl dark:bg-indigo-500">
                    {/* Animated background elements */}
                    <div className="absolute top-0 left-0 h-full w-full opacity-10">
                        <div className="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-white blur-3xl" />
                        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 animate-pulse rounded-full bg-white blur-3xl delay-1000" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur-sm">
                            <Sparkles className="h-4 w-4" />
                            Ready to transform your social presence?
                        </div>
                        <h2 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                            Start scheduling smarter today
                        </h2>
                        <p className="max-w-lg text-lg text-indigo-100">
                            Join 5,000+ creators who are already using Social Copilot to grow their audience across 9 platforms.
                        </p>
                        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                            <Button asChild size="lg" variant="secondary" className="px-8 text-indigo-600">
                                <Link href="/sign-up">Get Started Free</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 px-8 text-white hover:bg-white/20">
                                <Link href="#pricing">View Pricing</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
