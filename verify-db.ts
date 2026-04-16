import { db } from "./lib/db";
import { users, posts, subscriptions } from "./lib/db/schema";
import "dotenv/config";

async function verify() {
    console.log("Verifying tables...");
    try {
        const usersCount = await db.select().from(users);
        console.log("Users table verified.");

        const postsCount = await db.select().from(posts);
        console.log("Posts table verified.");

        const subscriptionsCount = await db.select().from(subscriptions);
        console.log("Subscriptions table verified.");

        console.log("Verification successful! All requested tables exist.");
    } catch (error) {
        console.error("Verification failed:", error);
        process.exit(1);
    }
}

verify();
