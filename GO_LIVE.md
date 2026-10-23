# MerchOps — Go-live checklist (next phase)

Use this after the app features are frozen. Order of work:

## 1. Database (PostgreSQL)

1. Create a Postgres database (Neon, Supabase, Railway, or Vercel Postgres).
2. In `.env` / Vercel env:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/merchops?sslmode=require"
   ```
3. In `prisma/schema.prisma`, set:
   ```
   provider = "postgresql"
   ```
4. Run:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

## 2. Auth hardening

- Replace demo `pin` fields with hashed passwords (`bcrypt`) or Auth.js / Clerk.
- Set `secure` cookies (already on in production session route).
- Remove or gate the in-app role switcher for production.

## 3. Hosting (Vercel)

1. Import the Git repo into Vercel.
2. Set env vars: `DATABASE_URL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_APP_NAME`.
3. Build command: `prisma generate && next build` (already in `npm run build`).
4. Add install command note: `npm install` (postinstall runs `prisma generate`).
5. After deploy, hit `/api/health` — expect `{ ok: true }`.

## 4. Frontend live check

- [ ] `/` landing EN + বাংলা
- [ ] `/login` with Admin `1234` / Staff `5678`
- [ ] Dashboard shortcuts + waiting / failed filters
- [ ] Orders: create, status, comment, tags, partial, merge, CSV, packing slip
- [ ] Inbox link/close
- [ ] Inventory stock edit (admin prices)
- [ ] Couriers connect + ship
- [ ] Analytics + audit (admin only)
- [ ] Settings Telegram save
- [ ] Mobile bottom nav

## 5. Couriers & channels (real keys)

- Paste live Pathao / Steadfast / RedX credentials in Couriers.
- Point WhatsApp/IG bots to `POST /api/webhooks/order`.
- Confirm Telegram chat receives new-order alerts.

## Demo PINs (local / staging only)

| Role  | Email                | PIN  |
|-------|----------------------|------|
| Admin | admin@merchops.local | 1234 |
| Staff | staff@merchops.local | 5678 |
| Guest | guest@merchops.local | 0000 |
