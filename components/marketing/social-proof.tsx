import { Users } from "lucide-react"

export function SocialProof() {
    return (
        <section className="border-y bg-muted/50 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden"
                                >
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-sm font-bold">
                                <Users className="h-4 w-4 text-primary" />
                                <span>Trusted by 5,000+ creators</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Growing every single day</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale transition-all hover:grayscale-0 md:gap-12">
                        {/* Placeholder Logos */}
                        {["TechFlow", "CreatorHub", "Socially", "MediaPro", "GrowthSync"].map((name) => (
                            <span key={name} className="text-xl font-bold tracking-tighter">
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
