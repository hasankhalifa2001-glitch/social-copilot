"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SectionWrapper } from "./section-wrapper"

export function CTA() {
    return (
        <SectionWrapper className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 px-6 py-20 text-center text-white shadow-2xl dark:bg-indigo-500">
                    {/* Background elements */}
                    <div className="absolute inset-0 -z-10">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.1, 0.2, 0.1],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] bg-[radial-gradient(circle,white_0%,transparent_50%)]"
                        />
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-2 text-sm font-bold backdrop-blur-md ring-1 ring-white/30"
                        >
                            <Sparkles className="h-4 w-4 fill-white" />
                            JOIN 5,000+ CREATORS TODAY
                        </motion.div>

                        <h2 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight">
                            Ready to transform your <br />
                            <span className="text-indigo-200">social presence?</span>
                        </h2>

                        <p className="max-w-xl text-lg text-indigo-100/90 sm:text-xl leading-relaxed">
                            Start scheduling smarter with AI-powered insights and multi-platform sync. Your audience is waiting.
                        </p>

                        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                            <Button asChild size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold text-indigo-600 shadow-xl hover:scale-105 transition-transform">
                                <Link href="/sign-up">Get Started Free</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg font-bold border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                                <Link href="#pricing">
                                    View Pricing <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </SectionWrapper>
    )
}
