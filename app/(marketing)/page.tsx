import { Navbar } from "@/components/marketing/navbar"
import { Hero } from "@/components/marketing/hero"
import { SocialProof } from "@/components/marketing/social-proof"
import { Features } from "@/components/marketing/features"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Pricing } from "@/components/marketing/pricing"
import { Testimonials } from "@/components/marketing/testimonials"
import { FAQ } from "@/components/marketing/faq"
import { CTA } from "@/components/marketing/cta"
import { Footer } from "@/components/marketing/footer"

export default function MarketingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
                <Hero />
                <SocialProof />
                <Features />
                <HowItWorks />
                <Pricing />
                <Testimonials />
                <FAQ />
                <CTA />
            </main>
            <Footer />
        </div>
    )
}
