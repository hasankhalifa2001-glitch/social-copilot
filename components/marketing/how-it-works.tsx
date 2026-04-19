"use client"

import { Link2, Layout, Send, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"

const steps = [
    {
        title: "Connect your accounts",
        description: "Securely link 9+ social media platforms with just a few clicks.",
        icon: Link2,
    },
    {
        title: "Compose your content",
        description: "Draft posts with AI assistance for perfect formatting and timing.",
        icon: Layout,
    },
    {
        title: "Schedule & publish",
        description: "Automate your presence with smart queues and bulk scheduling.",
        icon: Send,
    },
]

export function HowItWorks() {
    return (
        <SectionWrapper className="py-24 md:py-32 relative overflow-hidden">
            {/* Decorative line */}
            <div className="absolute top-1/2 left-0 hidden h-px w-full -translate-y-1/2 bg-linear-to-r from-transparent via-indigo-500/20 to-transparent lg:block" />

            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-20">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                        Simple process, <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">powerful results</span>
                    </h2>
                    <p className="max-w-2xl text-lg text-muted-foreground">
                        We&apos;ve streamlined the workflow so you can focus on what matters: your message.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 relative">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative flex flex-col items-center text-center group"
                        >
                            <div className="z-10 mb-8 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white dark:bg-neutral-900 border-2 border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-xl group-hover:scale-110 group-hover:border-indigo-500 transition-all duration-300">
                                <step.icon className="h-10 w-10" />
                            </div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-8xl font-black text-indigo-500/5 select-none">
                                0{index + 1}
                            </div>
                            <h3 className="mb-3 text-2xl font-bold">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed px-4">{step.description}</p>

                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-10 -right-6 text-indigo-500/20">
                                    <ArrowRight className="h-8 w-8" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    )
}
