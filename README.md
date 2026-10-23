# MerchOps — Inventory & Order Desk

Full-stack ops desk for high-volume Bangladesh retail: multi-channel orders, inventory, partial/exchange returns, courier APIs, ad-spend P&amp;L, Telegram alerts, and immutable audit logs — with EN / বাংলা UI.

## Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js App Router, React, Tailwind — landing, login, desk pages |
| **Backend** | Next.js Route Handlers under `/api/*` — session auth, orders, stock, inbox, couriers, analytics, audit |
| **Database** | Prisma ORM — **SQLite** by default (`prisma/dev.db`); **PostgreSQL** via Docker Compose or hosted URL |

PINs are stored as **bcrypt hashes**. Sessions use an httpOnly cookie (`merchops_user_id`). Desk APIs require a valid session.

## Live

- Production: [https://merchops-woad.vercel.app](https://merchops-woad.vercel.app)

## Quick start (local)

```bash
npm install
cp .env.example .env          # if needed
npm run db:reset              # create schema + seed hashed demo users
npm run dev                   # http://127.0.0.1:4317
```

- Landing: [http://127.0.0.1:4317](http://127.0.0.1:4317)
- Login: [http://127.0.0.1:4317/login](http://127.0.0.1:4317/login)
- Desk: [http://127.0.0.1:4317/dashboard](http://127.0.0.1:4317/dashboard)
- Health: [http://127.0.0.1:4317/api/health](http://127.0.0.1:4317/api/health)

```bash
npm run lint           # TypeScript check
npm run build          # prisma generate + production build
npm run test:features  # API regression (dev server must be running)
```

### Demo accounts (local / staging)

Sign in with **username + PIN**. Contact emails are for ops only, not login.

| Role  | Username | PIN  |
|-------|----------|------|
| Admin | `admin`  | 1234 |
| Staff | `staff`  | 5678 |
| Guest | `guest`  | 0000 |

Set `ALLOW_DEMO_ACCOUNTS=false` and `ALLOW_ROLE_SWITCH=false` before a public deploy (quick-login chips and in-desk role switcher turn off).

Timezone for daily metrics, filters, and timestamps: **Asia/Dhaka**.

## PostgreSQL (optional)

Docker is not required for local SQLite. When you want Postgres:

```bash
docker compose up -d
# set provider = "postgresql" in prisma/schema.prisma
cp .env.postgres.example .env
npm run db:reset
npm run dev
```

Hosted: Neon / Supabase / Railway — see [`GO_LIVE.md`](./GO_LIVE.md).

## What’s included

| Area | Route | Notes |
|------|-------|--------|
| Landing | `/` | Full-bleed warehouse hero, EN/BN |
| Home desk | `/dashboard` | Metrics, follow-ups, low stock |
| Orders | `/orders` | Channel / status / date filters, pack, partial/exchange, merge, ship |
| Inbox | `/inbox` | Unified IG / WA / FB / TikTok queue |
| Stock | `/inventory` | Live qty; factory cost admin-only |
| Couriers | `/couriers` | Pathao, Steadfast, RedX, Sundarban, Paperfly, eCourier |
| Ads & P&L | `/analytics` | Monthly revenue, COGS, ad loss flags |
| Audit | `/audit` | PRICE_CHANGE / EDIT_ORDER / STOCK_UPDATE / LOGIN |
| Settings | `/settings` | Telegram bot + webhook notes |

## Backend APIs

- `POST /api/session` — `{ username, pin }` · `GET` current user · `DELETE` logout
- `GET /api/users?demo=1` — demo PIN hints (gated by `ALLOW_DEMO_ACCOUNTS`)
- `GET/POST /api/orders` · `PATCH /api/orders/:id` · `GET /api/orders/export`
- `GET/PATCH/POST /api/products`
- `GET/POST/PATCH /api/inbox`
- `GET/POST /api/analytics`
- `GET /api/audit`
- `GET/PUT /api/settings`
- `GET/POST /api/delivery-connections` · `PATCH …/:id` · `POST …/:id/ship`
- `POST /api/webhooks/order` — channel bots → create order
- `GET /api/health` — DB counts + feature flags
