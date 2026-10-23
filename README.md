# MerchOps — Inventory & Order Management

Centralized inventory, multi-channel order aggregation, partial/exchange workflows, ad-spend profitability, and immutable audit logs for high-volume retail teams.

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind
- **Prisma** ORM (SQLite by default for local zero-config; PostgreSQL-ready)
- Role demo accounts: Admin / Staff / Guest (cookie session switcher)

## Quick start

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317) (landing). Ops desk: [http://127.0.0.1:4317/dashboard](http://127.0.0.1:4317/dashboard).

**Language:** EN / বাংলা toggle in the header (landing + desk). Preference is saved in the browser.

**Courier APIs:** Admin → [Couriers](http://127.0.0.1:4317/couriers) — connect Pathao, Steadfast, RedX, Sundarban, Paperfly, eCourier (API key / secret / store ID, test & disconnect).

### PostgreSQL (production)

1. Set `DATABASE_URL` in `.env` to your Postgres connection string.
2. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
3. Run `npx prisma db push` (or `migrate dev`) then `npm run db:seed`.

## Demo users

Switch roles from the header:

| Role  | Email                 | Sees factory costs / ad profit / audit |
|-------|-----------------------|----------------------------------------|
| Admin | admin@merchops.local  | Yes                                    |
| Staff | staff@merchops.local  | No — packing, orders, comments only    |
| Guest | guest@merchops.local  | No                                     |

## Modules

| Area | Route | What it does |
|------|-------|----------------|
| Dashboard | `/` | Daily/monthly orders, inventory value, ad net flags, morning failed-delivery follow-ups |
| Orders | `/orders` | Channel/status filters, inline comments, quick multi-parcel entry, partial/exchange, merge |
| Inbox | `/inbox` | Unified IG / WA / FB / TikTok inquiry queue |
| Inventory | `/inventory` | Stock + thresholds; admin price/factory cost edits with audit |
| Ad spend | `/analytics` | Campaign spend vs COGS/revenue loss flags (admin) |
| Audit | `/audit` | Immutable PRICE_CHANGE / EDIT_ORDER / STOCK_UPDATE history (admin) |
| Settings | `/settings` | Telegram bot alerts + webhook notes (admin) |

## APIs

- `GET/POST /api/orders` — list / create (supports `{ bulk: [...] }` for parcel batches)
- `PATCH /api/orders/:id` — `status` | `partial` | `exchange` | `merge` | `edit`
- `GET/PATCH/POST /api/products` — inventory (costs gated by role)
- `GET/POST/PATCH /api/inbox`
- `GET/POST /api/analytics`
- `GET /api/audit`
- `GET/PUT /api/settings`
- `POST /api/webhooks/order` — channel ingest `{ channel, customerName, customerPhone, items:[{sku,qty}] }`

## Saving on Windows (D: drive)

This Cloud Agent workspace is Linux. To keep a copy on your machine:

1. Create a GitHub/Origin repo from this project (Create repo), or download the branch.
2. Clone or copy into e.g. `D:\MerchOps` and run the Quick start commands above.

## Environment

Copy `.env.example` → `.env`:

```
DATABASE_URL="file:./dev.db"
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```
