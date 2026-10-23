import { z } from "zod";

export const sourceChannelSchema = z.enum([
  "INSTAGRAM",
  "WHATSAPP",
  "FACEBOOK",
  "TIKTOK",
  "WEBSITE",
  "PHONE",
  "OTHER",
]);

export const deliveryStatusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "DELIVERED",
  "FAILED",
  "PARTIAL",
  "EXCHANGE",
]);

export const orderItemInputSchema = z.object({
  productId: z.string().min(1),
  orderedQuantity: z.coerce.number().int().positive().max(9999),
  unitPrice: z.coerce.number().nonnegative().optional(),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(1).max(120),
  customerPhone: z.string().min(6).max(20),
  sourceChannel: sourceChannelSchema.optional().default("PHONE"),
  parcelValue: z.coerce.number().nonnegative().optional(),
  adminComments: z.string().max(2000).optional(),
  tags: z.array(z.string().max(40)).max(20).optional(),
  items: z.array(orderItemInputSchema).min(1),
});

export const bulkOrdersSchema = z.object({
  bulk: z.array(createOrderSchema).min(1).max(50),
});

export const loginSchema = z.object({
  email: z.string().email(),
  pin: z.string().min(4).max(12),
});

export const productPatchSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  stockQuantity: z.coerce.number().int().min(0).optional(),
  lowStockThreshold: z.coerce.number().int().min(0).optional(),
  retailPrice: z.coerce.number().nonnegative().optional(),
  costPrice: z.coerce.number().nonnegative().optional(),
  factoryCost: z.coerce.number().nonnegative().optional(),
});
