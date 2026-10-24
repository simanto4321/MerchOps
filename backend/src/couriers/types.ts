/** Courier provider adapter contracts */

export type CourierProviderId =
  | "PATHAO"
  | "STEADFAST"
  | "REDX"
  | "SUNDARBAN"
  | "PAPERFLY"
  | "ECOURIER"
  | "CUSTOM";

export type CourierCredentials = {
  apiBaseUrl?: string | null;
  apiKey?: string | null;
  apiSecret?: string | null;
  storeId?: string | null;
  configJson?: string | null;
};

export type ShipOrderPayload = {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  parcelValue: number;
  itemCount: number;
  notes?: string | null;
};

export type CourierShipResult = {
  ok: boolean;
  consignmentId: string;
  trackingCode?: string;
  provider: CourierProviderId | string;
  raw?: unknown;
  message: string;
};

export type CourierTestResult = {
  ok: boolean;
  message: string;
  latencyMs?: number;
};

export interface CourierAdapter {
  readonly provider: CourierProviderId | string;
  /** Validate credentials / reach provider health endpoint */
  testConnection(creds: CourierCredentials): Promise<CourierTestResult>;
  /** Create a consignment / parcel on the courier network */
  createConsignment(
    creds: CourierCredentials,
    order: ShipOrderPayload,
  ): Promise<CourierShipResult>;
}
