"use client"

import { Users } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import { SectionWrapper } from "./section-wrapper"

export function SocialProof() {
    return (
        <SectionWrapper className="border-y bg-muted/30 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="relative h-12 w-12 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden shadow-sm"
                                >
                                    <Image
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                                        alt="Avatar"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </motion.div>
                            ))}
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-sm font-bold">
                                <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <span>Trusted by 5,000+ creators</span>
                            </div>
                            <p className="text-xs text-muted-foreground font-medium">Growing every single day</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        {["TechFlow", "CreatorHub", "Socially", "MediaPro", "GrowthSync"].map((name, i) => (
                            <motion.span
                                key={name}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 0.5 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                                whileHover={{ opacity: 1, scale: 1.05 }}
                                className="text-xl font-black tracking-tighter text-foreground/70 transition-all cursor-default"
                            >
                                {name}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    )
}
