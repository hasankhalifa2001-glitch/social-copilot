import { Star } from "lucide-react"

import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
        <section className="bg-muted/50 py-24 md:py-32">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-16">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Loved by <span className="text-primary">creators worldwide</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.name} className="bg-background">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-bold">{testimonial.name}</p>
                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                    ))}
                                </div>
                                <p className="text-muted-foreground italic">&ldquo;{testimonial.quote}&rdquo;</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
