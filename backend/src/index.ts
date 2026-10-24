import { serve } from "@hono/node-server";
import { createApp } from "./app";

const port = Number(process.env.PORT || 4000);
const app = createApp();

console.log(`MerchOps backend listening on :${port}`);
serve({ fetch: app.fetch, port });
