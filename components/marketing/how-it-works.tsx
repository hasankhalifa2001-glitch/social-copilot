import { Link2, Layout, Send } from "lucide-react"

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
        <section className="bg-muted/50 py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Simple process, <span className="text-primary">powerful results</span>
                    </h2>
                </div>

                <div className="relative">
                    {/* Visual connector (Desktop) */}
                    <div className="absolute top-1/2 left-0 hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent lg:block" />

                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                        {steps.map((step, index) => (
                            <div key={step.title} className="relative flex flex-col items-center text-center">
                                <div className="z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-background border-2 border-primary/20 text-primary shadow-sm">
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-6xl font-black text-muted/30 lg:hidden">
                                    0{index + 1}
                                </div>
                                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                                <p className="text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
