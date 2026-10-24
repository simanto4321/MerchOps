import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import type { AuditAction } from "./types";

export async function writeAuditLog(params: {
  userId?: string | null;
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  previousValue?: unknown;
  newValue?: unknown;
  tx?: Prisma.TransactionClient;
}) {
  const client = params.tx ?? prisma;
  return client.auditLog.create({
    data: {
      userId: params.userId ?? null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      previousValue:
        params.previousValue === undefined
          ? null
          : JSON.stringify(params.previousValue),
      newValue:
        params.newValue === undefined ? null : JSON.stringify(params.newValue),
    },
  });
}
