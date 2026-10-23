# MerchOps agent notes

- Stack: Next.js App Router, Prisma 5 + SQLite (Postgres-ready), Tailwind.
- Demo auth: cookie `merchops_user_id`; switch users via header (Admin sees costs/audit).
- Seed: `npm run db:seed` after `npm run db:push`.
- Dev server: `npm run dev` → http://127.0.0.1:4317
- Do not upgrade to Prisma 8 CLI in this repo without migrating the schema workflow.
