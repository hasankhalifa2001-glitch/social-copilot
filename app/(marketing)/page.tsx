import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-130px)] text-center px-4">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
                Manage All Your Socials <span className="text-primary">in One Place</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-10">
                Social Copilot helps you schedule posts, automate replies, and track analytics across Twitter, LinkedIn, Facebook, and Instagram.
            </p>
            <div className="flex gap-4">
                <Link
                    href="/dashboard"
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-md font-medium text-lg"
                >
                    Get Started
                </Link>
                <Link
                    href="/sign-in"
                    className="border px-8 py-3 rounded-md font-medium text-lg hover:bg-muted transition-colors"
                >
                    Sign In
                </Link>
            </div>
        </div>
    );
}
