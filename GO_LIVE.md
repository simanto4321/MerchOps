# MerchOps — Go-live checklist

## Already in place (local / this repo)

- [x] Frontend desk + marketing UI (Next.js)
- [x] Backend Route Handlers (`/api/*`) with session gates
- [x] Prisma database (SQLite default; Postgres schema-compatible)
- [x] bcrypt-hashed PINs in seed + login verify
- [x] httpOnly session cookie (`secure` in production)
- [x] `ALLOW_DEMO_ACCOUNTS` / `ALLOW_ROLE_SWITCH` env gates
- [x] `docker-compose.yml` for PostgreSQL 16

## 1. Database (PostgreSQL for production)

1. Create a Postgres database (Neon, Supabase, Railway, or `docker compose up -d`).
2. Set env:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/merchops?sslmode=require"
   ```
3. In `prisma/schema.prisma`:
   ```
   provider = "postgresql"
   ```
4. Run:
   ```bash
   npm run db:push
   npm run db:seed
   ```

## 2. Production env

```
DATABASE_URL=…
NEXT_PUBLIC_APP_NAME=MerchOps
ALLOW_DEMO_ACCOUNTS=false
ALLOW_ROLE_SWITCH=false
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

Change demo PINs after first deploy (re-seed or update `User.pin` with bcrypt hashes).

## 3. Hosting (Vercel)

1. Import the Git repo.
2. Set the env vars above.
3. Build: `npm run build` (`prisma generate && next build`).
4. Hit `/api/health` — expect `{ ok: true, db: { connected: true, … } }`.

## 4. Frontend live check

- [ ] `/` landing EN + বাংলা
- [ ] `/login` with Admin / Staff (no quick chips if demo flag off)
- [ ] Dashboard, orders filters, packing, partial/merge/CSV
- [ ] Inbox, inventory, couriers, analytics, audit, settings
- [ ] Mobile bottom nav

## 5. Couriers & channels (real keys)

- Paste live Pathao / Steadfast / RedX credentials in Couriers.
- Point WhatsApp/IG bots to `POST /api/webhooks/order`.
- Confirm Telegram chat receives new-order alerts.

## Demo accounts (staging only)

| Role  | Username | PIN  |
|-------|----------|------|
| Admin | admin    | 1234 |
| Staff | staff    | 5678 |
| Guest | guest    | 0000 |
