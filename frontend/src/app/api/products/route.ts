import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canViewCosts, canEditPrices } from "@/lib/session";
import { writeAuditLog } from "@/lib/audit";

function sanitizeProduct(
  product: {
    id: string;
    sku: string;
    name: string;
    costPrice: number;
    retailPrice: number;
    stockQuantity: number;
    factoryCost: number;
    lowStockThreshold: number;
    updatedAt: Date;
    createdAt: Date;
  },
  showCosts: boolean,
) {
  return {
    ...product,
    factoryCost: showCosts ? product.factoryCost : null,
    costPrice: showCosts ? product.costPrice : null,
    margin:
      showCosts && product.retailPrice
        ? product.retailPrice - product.factoryCost
        : null,
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const showCosts = canViewCosts(user.role);
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({
    products: products.map((p) => sanitizeProduct(p, showCosts)),
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user || !canEditPrices(user.role)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const body = await req.json();
  const product = await prisma.product.create({
    data: {
      sku: body.sku,
      name: body.name,
      costPrice: Number(body.costPrice),
      retailPrice: Number(body.retailPrice),
      factoryCost: Number(body.factoryCost),
      stockQuantity: Number(body.stockQuantity ?? 0),
      lowStockThreshold: Number(body.lowStockThreshold ?? 10),
    },
  });
  await writeAuditLog({
    userId: user.id,
    action: "STOCK_UPDATE",
    entityType: "Product",
    entityId: product.id,
    newValue: product,
  });
  return NextResponse.json({ product: sanitizeProduct(product, true) });
}

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const existing = await prisma.product.findUnique({ where: { id: body.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: Record<string, number | string> = {};
  let priceChanged = false;

  if (body.stockQuantity !== undefined) {
    data.stockQuantity = Number(body.stockQuantity);
  }
  if (body.lowStockThreshold !== undefined) {
    data.lowStockThreshold = Number(body.lowStockThreshold);
  }
  if (body.name !== undefined) data.name = String(body.name);
  if (body.sku !== undefined) {
    if (!canEditPrices(user.role)) {
      return NextResponse.json(
        { error: "Only admins can change SKU" },
        { status: 403 },
      );
    }
    data.sku = String(body.sku).trim();
  }

  if (
    body.retailPrice !== undefined ||
    body.costPrice !== undefined ||
    body.factoryCost !== undefined
  ) {
    if (!canEditPrices(user.role)) {
      return NextResponse.json(
        { error: "Only admins can change product prices or factory costs" },
        { status: 403 },
      );
    }
    if (body.retailPrice !== undefined) {
      data.retailPrice = Number(body.retailPrice);
      priceChanged = true;
    }
    if (body.costPrice !== undefined) {
      data.costPrice = Number(body.costPrice);
      priceChanged = true;
    }
    if (body.factoryCost !== undefined) {
      data.factoryCost = Number(body.factoryCost);
      priceChanged = true;
    }
  }

  const product = await prisma.product.update({
    where: { id: body.id },
    data,
  });

  await writeAuditLog({
    userId: user.id,
    action: priceChanged ? "PRICE_CHANGE" : "STOCK_UPDATE",
    entityType: "Product",
    entityId: product.id,
    previousValue: existing,
    newValue: product,
  });

  return NextResponse.json({
    product: sanitizeProduct(product, canViewCosts(user.role)),
  });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user || !canEditPrices(user.role)) {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Product id required" }, { status: 400 });
  }
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const linked = await prisma.orderItem.count({ where: { productId: id } });
  if (linked > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete — used on ${linked} order line(s). Set stock to 0 instead.`,
      },
      { status: 409 },
    );
  }
  await prisma.product.delete({ where: { id } });
  await writeAuditLog({
    userId: user.id,
    action: "DELETE_PRODUCT",
    entityType: "Product",
    entityId: id,
    previousValue: existing,
  });
  return NextResponse.json({ ok: true });
}
