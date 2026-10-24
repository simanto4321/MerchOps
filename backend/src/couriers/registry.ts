import type { CourierAdapter, CourierProviderId } from "./types";
import {
  CustomCourierAdapter,
  EcourierAdapter,
  PaperflyAdapter,
  PathaoAdapter,
  RedxAdapter,
  SteadfastAdapter,
  SundarbanAdapter,
} from "./adapters";

const adapters: Record<string, CourierAdapter> = {
  PATHAO: new PathaoAdapter(),
  STEADFAST: new SteadfastAdapter(),
  REDX: new RedxAdapter(),
  SUNDARBAN: new SundarbanAdapter(),
  PAPERFLY: new PaperflyAdapter(),
  ECOURIER: new EcourierAdapter(),
  CUSTOM: new CustomCourierAdapter(),
};

/** Resolve courier adapter by provider id — single entry for all shipping calls */
export function getCourierAdapter(
  provider: CourierProviderId | string,
): CourierAdapter {
  const key = String(provider || "CUSTOM").toUpperCase();
  return adapters[key] ?? adapters.CUSTOM;
}

export function listCourierAdapters() {
  return Object.keys(adapters);
}

export * from "./types";
export * from "./adapters";
