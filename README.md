# MerchOps — Inventory & Order Management

Ops desk for high-volume Bangladesh retail: multi-channel orders, inventory, partial/exchange returns, courier APIs, ad-spend P&amp;L, Telegram alerts, and immutable audit logs — with EN / বাংলা UI.

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

Sign in at `/login` with **username + PIN**. Contact emails stay on each user for customer / delivery queries.

| Role  | Username | PIN  | Sees costs / couriers / audit |
|-------|----------|------|-------------------------------|
| Admin | `admin`  | 1234 | Yes                           |
| Staff | `staff`  | 5678 | No — packing, orders, ship    |
| Guest | `guest`  | 0000 | No                            |

Timezone for daily metrics, filters, and timestamps: **Asia/Dhaka**.

Next phase (hosting): see [`GO_LIVE.md`](./GO_LIVE.md).

## What’s included

| Area | Route | Notes |
|------|-------|--------|
| Landing | `/` | Full-bleed warehouse hero, feature icons, EN/BN |
| Home desk | `/dashboard` | Warehouse banner, metrics, follow-ups, low stock |
| Orders | `/orders` | Channel / status / date filters, pack entry, comments, partial/exchange, merge, ship |
| Inbox | `/inbox` | Unified IG / WA / FB / TikTok queue |
| Stock | `/inventory` | Live qty; factory cost admin-only |
| Couriers | `/couriers` | Pathao, Steadfast, RedX, Sundarban, Paperfly, eCourier |
| Ads & P&L | `/analytics` | Monthly revenue, COGS, ad loss flags (Dhaka month) |
| Audit | `/audit` | PRICE_CHANGE / EDIT_ORDER / STOCK_UPDATE / LOGIN |
| Settings | `/settings` | Telegram bot + webhook notes |

## APIs

- `GET/POST /api/orders` — list / create (`{ bulk: [...] }` for parcels); filters `channel`, `status`, `q`, `from`, `to`
- `PATCH /api/orders/:id` — `status` \| `partial` \| `exchange` \| `merge` \| `edit`
- `GET/PATCH/POST /api/products`
- `GET/POST/PATCH /api/inbox`
- `GET/POST /api/analytics`
- `GET /api/audit`
- `GET/PUT /api/settings`
- `GET/POST /api/delivery-connections` · `PATCH /api/delivery-connections/:id` · `POST .../:id/ship`
- `POST /api/session` — `{ username, pin }`
- `POST /api/webhooks/order` — `{ channel, customerName, customerPhone, items:[{sku,qty}] }`
