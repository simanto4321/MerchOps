# MerchOps — Product Requirements Document (PRD)

## 1. Product summary

**MerchOps** is an inventory & multi-channel order desk for Bangladesh retail brands that sell via Instagram, WhatsApp, Facebook, TikTok, phone, and web. Ops staff manage parcels, stock, courier handoff, ad-spend P&L, and security audit from one desk (EN / বাংলা).

## 2. Goals

- One panel for channel orders + inbound messages
- Accurate stock with factory cost vs retail margin
- Telegram alerts for new / failed deliveries
- Partial & exchange returns without breaking stock math
- Role-based access (Admin / Staff / Guest)
- Immutable audit of logins and price/order edits
- Docker-friendly deploy for AWS; Vercel for UI hosting

## 3. Personas

| Role | Needs |
|------|--------|
| Admin | Costs, couriers, audit, settings, product CRUD |
| Staff | Pack parcels, status, comments, ship, inbox |
| Guest | Read-limited desk walkthrough |

## 4. Functional requirements (traceability)

| ID | Requirement | Status |
|----|-------------|--------|
| FR-01 | Unified inbox (IG / WA / FB / TikTok) | Done |
| FR-02 | Channel webhooks + Telegram notify | Done (webhook + settings) |
| FR-03 | Order track by channel / phone / ID | Done |
| FR-04 | Tags + order merge | Done |
| FR-05 | Inventory + ad boost vs profit | Done |
| FR-06 | Monthly revenue / COGS / P&L | Done |
| FR-07 | Status + reason codes + comments | Done |
| FR-08 | Bulk parcel entry by phone | Done |
| FR-09 | Partial / exchange | Done |
| FR-10 | Admin / Staff / Guest | Done |
| FR-11 | Audit / security history | Done |
| FR-12 | Table row add/remove + inline edit + column toggles | Done |
| FR-13 | Courier **adapter layer** (not direct provider calls from UI) | Done |
| FR-14 | PostgreSQL (not SQLite) | Done |
| FR-15 | Separated `frontend/` + `backend/` | Done |
| FR-16 | Docker Compose for AWS-ready local/prod-like run | Done |

## 5. Non-functional

- Timezone: Asia/Dhaka for day/month metrics
- Auth: username + bcrypt PIN, httpOnly cookie
- DB: PostgreSQL via Prisma
- API catalog: `GET /api/meta/api-catalog` (backend) + frontend `/api/*`

## 6. Out of scope (phase 2)

- Live Meta / WhatsApp Cloud OAuth UI
- Real Pathao/Steadfast production credentials (adapters are wired; fill keys in Couriers)
- Mobile native apps
