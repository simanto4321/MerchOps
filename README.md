# MerchOps

Inventory & multi-channel order desk — **separated `frontend/` + `backend/`**, PostgreSQL, CourierAdapter layer, Docker for AWS.

- **Live:** [https://merchops-woad.vercel.app](https://merchops-woad.vercel.app)
- **GitHub:** [simanto4321/MerchOps](https://github.com/simanto4321/MerchOps)
- **Docs:** [`docs/`](./docs/) · **Full report:** [`REPORT.md`](./REPORT.md)

## Structure

```
frontend/   → Next.js UI (+ /api for Vercel)
backend/    → Hono API, Prisma (Postgres), Courier adapters
docs/       → PRD, structure, system design, functional design, API history
docker-compose.yml → db + backend + frontend
```

## Quick start (Docker)

```bash
docker compose up --build
```

- UI: http://127.0.0.1:4317  
- Backend: http://127.0.0.1:4000/api/health  
- API catalog: http://127.0.0.1:4000/api/meta/api-catalog  

## Quick start (workspaces)

```bash
cp .env.example .env
# DATABASE_URL must be PostgreSQL
npm install
npm run db:reset
npm run dev:backend   # :4000
npm run dev           # frontend :4317
```

| Role | Username | PIN |
|------|----------|-----|
| Admin | admin | 1234 |
| Staff | staff | 5678 |
| Guest | guest | 0000 |

## Docs map

1. [PRD](./docs/01-PRD.md)  
2. [Structure](./docs/02-STRUCTURE.md)  
3. [System design](./docs/03-SYSTEM-DESIGN.md)  
4. [Functional design](./docs/04-FUNCTIONAL-DESIGN.md)  
5. [Backend API history](./docs/05-BACKEND-API-HISTORY.md)  
