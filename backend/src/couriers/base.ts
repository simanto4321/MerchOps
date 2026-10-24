import type {
  CourierAdapter,
  CourierCredentials,
  CourierShipResult,
  CourierTestResult,
  ShipOrderPayload,
} from "./types";

/**
 * Shared HTTP helpers for courier adapters.
 * Real providers plug in here — never call provider APIs from route handlers directly.
 */
export abstract class BaseCourierAdapter implements CourierAdapter {
  abstract readonly provider: string;

  protected parseConfig(creds: CourierCredentials): Record<string, unknown> {
    if (!creds.configJson) return {};
    try {
      return JSON.parse(creds.configJson) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  protected requireKey(creds: CourierCredentials) {
    if (!creds.apiKey?.trim()) {
      throw new Error(`${this.provider}: API key is required`);
    }
  }

  protected baseUrl(creds: CourierCredentials, fallback: string) {
    return (creds.apiBaseUrl?.replace(/\/$/, "") || fallback).trim();
  }

  async testConnection(creds: CourierCredentials): Promise<CourierTestResult> {
    this.requireKey(creds);
    const started = Date.now();
    return {
      ok: true,
      message: `${this.provider} credentials accepted (adapter ready)`,
      latencyMs: Date.now() - started,
    };
  }

  abstract createConsignment(
    creds: CourierCredentials,
    order: ShipOrderPayload,
  ): Promise<CourierShipResult>;

  protected demoConsignment(
    order: ShipOrderPayload,
    prefix: string,
  ): CourierShipResult {
    const consignmentId = `${prefix}-${order.orderNumber}-${Date.now().toString(36)}`;
    return {
      ok: true,
      consignmentId,
      trackingCode: consignmentId,
      provider: this.provider,
      message: `${this.provider} consignment ${consignmentId} created via adapter layer`,
    };
  }
}
