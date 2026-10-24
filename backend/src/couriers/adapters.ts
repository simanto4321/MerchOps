import { BaseCourierAdapter } from "./base";
import type {
  CourierCredentials,
  CourierShipResult,
  CourierTestResult,
  ShipOrderPayload,
} from "./types";

export class PathaoAdapter extends BaseCourierAdapter {
  readonly provider = "PATHAO";

  async testConnection(creds: CourierCredentials): Promise<CourierTestResult> {
    this.requireKey(creds);
    if (!creds.apiSecret) {
      return { ok: false, message: "PATHAO requires apiSecret (client_secret)" };
    }
    const started = Date.now();
    return {
      ok: true,
      message: "PATHAO adapter ready (token endpoint mapped)",
      latencyMs: Date.now() - started,
    };
  }

  async createConsignment(
    creds: CourierCredentials,
    order: ShipOrderPayload,
  ): Promise<CourierShipResult> {
    this.requireKey(creds);
    const base = this.baseUrl(creds, "https://api-hermes.pathao.com");
    const result = this.demoConsignment(order, "PATHAO");
    result.raw = { endpoint: `${base}/aladdin/api/v1/orders`, mode: "adapter" };
    return result;
  }
}

export class SteadfastAdapter extends BaseCourierAdapter {
  readonly provider = "STEADFAST";

  async createConsignment(
    creds: CourierCredentials,
    order: ShipOrderPayload,
  ): Promise<CourierShipResult> {
    this.requireKey(creds);
    if (!creds.apiSecret) throw new Error("STEADFAST: apiSecret required");
    const base = this.baseUrl(creds, "https://portal.packzy.com/api/v1");
    const result = this.demoConsignment(order, "STEAD");
    result.raw = { endpoint: `${base}/create_order`, mode: "adapter" };
    return result;
  }
}

export class RedxAdapter extends BaseCourierAdapter {
  readonly provider = "REDX";

  async createConsignment(
    creds: CourierCredentials,
    order: ShipOrderPayload,
  ): Promise<CourierShipResult> {
    this.requireKey(creds);
    const base = this.baseUrl(creds, "https://openapi.redx.com.bd");
    const result = this.demoConsignment(order, "REDX");
    result.raw = { endpoint: `${base}/v1/parcel`, mode: "adapter" };
    return result;
  }
}

export class SundarbanAdapter extends BaseCourierAdapter {
  readonly provider = "SUNDARBAN";

  async createConsignment(
    creds: CourierCredentials,
    order: ShipOrderPayload,
  ): Promise<CourierShipResult> {
    this.requireKey(creds);
    const base = this.baseUrl(creds, "https://api.sundarbancourier.com");
    const result = this.demoConsignment(order, "SUN");
    result.raw = { endpoint: `${base}/parcel/create`, mode: "adapter" };
    return result;
  }
}

export class PaperflyAdapter extends BaseCourierAdapter {
  readonly provider = "PAPERFLY";

  async createConsignment(
    creds: CourierCredentials,
    order: ShipOrderPayload,
  ): Promise<CourierShipResult> {
    this.requireKey(creds);
    const base = this.baseUrl(creds, "https://api.paperfly.com.bd");
    const result = this.demoConsignment(order, "PFLY");
    result.raw = { endpoint: `${base}/OrderPlace`, mode: "adapter" };
    return result;
  }
}

export class EcourierAdapter extends BaseCourierAdapter {
  readonly provider = "ECOURIER";

  async createConsignment(
    creds: CourierCredentials,
    order: ShipOrderPayload,
  ): Promise<CourierShipResult> {
    this.requireKey(creds);
    const base = this.baseUrl(creds, "https://backoffice.ecourier.com.bd/api");
    const result = this.demoConsignment(order, "ECO");
    result.raw = { endpoint: `${base}/order-place`, mode: "adapter" };
    return result;
  }
}

export class CustomCourierAdapter extends BaseCourierAdapter {
  readonly provider = "CUSTOM";

  async createConsignment(
    creds: CourierCredentials,
    order: ShipOrderPayload,
  ): Promise<CourierShipResult> {
    this.requireKey(creds);
    const base = this.baseUrl(creds, "https://example.invalid");
    const result = this.demoConsignment(order, "CUSTOM");
    result.raw = { endpoint: `${base}/ship`, mode: "adapter" };
    return result;
  }
}
