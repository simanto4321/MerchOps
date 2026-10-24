# MerchOps — Backend API Catalog & History

Live catalog also: `GET http://localhost:4000/api/meta/api-catalog` (Docker backend).

## Evolution

| Phase | What changed |
|-------|----------------|
| v0 | Next.js monolith `/api/*` + SQLite |
| v1 | bcrypt auth, Neon Postgres on Vercel |
| v2 | Table CRUD UX (add/remove/edit/columns) |
| **v3 (current)** | `frontend/` + `backend/` split, **CourierAdapter layer**, Postgres-only, Docker Compose, API catalog |

## Endpoint inventory

### Session & users
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/session` | Login `{username,pin}` |
| GET | `/api/session` | Current user |
| DELETE | `/api/session` | Logout |
| GET | `/api/users` | Role switcher list |
| GET | `/api/users?demo=1` | Demo PIN hints (gated) |

### Orders
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/orders` | List (+ channel/status/q/from/to) |
| POST | `/api/orders` | Create or `{bulk:[...]}` parcels |
| PATCH | `/api/orders/:id` | `status` \| `partial` \| `exchange` \| `merge` \| `edit` |
| DELETE | `/api/orders/:id` | Remove order row |
| GET | `/api/orders/export` | CSV |

### Products / inventory
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/products` | List (costs redacted for non-admin) |
| POST | `/api/products` | Add product row (admin) |
| PATCH | `/api/products` | Edit stock/prices/name/sku |
| DELETE | `/api/products?id=` | Remove row if unused |

### Inbox / webhooks
| Method | Path | Purpose |
|--------|------|---------|
| GET/POST/PATCH | `/api/inbox` | Unified queue |
| POST | `/api/webhooks/order` | Channel bot ingest |

### Couriers (adapter layer)
| Method | Path | Purpose |
|--------|------|---------|
| GET/POST | `/api/delivery-connections` | List / upsert connection |
| PATCH | `/api/delivery-connections/:id` | Connect / save keys |
| POST | `/api/delivery-connections/:id/ship` | **Ship via CourierAdapter** |
| GET | `/api/couriers/adapters` | List adapters (backend) |
| POST | `/api/couriers/:id/test` | Test via adapter (backend) |
| POST | `/api/couriers/:id/ship` | Ship via adapter (backend) |

### Analytics / audit / settings / health
| Method | Path | Purpose |
|--------|------|---------|
| GET/POST | `/api/analytics` | P&L + ad spend |
| GET | `/api/audit` | Security history |
| GET/PUT | `/api/settings` | Telegram |
| GET | `/api/health` | DB + flags |
| GET | `/api/meta/api-catalog` | This catalog (backend) |
