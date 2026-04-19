"use client"

import { PricingTable } from "@clerk/nextjs"
import { SectionWrapper } from "./section-wrapper"

export function Pricing() {
    return (
        <SectionWrapper id="pricing" className="py-24 md:py-32 bg-slate-50/50 dark:bg-black/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                        Simple, <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">transparent pricing</span>
                    </h2>
                    <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                        Choose the plan that fits your growth. No hidden fees, ever.
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-6xl rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl">
                        <PricingTable newSubscriptionRedirectUrl='/' />
                    </div>
                </div>
            </div>
        </SectionWrapper>
    )
}
