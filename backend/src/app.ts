import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { healthRoutes } from "./routes/health";
import { courierRoutes } from "./routes/couriers";
import { metaRoutes } from "./routes/meta";

/**
 * MerchOps Backend HTTP app (Docker / AWS).
 * Frontend (Vercel) also calls domain services; this process is the standalone API.
 */
export function createApp() {
  const app = new Hono().basePath("/api");

  app.use("*", logger());
  app.use(
    "*",
    cors({
      origin: (origin) => origin || "*",
      credentials: true,
    }),
  );

  app.route("/health", healthRoutes);
  app.route("/couriers", courierRoutes);
  app.route("/meta", metaRoutes);

  app.get("/", (c) =>
    c.json({
      service: "merchops-backend",
      ok: true,
      docs: "/api/meta/api-catalog",
    }),
  );

  return app;
}

export type MerchOpsApp = ReturnType<typeof createApp>;
