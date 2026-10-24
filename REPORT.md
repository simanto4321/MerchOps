# MerchOps — Detailed Project Report

**Repo:** https://github.com/simanto4321/MerchOps  
**Live:** https://merchops-woad.vercel.app  
**Date:** 2026-10-24 (Asia/Dhaka)

---

## 1. Executive summary

MerchOps is a full-stack inventory & multi-channel order desk. The codebase is split into **`frontend/`** (Next.js client) and **`backend/`** (domain, Prisma/PostgreSQL, CourierAdapter layer, Hono API for Docker/AWS). Documentation lives in **`docs/`**. Production UI remains on the same Vercel URL; database is **PostgreSQL (Neon)**.

---

## 2. Architecture overview

See `docs/03-SYSTEM-DESIGN.md`.  
Client–server: browser → frontend → API (Vercel route handlers **or** Docker backend `:4000`) → PostgreSQL → Courier adapters.

---

## 3. Folder-by-folder / file-by-file

### 3.1 `backend/`

| Path | Role |
|------|------|
| `package.json` | `@merchops/backend` scripts & deps (Hono, Prisma, bcrypt) |
| `tsconfig.json` | NodeNext compile for Docker |
| `Dockerfile` | Container image for AWS/ECS |
| `prisma/schema.prisma` | **PostgreSQL** schema (User, Product, Order, … DeliveryConnection) |
| `prisma/seed.ts` | Demo users (bcrypt PINs), products, orders, couriers, inbox |
| `src/index.ts` | Starts HTTP server on `PORT` (default 4000) |
| `src/app.ts` | Hono app + CORS + mounts routes |
| `src/routes/health.ts` | `GET /api/health` |
| `src/routes/couriers.ts` | Adapter-backed test + ship |
| `src/routes/meta.ts` | `GET /api/meta/api-catalog` — API history |
| `src/couriers/types.ts` | Adapter interfaces |
| `src/couriers/base.ts` | Shared adapter base |
| `src/couriers/adapters.ts` | Pathao, Steadfast, RedX, Sundarban, Paperfly, eCourier, Custom |
| `src/couriers/registry.ts` | `getCourierAdapter()` |
| `src/services/shipping.ts` | `shipWithCourier` / `testCourierConnection` |
| `src/lib/*` | Domain helpers (orders, audit, auth, analytics, telegram, validation, …) |

### 3.2 `frontend/`

| Path | Role |
|------|------|
| `package.json` | `@merchops/frontend` Next.js app |
| `next.config.ts` | Transpile backend package |
| `tsconfig.json` | Paths `@/*`, `@backend/*` |
| `public/images/*` | Warehouse / ops imagery |
| `src/middleware.ts` | Session gate for desk routes |
| `src/app/(marketing)/*` | Landing + login |
| `src/app/(app)/*` | Dashboard, orders, inbox, inventory, couriers, analytics, audit, settings |
| `src/app/api/**` | Route handlers (Vercel). Ship uses `@backend/couriers` |
| `src/components/*` | UI desks (orders/inventory table edit, columns, etc.) |
| `src/lib/*` | Frontend session/i18n + shared calls |
| `Dockerfile` | Frontend container |

### 3.3 `docs/`

| File | Content |
|------|---------|
| `01-PRD.md` | Product requirements |
| `02-STRUCTURE.md` | Repo layout |
| `03-SYSTEM-DESIGN.md` | Architecture + courier layer |
| `04-FUNCTIONAL-DESIGN.md` | Screens & flows |
| `05-BACKEND-API-HISTORY.md` | API catalog & history |

### 3.4 Root

| Path | Role |
|------|------|
| `package.json` | npm workspaces |
| `docker-compose.yml` | `db` + `backend` + `frontend` |
| `vercel.json` | Build with backend Prisma schema |
| `README.md` | Quick start |
| `REPORT.md` | This report |
| `GO_LIVE.md` | Hosting checklist |

---

## 4. Database

- **Engine:** PostgreSQL (SQLite removed from primary schema)
- **ORM:** Prisma 5.22
- **Prod:** Neon via Vercel (`DATABASE_URL`)
- **Docker:** `postgres:16-alpine` service `db`

---

## 5. Courier adapter layer

UI and route handlers **must not** call Pathao/Steadfast HTTP directly.  
All ship/test calls go through `getCourierAdapter(provider)`.

---

## 6. How to run

### Docker (AWS-like)
```bash
docker compose up --build
# UI http://localhost:4317
# API http://localhost:4000/api/health
# Catalog http://localhost:4000/api/meta/api-catalog
```

### Local workspaces
```bash
npm install
# start Postgres (compose db only or Neon URL in .env)
npm run db:reset
npm run dev:backend   # :4000
npm run dev           # frontend :4317
```

### Demo login
`admin` / `1234` · `staff` / `5678` · `guest` / `0000`

---

## 7. Vercel

- Production URL **unchanged:** https://merchops-woad.vercel.app  
- Build generates Prisma client from `backend/prisma/schema.prisma`  
- Frontend `/api/*` serves the desk; shipping uses backend courier adapters  

---

## 8. GitHub

https://github.com/simanto4321/MerchOps — collaborators invited (write): hossaintaufiq, Fiad-123, bappy-3
