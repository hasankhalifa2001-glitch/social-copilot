"use client"

import Link from "next/link"
import { motion } from "framer-motion"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
        <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40">
            {/* Animated Mesh Gradient Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-[120px] dark:bg-indigo-500/20"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, -5, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-[120px] dark:bg-purple-500/20"
                />
                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
                            <Sparkles className="mr-2 h-4 w-4 fill-primary" />
                            Master your Social Media with AI ✦
                        </Badge>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-4"
                    >
                        <motion.h1
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl"
                        >
                            Schedule posts <br />
                            <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400">
                                with AI precision
                            </span>
                        </motion.h1>

                        <p className="max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl md:text-2xl leading-relaxed">
                            Compose once, schedule everywhere. Social Copilot helps you master 9 platforms with AI-powered content generation and smart scheduling.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4 pt-4"
                    >
                        <Button asChild size="lg" className="h-14 px-10 text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all">
                            <Link href="/sign-up">Start for Free</Link>
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-10 text-lg bg-background/50 backdrop-blur-sm border-white/10">
                            <Play className="mr-2 h-5 w-5 fill-current" />
                            Watch Demo
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="pt-16 w-full max-w-5xl"
                    >
                        <p className="mb-10 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/60">Seamless Integration</p>
                        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                            {platforms.map((p, i) => (
                                <motion.div
                                    key={p.name}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border bg-background/50 shadow-sm backdrop-blur-md transition-colors md:h-16 md:w-16 ${p.color}`}
                                    title={p.name}
                                >
                                    <p.icon className="h-7 w-7" />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="relative mt-20 w-full max-w-5xl"
                    >
                        <div className="absolute -inset-4 rounded-[2.5rem] bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-3xl" />
                        <Card className="relative overflow-hidden border-white/10 bg-white/70 dark:bg-black/50 backdrop-blur-xl shadow-2xl ring-1 ring-white/20">
                            <CardHeader className="border-b bg-muted/20 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-1.5">
                                            <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                            <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                                            <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground/70 tracking-tight">social-copilot.app/dashboard</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 px-3">
                                        AI Engine Active
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid gap-8 md:grid-cols-12 text-left">
                                    <div className="md:col-span-8 space-y-6">
                                        <div className="flex flex-wrap gap-3">
                                            <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20 gap-2 px-4 py-1.5">
                                                <FaXTwitter className="h-3.5 w-3.5" />
                                                Twitter
                                            </Badge>
                                            <Badge className="bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-indigo-500/20 gap-2 px-4 py-1.5">
                                                <FaLinkedin className="h-3.5 w-3.5" />
                                                LinkedIn
                                            </Badge>
                                            <Badge className="bg-pink-500/10 text-pink-600 hover:bg-pink-500/20 border-pink-500/20 gap-2 px-4 py-1.5">
                                                <FaInstagram className="h-3.5 w-3.5" />
                                                Instagram
                                            </Badge>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-foreground/70">Refined Content</span>
                                                <motion.span
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="text-[11px] font-bold text-indigo-500 uppercase tracking-tighter"
                                                >
                                                    AI Enhancing... ✨
                                                </motion.span>
                                            </div>
                                            <Textarea
                                                readOnly
                                                className="min-h-40 resize-none border-indigo-500/20 bg-muted/20 text-lg leading-relaxed focus-visible:ring-0 rounded-xl"
                                                value="🚀 Launching today! Social Copilot is the AI assistant that handles your social strategy so you can focus on building. Optimized for maximum engagement across Twitter, LinkedIn, and Instagram. #ProductLaunch #AI #SaaS"
                                            />
                                        </div>
                                    </div>
                                    <div className="md:col-span-4 space-y-6">
                                        <Card className="border-indigo-500/20 bg-indigo-500/5 shadow-none rounded-xl">
                                            <CardHeader className="p-5 pb-2">
                                                <CardTitle className="text-sm font-bold uppercase tracking-wider">Smart Schedule</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-5 pt-0 space-y-4">
                                                <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                                                    <Calendar className="h-4 w-4 text-indigo-500" />
                                                    Tomorrow, 9:00 AM
                                                </div>
                                                <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                                                    <Sparkles className="h-4 w-4 text-indigo-500" />
                                                    Peak Engagement Time
                                                </div>
                                                <Button className="w-full h-11 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all rounded-lg">
                                                    Schedule Post
                                                </Button>
                                            </CardContent>
                                        </Card>
                                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
                                            <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                                <CheckCircle2 className="h-4 w-4" />
                                                Safety Pass
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground/80 leading-snug">AI has verified character limits and media requirements for all platforms.</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
