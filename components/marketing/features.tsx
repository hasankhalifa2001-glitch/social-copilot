import {
    Edit3,
    Calendar,
    Zap,
    MessageSquare,
    BarChart3,
    Lock,
} from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const features = [
    {
        title: "Compose",
        description: "Draft posts for multiple platforms in a single, unified interface.",
        icon: Edit3,
    },
    {
        title: "Schedule",
        description: "Plan your content calendar weeks in advance with automated queues.",
        icon: Calendar,
    },
    {
        title: "AI Generation",
        description: "Generate high-engaging captions and hashtags tailored for each platform.",
        icon: Zap,
    },
    {
        title: "Auto-Reply",
        description: "Stay engaged with your audience using AI-powered automated responses.",
        icon: MessageSquare,
    },
    {
        title: "Analytics",
        description: "Deep dive into performance metrics to see what truly resonates.",
        icon: BarChart3,
    },
    {
        title: "Secure Connections",
        description: "Enterprise-grade security for all your social media accounts.",
        icon: Lock,
    },
]

export function Features() {
    return (
        <section id="features" className="py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Everything you need to <br />
                        <span className="text-primary">grow your social presence</span>
                    </h2>
                    <p className="max-w-2xl text-lg text-muted-foreground">
                        Stop jumping between tabs. Our all-in-one platform gives you the tools to manage your digital footprint effectively.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <Card
                            key={feature.title}
                            className="group relative overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
                        >
                            <CardHeader>
                                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-sm leading-relaxed">
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
