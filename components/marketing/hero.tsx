import Link from "next/link"
import { Play, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const platforms = [
    { name: "X (Twitter)", icon: "X" },
    { name: "LinkedIn", icon: "L" },
    { name: "Instagram", icon: "I" },
    { name: "Facebook", icon: "F" },
    { name: "TikTok", icon: "T" },
    { name: "YouTube", icon: "Y" },
    { name: "Pinterest", icon: "P" },
    { name: "Reddit", icon: "R" },
    { name: "Threads", icon: "Th" },
]

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 lg:pt-32">
            {/* Background elements */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(79,70,229,0.1)_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(45%_45%_at_50%_50%,rgba(99,102,241,0.15)_0%,rgba(9,9,11,0)_100%)]" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-8">
                    <Badge variant="outline" className="animate-pulse bg-primary/5 px-4 py-1.5 text-sm font-medium border-primary/20">
                        <Sparkles className="mr-2 h-4 w-4 text-primary" />
                        Now supporting 9 platforms ✦
                    </Badge>

                    <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        Schedule your social posts <br />
                        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                            with AI precision
                        </span>
                    </h1>

                    <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                        Compose once, schedule everywhere. Social Copilot helps you master 9 platforms with AI-powered content generation and smart scheduling.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button asChild size="lg" className="px-8 text-base">
                            <Link href="/sign-up">Start for Free</Link>
                        </Button>
                        <Button variant="ghost" size="lg" className="px-8 text-base">
                            <Play className="mr-2 h-5 w-5" />
                            Watch Demo
                        </Button>
                    </div>

                    <div className="pt-12 w-full max-w-5xl">
                        <p className="mb-8 text-sm font-medium uppercase tracking-widest text-muted-foreground/60">Supported Platforms</p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {platforms.map((p) => (
                                <div
                                    key={p.name}
                                    className="flex h-12 w-12 items-center justify-center rounded-xl border bg-card/50 shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:border-primary/50 md:h-14 md:w-14"
                                    title={p.name}
                                >
                                    <span className="text-xl font-bold text-primary/80">{p.icon}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* <div className="relative mt-16 w-full max-w-6xl overflow-hidden rounded-2xl border bg-card p-2 shadow-2xl shadow-primary/10">
                        <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted/20">
                            In a real app, this would be a high-quality dashboard screenshot
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="h-64 w-[500px] rounded-lg border bg-card shadow-lg p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                        <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
                                        <div className="h-24 w-full rounded bg-muted/50" />
                                        <div className="flex gap-2">
                                            <div className="h-8 w-24 rounded bg-primary/20" />
                                            <div className="h-8 w-24 rounded bg-muted" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
    )
}
