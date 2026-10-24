# MerchOps — Functional Design

## 1. Screens

| Route | Actor | Behavior |
|-------|-------|----------|
| `/` | Public | Landing, EN/BN |
| `/login` | Public | Username + PIN; demo chips if allowed |
| `/dashboard` | Authed | Metrics, follow-ups, low stock |
| `/orders` | Authed | Filters, inline edit, add/remove rows, columns, pack, ship |
| `/inbox` | Authed | Unified messages, link/close |
| `/inventory` | Authed | Add/remove/edit products, columns (admin costs) |
| `/couriers` | Admin | Connect keys → adapter test/ship |
| `/analytics` | Admin | Monthly P&L + loss flags |
| `/audit` | Admin | Security history |
| `/settings` | Admin | Telegram |

## 2. Table editing (Orders & Inventory)

- **Add row:** Pack parcels / Add product
- **Remove row:** Remove button (guest blocked on delete)
- **Edit info:** Inline inputs → Save
- **Columns:** Checkbox strip show/hide

## 3. Shipping flow

1. Admin saves API key on Couriers → status CONNECTED  
2. Staff opens order → Ship via connected courier  
3. `CourierAdapter.createConsignment` runs  
4. Order → IN_PROGRESS + audit log with `layer: CourierAdapter`

## 4. Messaging flow

1. Channel bot `POST /api/webhooks/order` **or** manual inbox capture  
2. Optional Telegram notify  
3. Desk links message ↔ order  

## 5. Error / empty states

- Empty filters, empty inbox, delete blocked if product used on orders, courier not connected
