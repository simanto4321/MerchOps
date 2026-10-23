# MerchOps — Inventory & Order Management

Complete Phase 1–3 ops desk for high-volume Bangladesh retail: multi-channel orders, inventory, partial/exchange returns, courier APIs, ad-spend P&amp;L, Telegram alerts, and immutable audit logs — with EN / বাংলা UI.

## Quick start

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

- Landing: [http://127.0.0.1:4317](http://127.0.0.1:4317)
- Desk: [http://127.0.0.1:4317/dashboard](http://127.0.0.1:4317/dashboard)

```bash
npm run lint           # TypeScript check
npm run build          # Production build
npm run db:reset       # Wipe + reseed demo data
npm run test:features  # API regression (dev server must be running)
```

Sign in at `/login` (middleware protects the desk).

| Role  | Email                | PIN  | Sees costs / couriers setup / audit |
|-------|----------------------|------|-------------------------------------|
| Admin | admin@merchops.local | 1234 | Yes                                 |
| Staff | staff@merchops.local | 5678 | No — packing, orders, ship only     |
| Guest | guest@merchops.local | 0000 | No                                  |

Next phase (Postgres + Vercel): see [`GO_LIVE.md`](./GO_LIVE.md).

## What’s included

| Area | Route | Notes |
|------|-------|--------|
| Landing | `/` | Premium forest-ink hero, feature icons, EN/BN |
| Home desk | `/dashboard` | Ops overview metrics, follow-ups, low stock |
| Orders | `/orders` | Filters, bulk pack entry, comments, tags, partial/exchange, merge, courier ship |
| Inbox | `/inbox` | Unified IG / WA / FB / TikTok queue |
| Stock | `/inventory` | Live qty; factory cost admin-only |
| Couriers | `/couriers` | Pathao, Steadfast, RedX, Sundarban, Paperfly, eCourier |
| Ads & P&L | `/analytics` | Monthly revenue, COGS, ad loss flags |
| Audit | `/audit` | Immutable PRICE_CHANGE / EDIT_ORDER / STOCK_UPDATE |
| Settings | `/settings` | Telegram bot + webhook notes |

## APIs

- `GET/POST /api/orders` — list / create (`{ bulk: [...] }` for parcels)
- `PATCH /api/orders/:id` — `status` \| `partial` \| `exchange` \| `merge` \| `edit`
- `GET/PATCH/POST /api/products`
- `GET/POST/PATCH /api/inbox`
- `GET/POST /api/analytics`
- `GET /api/audit`
- `GET/PUT /api/settings`
- `GET/POST /api/delivery-connections` · `PATCH /api/delivery-connections/:id` · `POST .../:id/ship`
- `POST /api/webhooks/order` — `{ channel, customerName, customerPhone, items:[{sku,qty}] }`

## Database

Default: **SQLite** (`DATABASE_URL="file:./dev.db"`).

PostgreSQL: set `DATABASE_URL`, change `provider` in `prisma/schema.prisma` to `postgresql`, then `npm run db:push && npm run db:seed`.

## Stack

Next.js 16 · TypeScript · Tailwind · Prisma 5 · SQLite (Postgres-ready)
