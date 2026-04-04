# Social Copilot — Master Product Specification

Spec ID: 62719dfc-7cae-48e6-b4a3-3381aa447b52

Summary:

This master product specification describes the high-level architecture and requirements for Social Copilot — a multi-platform post scheduler and manager. It covers system goals, primary actors, core features (connected accounts, post composer, content calendar, scheduling workers, analytics, and billing), and non-functional requirements (security, scalability, testability).

Key sections (extracted):
- Project foundation: DB schema, auth, middleware, app shell
- Landing page: marketing UI and feature highlights
- Connected accounts: OAuth integration + management UI
- Post composer: multi-platform post creation with AI assistance and media upload
- Content calendar: visual scheduled-posts view and rescheduling
- BullMQ workers: publishing, polling, analytics sync
- Auto-reply rules: AI comment automation
- Analytics dashboard: engagement metrics and insights
- Billing & subscription: Clerk billing integration

Next steps:
- Create ticket skeletons and implementation plan.
