import { InventoryDesk } from "@/components/inventory-desk";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canViewCosts } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const user = await getCurrentUser();
  const isAdmin = !!user && canViewCosts(user.role);
  const products = await prisma.product.findMany({ orderBy: { name: "asc" } });

  return (
    <InventoryDesk
      isAdmin={isAdmin}
      initialProducts={products.map((p) => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        retailPrice: p.retailPrice,
        stockQuantity: p.stockQuantity,
        lowStockThreshold: p.lowStockThreshold,
        costPrice: isAdmin ? p.costPrice : null,
        factoryCost: isAdmin ? p.factoryCost : null,
        margin: isAdmin ? p.retailPrice - p.factoryCost : null,
      }))}
    />
  );
}
