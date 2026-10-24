# MerchOps — System Design

## 1. High-level architecture

```
┌─────────────┐     HTTPS      ┌──────────────────┐
│  Browser UI │ ──────────────►│  Frontend (Next) │  Vercel / Docker :4317
└─────────────┘                │  pages + /api/*  │
                               └────────┬─────────┘
                                        │ imports / HTTP
                               ┌────────▼─────────┐
                               │ Backend domain   │  Docker / AWS :4000
                               │ Hono + services  │
                               └────────┬─────────┘
                                        │ Prisma
                               ┌────────▼─────────┐
                               │  PostgreSQL      │  Neon / Compose / RDS
                               └──────────────────┘
                                        │
                               ┌────────▼─────────┐
                               │ CourierAdapter   │  Pathao / Steadfast / …
                               └──────────────────┘
```

## 2. Courier layer (critical)

**Before:** ship route minted a fake consignment ID inline (no provider abstraction).

**Now:** Strategy / Adapter pattern

```
UI / Route → shipWithCourier(provider, creds, order)
                → getCourierAdapter(provider)
                → PathaoAdapter | SteadfastAdapter | …
                → createConsignment() / testConnection()
```

Files: `backend/src/couriers/{types,base,adapters,registry}.ts`  
Service: `backend/src/services/shipping.ts`  
Wired from: `frontend/.../ship/route.ts` and `backend/src/routes/couriers.ts`

## 3. Auth

- Cookie `merchops_user_id` (httpOnly)
- PIN verified with bcrypt
- Roles gate costs / audit / product delete

## 4. Deploy topologies

| Env | Frontend | Backend | DB |
|-----|----------|---------|-----|
| Local Docker | compose `frontend` | compose `backend` | compose `db` |
| Vercel | Next.js (this repo) | Domain code via `@backend/*` + Neon | Neon Postgres |
| AWS | ECS/EC2 containers from Dockerfiles | same | RDS Postgres |

## 5. Data model (core)

User, Product, Order, OrderItem, InboxMessage, AdSpend, AuditLog, DeliveryConnection, AppSetting
