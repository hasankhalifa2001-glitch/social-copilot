import Link from "next/link"
import { Calendar, CheckCircle2, Play, Sparkles } from "lucide-react"
import {
    FaDiscord,
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaPinterest,
    FaSlack,
    FaTiktok,
    FaXTwitter,
    FaYoutube,
} from "react-icons/fa6"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

const platforms = [
    { name: "X (Twitter)", icon: FaXTwitter, color: "hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50" },
    { name: "LinkedIn", icon: FaLinkedin, color: "hover:text-[#0077B5] hover:border-[#0077B5]/50" },
    { name: "Instagram", icon: FaInstagram, color: "hover:text-[#E4405F] hover:border-[#E4405F]/50" },
    { name: "Facebook", icon: FaFacebook, color: "hover:text-[#1877F2] hover:border-[#1877F2]/50" },
    { name: "TikTok", icon: FaTiktok, color: "hover:text-[#000000] dark:hover:text-white hover:border-black/50 dark:hover:border-white/50" },
    { name: "YouTube", icon: FaYoutube, color: "hover:text-[#FF0000] hover:border-[#FF0000]/50" },
    { name: "Pinterest", icon: FaPinterest, color: "hover:text-[#BD081C] hover:border-[#BD081C]/50" },
    { name: "Discord", icon: FaDiscord, color: "hover:text-[#5865F2] hover:border-[#5865F2]/50" },
    { name: "Slack", icon: FaSlack, color: "hover:text-[#4A154B] hover:border-[#4A154B]/50" },
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
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl border bg-card/50 shadow-sm backdrop-blur-sm transition-all hover:scale-110 md:h-14 md:w-14 ${p.color}`}
                                    title={p.name}
                                >
                                    <p.icon className="h-6 w-6" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative mt-16 w-full max-w-5xl">
                        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-2xl" />
                        <Card className="relative overflow-hidden border-indigo-500/20 bg-card/80 backdrop-blur-md shadow-2xl">
                            <CardHeader className="border-b bg-muted/30 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1.5">
                                            <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                                            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                                        </div>
                                        <span className="ml-2 text-xs font-medium text-muted-foreground">social-copilot.app/dashboard</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20">
                                        Preview Mode
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid gap-6 md:grid-cols-12">
                                    <div className="md:col-span-8 space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20 gap-1.5 px-3 py-1">
                                                <FaXTwitter className="h-3 w-3" />
                                                Twitter
                                            </Badge>
                                            <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-indigo-500/20 gap-1.5 px-3 py-1">
                                                <FaLinkedin className="h-3 w-3" />
                                                LinkedIn
                                            </Badge>
                                            <Badge className="bg-pink-500/10 text-pink-600 hover:bg-pink-500/20 border-pink-500/20 gap-1.5 px-3 py-1">
                                                <FaInstagram className="h-3 w-3" />
                                                Instagram
                                            </Badge>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-medium text-muted-foreground">Post Content</span>
                                                <span className="text-[10px] text-muted-foreground/60 italic">AI Refined ✨</span>
                                            </div>
                                            <Textarea
                                                readOnly
                                                className="min-h-[120px] resize-none border-indigo-500/10 bg-muted/30 focus-visible:ring-0"
                                                value="🚀 Excited to share our latest product update! AI-powered scheduling is now live across all 9 platforms. Try it free today and boost your social presence... #SocialMedia #AI #Productivity"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-4 space-y-4">
                                        <Card className="border-indigo-500/10 bg-indigo-500/5 shadow-none">
                                            <CardHeader className="p-4 pb-2">
                                                <CardTitle className="text-sm font-semibold">Schedule Settings</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0 space-y-3">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                                                    Tomorrow, 9:00 AM
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                                                    Optimized for engagement
                                                </div>
                                                <Button className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-700">
                                                    Schedule Post
                                                </Button>
                                            </CardContent>
                                        </Card>
                                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                                            <div className="flex items-center gap-2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Readiness Check
                                            </div>
                                            <p className="mt-1 text-xs text-muted-foreground">Post meets character limits for all 3 selected platforms.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
