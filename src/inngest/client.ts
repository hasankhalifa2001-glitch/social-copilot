import { Inngest } from "inngest";

type PostScheduled = {
    data: {
        postId: string;
        scheduledAt: string;
    };
};

type PostCancelled = {
    data: {
        postId: string;
    };
};

export type Events = {
    "post.scheduled": PostScheduled;
    "post.cancelled": PostCancelled;
};

export const inngest = new Inngest({
    id: "social-copilot",
    eventKey: process.env.INNGEST_EVENT_KEY,
    schemas: {
        events: {} as Events,
    },
});
