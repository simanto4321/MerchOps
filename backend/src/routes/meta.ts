import { Hono } from "hono";
import { listCourierAdapters } from "../couriers/registry";

/** API catalog / history for operators and docs */
export const metaRoutes = new Hono();

metaRoutes.get("/api-catalog", (c) =>
  c.json({
    service: "merchops-backend",
    version: "1.0.0",
    database: "postgresql",
    courierLayer: {
      pattern: "Adapter / Strategy",
      adapters: listCourierAdapters(),
      entrypoints: [
        "POST /api/couriers/:connectionId/test",
        "POST /api/couriers/:connectionId/ship",
        "GET /api/couriers/adapters",
      ],
    },
    endpoints: [
      {
        method: "GET",
        path: "/api/health",
        purpose: "Liveness + DB counts",
      },
      {
        method: "GET",
        path: "/api/meta/api-catalog",
        purpose: "This catalog",
      },
      {
        method: "GET",
        path: "/api/couriers/adapters",
        purpose: "List courier adapter implementations",
      },
      {
        method: "POST",
        path: "/api/couriers/:id/test",
        purpose: "Test provider credentials via adapter",
      },
      {
        method: "POST",
        path: "/api/couriers/:id/ship",
        purpose: "Create consignment via adapter (never direct provider call from UI)",
      },
      {
        method: "POST",
        path: "/api/session",
        purpose: "Login username+PIN (frontend Next route / Docker proxy)",
        note: "Also available on frontend Next.js /api/session for Vercel",
      },
      {
        method: "GET|POST|PATCH|DELETE",
        path: "/api/orders*",
        purpose: "Order CRUD, bulk parcel, status, partial, merge, delete",
      },
      {
        method: "GET|POST|PATCH|DELETE",
        path: "/api/products",
        purpose: "Inventory rows",
      },
      {
        method: "GET|POST|PATCH",
        path: "/api/inbox",
        purpose: "Unified messaging queue",
      },
      {
        method: "GET|POST",
        path: "/api/analytics",
        purpose: "Revenue / COGS / ad-spend P&L",
      },
      {
        method: "GET",
        path: "/api/audit",
        purpose: "Immutable security history",
      },
      {
        method: "GET|PUT",
        path: "/api/settings",
        purpose: "Telegram + notify flags",
      },
      {
        method: "POST",
        path: "/api/webhooks/order",
        purpose: "Channel bot ingest (IG/WA/FB/TikTok)",
      },
    ],
  }),
);
