import { inngest } from "./client";
import { handlePublishPost } from "./handlers/publishHandler";
import { handlePollComments } from "./handlers/pollHandler";
import { handleSyncAnalytics } from "./handlers/syncHandler";

export const processScheduledPost = inngest.createFunction(
    {
        id: "process-scheduled-post",
        cancelOn: [
            {
                event: "post.cancelled",
                if: "event.data.postId == async.data.postId",
            },
        ],
        retries: 3,
        triggers: { event: "post.scheduled" }
    },

    async ({ event, step }) => {
        const { postId, scheduledAt } = event.data;

        if (scheduledAt) {
            await step.sleepUntil("wait-until-scheduled", scheduledAt);
        }

        return await handlePublishPost(postId, step);
    }
);

export const pollAccountComments = inngest.createFunction(
    {
        id: "poll-account-comments",
        concurrency: {
            limit: 1,
        },
        triggers: { cron: "*/5 * * * *" },
    },
    async ({ step }) => {
        return await handlePollComments(step);
    }
);

export const syncAccountAnalytics = inngest.createFunction(
    {
        id: "sync-account-analytics",
        triggers: { cron: "0 * * * *" },
    },
    async ({ step }) => {
        return await handleSyncAnalytics(step);
    }
);

export const functions = [
    processScheduledPost,
    pollAccountComments,
    syncAccountAnalytics,
];
