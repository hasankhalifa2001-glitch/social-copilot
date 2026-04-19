"use client"

import { Star, Quote } from "lucide-react"
import { motion } from "framer-motion"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SectionWrapper } from "./section-wrapper"

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "Digital Strategist",
        quote: "Social Copilot has cut my social media management time in half. The AI suggestions are surprisingly accurate and on-brand.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    },
    {
        name: "Marcus Thorne",
        role: "Content Creator",
        quote: "The multi-platform scheduling is seamless. I love how I can customize posts for each platform without starting from scratch.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    },
    {
        name: "Elena Rodriguez",
        role: "Small Business Owner",
        quote: "Finally a tool that doesn't break the bank and actually works. The support team is also fantastic whenever I have questions.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    },
]

export function Testimonials() {
    return (
        <SectionWrapper className="py-24 md:py-32 bg-slate-50/50 dark:bg-black/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                        Loved by <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">creators worldwide</span>
                    </h2>
                    <p className="max-w-2xl text-lg text-muted-foreground">
                        Join thousands of satisfied users who have transformed their social media presence.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial, i) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card className="h-full bg-white dark:bg-neutral-900/50 border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
                                <Quote className="absolute top-4 right-4 h-12 w-12 text-indigo-500/10" />
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="h-12 w-12 ring-2 ring-indigo-500/20">
                                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-bold">{testimonial.name}</p>
                                        <p className="text-xs text-muted-foreground font-medium">{testimonial.role}</p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="h-3.5 w-3.5 fill-indigo-500 text-indigo-500" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </SectionWrapper>
    )
}
