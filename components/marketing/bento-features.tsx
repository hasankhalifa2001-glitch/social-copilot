"use client"

import { motion, Variants } from "framer-motion"
import { Sparkles, Calendar, Share2, BarChart3, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const features = [
    {
        title: "AI Content Refiner",
        description: "Transform rough ideas into polished, platform-optimized posts. Our AI understands the nuances of each platform to maximize engagement.",
        icon: Sparkles,
        className: "md:col-span-2",
        iconColor: "text-indigo-500",
        badge: "Hero Feature",
        bgGradient: "from-indigo-500/10 to-transparent",
    },
    {
        title: "Smart Scheduling",
        description: "Post when your audience is most active. Automate your content calendar with data-driven timing.",
        icon: Calendar,
        className: "md:col-span-1",
        iconColor: "text-violet-500",
        bgGradient: "from-violet-500/10 to-transparent",
    },
    {
        title: "Multi-Platform Sync",
        description: "One click to rule them all. Sync your content across 9+ platforms simultaneously.",
        icon: Share2,
        className: "md:col-span-1",
        iconColor: "text-blue-500",
        bgGradient: "from-blue-500/10 to-transparent",
    },
    {
        title: "Analytics Dashboard",
        description: "Comprehensive insights across all your social channels. Track growth, engagement, and ROI in real-time.",
        icon: BarChart3,
        className: "md:col-span-2",
        iconColor: "text-emerald-500",
        badge: "Advanced",
        bgGradient: "from-emerald-500/10 to-transparent",
    },
]

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
}

export function BentoFeatures() {
    return (
        <section id="features" className="py-24 md:py-32 relative overflow-hidden bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400">
                            Features
                        </Badge>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                    >
                        Master your social presence <br />
                        <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                            with AI-powered tools
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-2xl text-lg text-muted-foreground"
                    >
                        Stop wrestling with multiple tabs. Our unified platform gives you everything you need to grow across all your favorite networks.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={cn("group h-full", feature.className)}
                        >
                            <Card className="h-full relative overflow-hidden transition-all duration-300 bg-white dark:bg-neutral-900/50 border-slate-200 dark:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/20">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={cn("p-3 rounded-2xl bg-slate-100 dark:bg-white/5 transition-colors group-hover:bg-white dark:group-hover:bg-white/10 shadow-sm", feature.iconColor)}>
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        {feature.badge && (
                                            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 text-[10px] uppercase tracking-wider">
                                                {feature.badge}
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="text-2xl font-bold">
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </CardDescription>

                                    <div className="mt-8 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                                        Learn more <ArrowRight className="h-4 w-4" />
                                    </div>
                                </CardContent>
                                {/* Decorative elements */}
                                <div className={cn("absolute bottom-0 right-0 w-32 h-32 bg-linear-to-br opacity-10 group-hover:opacity-20 transition-opacity -mr-8 -mb-8 rounded-full blur-2xl", feature.bgGradient)} />
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
