# MerchOps — Repository Structure

```
merchops/
├── backend/                 # Server / domain / Docker API
│   ├── Dockerfile
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma    # PostgreSQL only
│   │   └── seed.ts
│   └── src/
│       ├── index.ts         # HTTP listen (:4000)
│       ├── app.ts           # Hono app
│       ├── couriers/        # ★ Adapter layer (Pathao, Steadfast, …)
│       ├── services/        # shipping, etc.
│       ├── routes/          # health, couriers, meta/api-catalog
│       └── lib/             # prisma helpers, orders, auth, audit…
├── frontend/                # Client (Next.js App Router)
│   ├── Dockerfile
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── app/             # pages + /api route handlers (Vercel)
│       ├── components/      # UI desks
│       ├── lib/             # session, i18n, client helpers
│       └── middleware.ts
├── docs/                    # PRD, structure, system, functional
├── docker-compose.yml       # db + backend + frontend
├── REPORT.md                # Full project report (folder/file)
├── vercel.json
└── README.md
```

## Client–server split

| Concern | Lives in | Runtime |
|---------|----------|---------|
| UI, tables, EN/BN | `frontend/` | Vercel or Docker `:4317` |
| Courier adapters, API catalog, Docker API | `backend/` | Docker/AWS `:4000` |
| Prisma schema + seed | `backend/prisma/` | shared |
| Next `/api/*` (Vercel) | `frontend/src/app/api` | imports `@backend/couriers` for ship |

## Databases

- **PostgreSQL only** (`provider = "postgresql"`)
- Local: `docker compose up db` → `DATABASE_URL=postgresql://merchops:merchops@127.0.0.1:5432/merchops`
- Vercel: Neon (already linked)
