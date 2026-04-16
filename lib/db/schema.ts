import {
    pgTable,
    uuid,
    text,
    timestamp,
    uniqueIndex,
    integer,
    jsonb,
    boolean,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const planEnum = pgEnum("plan", ["free", "pro", "agency"]);
export const platformEnum = pgEnum("platform", [
    "twitter",
    "linkedin",
    "facebook",
    "instagram",
    "tiktok",
    "youtube",
    "pinterest",
    "discord",
    "slack",
]);
export const postStatusEnum = pgEnum("post_status", [
    "draft",
    "scheduled",
    "published",
    "failed",
]);
export const jobStatusEnum = pgEnum("job_status", [
    "pending",
    "processing",
    "completed",
    "failed",
]);
export const triggerTypeEnum = pgEnum("trigger_type", ["keyword", "any_comment"]);

// Tables
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").notNull().unique(),
    email: text("email").notNull(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    plan: planEnum("plan").default("free").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const connectedAccounts = pgTable("connected_accounts", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    platform: platformEnum("platform").notNull(),
    platformUserId: text("platform_user_id").notNull(),
    platformUsername: text("platform_username"),
    avatarUrl: text("avatar_url"),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token"),
    expiresAt: timestamp("expires_at"),
    scopes: text("scopes"),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        // هذا هو الفهرس الفريد الذي يحل مشكلة الـ ON CONFLICT
        userIdPlatformUnique: uniqueIndex("user_id_platform_unique").on(
            table.userId,
            table.platform,
            table.platformUserId
        ),
    };
});

export const posts = pgTable("posts", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    mediaUrls: jsonb("media_urls").default([]).notNull(),
    platforms: jsonb("platforms").notNull(), // Array of platforms
    status: postStatusEnum("status").default("draft").notNull(),
    scheduledAt: timestamp("scheduled_at"),
    publishedAt: timestamp("published_at"),
    aiGenerated: boolean("ai_generated").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const postPlatformResults = pgTable("post_platform_results", {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
        .notNull()
        .references(() => posts.id, { onDelete: "cascade" }),
    platform: platformEnum("platform").notNull(),
    platformPostId: text("platform_post_id"),
    status: postStatusEnum("status").notNull(),
    errorMessage: text("error_message"),
    publishedAt: timestamp("published_at"),
});

export const autoReplyRules = pgTable("auto_reply_rules", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    connectedAccountId: uuid("connected_account_id")
        .notNull()
        .references(() => connectedAccounts.id, { onDelete: "cascade" }),
    platform: platformEnum("platform").notNull(),
    name: text("name").notNull(),
    triggerType: triggerTypeEnum("trigger_type").notNull(),
    keywords: jsonb("keywords").default([]),
    replyTemplate: text("reply_template").notNull(),
    aiEnabled: boolean("ai_enabled").default(false).notNull(),
    aiPersona: text("ai_persona"),
    isActive: boolean("is_active").default(true).notNull(),
    repliedCommentIds: jsonb("replied_comment_ids").default([]).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyticsSnapshots = pgTable("analytics_snapshots", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    connectedAccountId: uuid("connected_account_id")
        .notNull()
        .references(() => connectedAccounts.id, { onDelete: "cascade" }),
    platform: platformEnum("platform").notNull(),
    date: timestamp("date").notNull(),
    followers: integer("followers").default(0),
    impressions: integer("impressions").default(0),
    engagements: integer("engagements").default(0),
    reach: integer("reach").default(0),
    profileViews: integer("profile_views").default(0),
});

export const subscriptions = pgTable("subscriptions", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .unique()
        .references(() => users.id, { onDelete: "cascade" }),
    clerkSubscriptionId: text("clerk_subscription_id").notNull(),
    plan: planEnum("plan").notNull(),
    status: text("status").notNull(),
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
    connectedAccounts: many(connectedAccounts),
    posts: many(posts),
    autoReplyRules: many(autoReplyRules),
    analyticsSnapshots: many(analyticsSnapshots),
    subscription: one(subscriptions, {
        fields: [users.id],
        references: [subscriptions.userId],
    }),
}));

export const connectedAccountsRelations = relations(connectedAccounts, ({ one, many }) => ({
    user: one(users, {
        fields: [connectedAccounts.userId],
        references: [users.id],
    }),
    autoReplyRules: many(autoReplyRules),
    analyticsSnapshots: many(analyticsSnapshots),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    user: one(users, {
        fields: [posts.userId],
        references: [users.id],
    }),
    platformResults: many(postPlatformResults),
}));

export const postPlatformResultsRelations = relations(postPlatformResults, ({ one }) => ({
    post: one(posts, {
        fields: [postPlatformResults.postId],
        references: [posts.id],
    }),
}));

export const autoReplyRulesRelations = relations(autoReplyRules, ({ one }) => ({
    user: one(users, {
        fields: [autoReplyRules.userId],
        references: [users.id],
    }),
    connectedAccount: one(connectedAccounts, {
        fields: [autoReplyRules.connectedAccountId],
        references: [connectedAccounts.id],
    }),
}));

export const analyticsSnapshotsRelations = relations(analyticsSnapshots, ({ one }) => ({
    user: one(users, {
        fields: [analyticsSnapshots.userId],
        references: [users.id],
    }),
    connectedAccount: one(connectedAccounts, {
        fields: [analyticsSnapshots.connectedAccountId],
        references: [connectedAccounts.id],
    }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
    user: one(users, {
        fields: [subscriptions.userId],
        references: [users.id],
    }),
}));
