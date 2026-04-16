import { serve } from "inngest/next";
import { inngest } from "@/src/inngest/client";
import { publishPost } from "@/src/inngest/functions/publish-post";
import { pollComments } from "@/src/inngest/functions/poll-comments";
import { syncAnalytics } from "@/src/inngest/functions/sync-analytics";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: [
        publishPost,
        pollComments,
        syncAnalytics,
    ],
});
