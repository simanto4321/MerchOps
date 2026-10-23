#!/usr/bin/env node
/**
 * MerchOps API feature regression (run while `npm run dev` is up).
 */
const BASE = process.env.BASE_URL || "http://127.0.0.1:4317";

let passed = 0;
let failed = 0;
const jar = { cookie: "" };

function assert(name, cond, detail = "") {
  if (cond) {
    passed += 1;
    console.log(`  ✓ ${name}`);
  } else {
    failed += 1;
    console.error(`  ✗ ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

async function req(path, opts = {}) {
  const headers = { ...(opts.headers || {}) };
  if (jar.cookie) headers.cookie = jar.cookie;
  if (opts.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const set = res.headers.getSetCookie?.() || [];
  for (const c of set) {
    const part = c.split(";")[0];
    if (part.startsWith("merchops_user_id=")) jar.cookie = part;
  }
  // node fetch fallback
  const sc = res.headers.get("set-cookie");
  if (sc && sc.includes("merchops_user_id=")) {
    jar.cookie = sc.split(";")[0];
  }
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { res, json, text };
}

async function main() {
  console.log(`\nMerchOps feature tests → ${BASE}\n`);

  console.log("Health");
  {
    const { res, json } = await req("/api/health");
    assert("health ok", res.status === 200 && json?.ok === true, JSON.stringify(json));
  }

  console.log("Auth gate");
  {
    jar.cookie = "";
    const { res } = await req("/api/orders");
    assert("orders 401 without session", res.status === 401);
  }

  console.log("Login");
  {
    const { res, json } = await req("/api/session", {
      method: "POST",
      body: JSON.stringify({ username: "admin", pin: "1234" }),
    });
    assert("admin login", res.status === 200 && json?.user?.role === "ADMIN", JSON.stringify(json));
    assert("session cookie set", Boolean(jar.cookie));
  }

  let productId = "";
  let orderId = "";
  let courierId = "";

  console.log("Catalog");
  {
    const { res, json } = await req("/api/products");
    assert("products list", res.status === 200 && json.products?.length > 0);
    productId = json.products[0].id;
    assert("admin sees factoryCost", json.products[0].factoryCost != null);
  }

  console.log("Orders");
  {
    const { res, json } = await req("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customerName: "Test Buyer",
        customerPhone: "01710000099",
        sourceChannel: "WHATSAPP",
        items: [{ productId, orderedQuantity: 1 }],
      }),
    });
    assert("create order", res.status === 200 && json.order?.orderNumber, JSON.stringify(json));
    orderId = json.order?.id;

    const list = await req("/api/orders?status=WAITING");
    assert("waiting filter", list.res.status === 200 && list.json.orders?.length >= 1);

    const patch = await req(`/api/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({
        action: "status",
        deliveryStatus: "FAILED",
        reasonCode: "Customer didn't pick up",
        adminComments: "E2E follow-up note",
      }),
    });
    assert("status failed + comment", patch.res.status === 200);

    const tags = await req(`/api/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "edit", tags: ["e2e", "vip"] }),
    });
    assert("edit tags", tags.res.status === 200);

    const csv = await req("/api/orders/export");
    assert(
      "csv export",
      csv.res.status === 200 && csv.text.includes("orderNumber") && csv.text.includes("Test Buyer"),
    );
  }

  console.log("Partial return");
  {
    const created = await req("/api/orders", {
      method: "POST",
      body: JSON.stringify({
        customerName: "Partial Buyer",
        customerPhone: "01710000088",
        sourceChannel: "PHONE",
        items: [{ productId, orderedQuantity: 3 }],
      }),
    });
    const oid = created.json.order?.id;
    const itemId = created.json.order?.items?.[0]?.id;
    const partial = await req(`/api/orders/${oid}`, {
      method: "PATCH",
      body: JSON.stringify({
        action: "partial",
        items: [{ orderItemId: itemId, acceptedQuantity: 2, returnedQuantity: 1 }],
        reasonCode: "Partial accept",
      }),
    });
    assert("partial apply", partial.res.status === 200 && partial.json.order?.deliveryStatus === "PARTIAL", JSON.stringify(partial.json));
  }

  console.log("Inbox");
  {
    const { res, json } = await req("/api/inbox", {
      method: "POST",
      body: JSON.stringify({
        channel: "INSTAGRAM",
        customerName: "E2E Inbox",
        customerPhone: "01710000077",
        body: "Do you have XL?",
      }),
    });
    assert("inbox create", res.status === 200 && json.message?.id);
    const close = await req("/api/inbox", {
      method: "PATCH",
      body: JSON.stringify({ id: json.message.id, status: "CLOSED" }),
    });
    assert("inbox close", close.res.status === 200);
  }

  console.log("Couriers");
  {
    const list = await req("/api/delivery-connections");
    assert("courier list admin", list.res.status === 200 && list.json.connections?.length >= 1);
    courierId = list.json.connections[0].id;
    const connect = await req(`/api/delivery-connections/${courierId}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "connect", apiKey: "e2e-key-12345" }),
    });
    assert("courier connect", connect.res.status === 200);

    const ship = await req(`/api/delivery-connections/${courierId}/ship`, {
      method: "POST",
      body: JSON.stringify({ orderId }),
    });
    assert("courier ship", ship.res.status === 200 && ship.json.ok === true, JSON.stringify(ship.json));
  }

  console.log("Analytics + audit");
  {
    const a = await req("/api/analytics");
    assert("analytics admin", a.res.status === 200 && a.json.restricted === false);
    const audit = await req("/api/audit");
    assert("audit admin", audit.res.status === 200 && audit.json.logs?.length > 0);
  }

  console.log("Webhook");
  {
    const products = await req("/api/products");
    const sku = products.json.products[0].sku;
    const wh = await req("/api/webhooks/order", {
      method: "POST",
      body: JSON.stringify({
        channel: "TIKTOK",
        customerName: "Webhook User",
        customerPhone: "01710000066",
        items: [{ sku, qty: 1 }],
        inboxBody: "From TikTok bot",
      }),
    });
    assert("webhook order", wh.res.status === 200 && wh.json.ok === true, JSON.stringify(wh.json));
  }

  console.log("Staff role gate");
  {
    const login = await req("/api/session", {
      method: "POST",
      body: JSON.stringify({ username: "staff", pin: "5678" }),
    });
    assert("staff login", login.res.status === 200 && login.json.user?.role === "STAFF");
    const products = await req("/api/products");
    assert("staff hides factoryCost", products.json.products?.[0]?.factoryCost == null);
    const audit = await req("/api/audit");
    assert("staff blocked from audit", audit.res.status === 403);
  }

  console.log("Logout");
  {
    const out = await req("/api/session", { method: "DELETE" });
    assert("logout", out.res.status === 200);
    jar.cookie = "";
    const orders = await req("/api/orders");
    assert("orders blocked after logout", orders.res.status === 401);
  }

  console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
