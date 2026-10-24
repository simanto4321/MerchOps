import { getCourierAdapter } from "../couriers/registry";
import type { CourierCredentials, ShipOrderPayload } from "../couriers/types";

export async function testCourierConnection(
  provider: string,
  creds: CourierCredentials,
) {
  const adapter = getCourierAdapter(provider);
  return adapter.testConnection(creds);
}

export async function shipWithCourier(
  provider: string,
  creds: CourierCredentials,
  order: ShipOrderPayload,
) {
  const adapter = getCourierAdapter(provider);
  return adapter.createConsignment(creds, order);
}
