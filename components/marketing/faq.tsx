"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionWrapper } from "./section-wrapper"

const faqs = [
    {
        question: "How many social media platforms can I connect?",
        answer: "You can connect up to 9 platforms including X (Twitter), LinkedIn, Instagram, Facebook, TikTok, YouTube, Pinterest, Reddit, and Threads.",
    },
    {
        question: "Is there a free plan available?",
        answer: "Yes! Our Free plan allows you to manage up to 3 social accounts and schedule 10 posts per month at no cost.",
    },
    {
        question: "How does the AI post generation work?",
        answer: "Our AI analyzes your input and creates optimized captions and hashtags specifically tailored for each platform's unique audience and character limits.",
    },
    {
        question: "Can I schedule posts in bulk?",
        answer: "Absolutely. With our Pro and Agency plans, you can upload and schedule hundreds of posts at once using our bulk uploader.",
    },
    {
        question: "Is my data secure?",
        answer: "We use enterprise-grade encryption and official APIs to ensure your social media accounts and data remain completely secure.",
    },
    {
        question: "Can I cancel my subscription at any time?",
        answer: "Yes, you can cancel your subscription at any time from your account settings. You will continue to have access until the end of your billing cycle.",
    },
]

export function FAQ() {
    return (
        <SectionWrapper id="faq" className="py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                        Frequently Asked <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Questions</span>
                    </h2>
                    <p className="max-w-2xl text-lg text-muted-foreground">
                        Everything you need to know about Social Copilot.
                    </p>
                </div>

                <div className="mx-auto max-w-3xl">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border rounded-2xl px-6 bg-white dark:bg-neutral-900/50 shadow-sm border-slate-200 dark:border-white/10">
                                <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-indigo-600 dark:hover:text-indigo-400 py-6 transition-colors">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </SectionWrapper>
    )
}
