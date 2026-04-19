import Link from "next/link"
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { Sparkles } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t bg-card pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    <div className="col-span-2 lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <Sparkles className="h-5 w-5  dark:text-zinc-50" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Social Copilot</span>
                        </Link>
                        <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
                            Empowering creators and brands to master their social media presence across 9 platforms with AI-driven precision.
                        </p>
                        <div className="mt-6 flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <FaXTwitter className="h-5 w-5 text-zinc-950 dark:text-zinc-50" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <FaLinkedin className="h-5 w-5 text-zinc-950 dark:text-zinc-50" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <FaInstagram className="h-5 w-5 text-zinc-950 dark:text-zinc-50" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <FaGithub className="h-5 w-5 text-zinc-950 dark:text-zinc-50" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Product</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Partners</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Social Copilot Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
