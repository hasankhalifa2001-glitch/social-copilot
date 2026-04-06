import Link from "next/link"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const plans = [
    {
        name: "Free",
        price: "$0",
        description: "Perfect for getting started with 1-2 profiles.",
        features: ["3 Social accounts", "10 Scheduled posts/mo", "Basic AI generation", "Community support"],
        buttonText: "Start for Free",
        popular: false,
    },
    {
        name: "Pro",
        price: "$29",
        description: "Best for growing creators and small teams.",
        features: ["15 Social accounts", "Unlimited posts", "Advanced AI tools", "Priority support", "Analytics dashboard"],
        buttonText: "Get Pro Now",
        popular: true,
    },
    {
        name: "Agency",
        price: "$99",
        description: "For agencies managing multiple clients.",
        features: ["Unlimited accounts", "Team collaboration", "White-label reports", "Dedicated account manager", "Custom API access"],
        buttonText: "Talk to Sales",
        popular: false,
    },
]

export function Pricing() {
    return (
        <section id="pricing" className="py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Simple, <span className="text-primary">transparent pricing</span>
                    </h2>
                    <p className="max-w-2xl text-lg text-muted-foreground">
                        Choose the plan that fits your growth. No hidden fees, ever.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {plans.map((plan) => (
                        <Card
                            key={plan.name}
                            className={cn(
                                "relative flex flex-col transition-all hover:scale-[1.02]",
                                plan.popular && "border-primary shadow-xl shadow-primary/10"
                            )}
                        >
                            {plan.popular && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1">
                                    Most Popular
                                </Badge>
                            )}
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="mt-4 flex items-baseline justify-center gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-sm text-muted-foreground">/month</span>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 text-primary" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    asChild
                                    className="w-full"
                                    variant={plan.popular ? "default" : "outline"}
                                >
                                    <Link href="/sign-up">{plan.buttonText}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
