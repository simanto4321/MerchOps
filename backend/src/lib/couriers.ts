export type CourierPreset = {
  provider: string;
  displayName: string;
  displayNameBn: string;
  apiBaseUrl: string;
  docsHint: string;
  color: string;
};

export const COURIER_PRESETS: CourierPreset[] = [
  {
    provider: "PATHAO",
    displayName: "Pathao Parcel",
    displayNameBn: "পাঠাও পার্সেল",
    apiBaseUrl: "https://api-hermes.pathao.com",
    docsHint: "Merchant API — client_id, client_secret, store_id",
    color: "#E31C25",
  },
  {
    provider: "STEADFAST",
    displayName: "Steadfast",
    displayNameBn: "স্টেডফাস্ট",
    apiBaseUrl: "https://portal.packzy.com/api/v1",
    docsHint: "API Key + Secret from Steadfast merchant panel",
    color: "#0B5FFF",
  },
  {
    provider: "REDX",
    displayName: "RedX",
    displayNameBn: "রেডএক্স",
    apiBaseUrl: "https://openapi.redx.com.bd",
    docsHint: "API Access Token from RedX partner portal",
    color: "#DC2626",
  },
  {
    provider: "SUNDARBAN",
    displayName: "Sundarban Courier",
    displayNameBn: "সুন্দরবন কুরিয়ার",
    apiBaseUrl: "https://api.sundarbancourier.com",
    docsHint: "Merchant credentials from Sundarban API desk",
    color: "#0F766E",
  },
  {
    provider: "PAPERFLY",
    displayName: "Paperfly",
    displayNameBn: "পেপারফ্লাই",
    apiBaseUrl: "https://api.paperfly.com.bd",
    docsHint: "Username / password or token from Paperfly",
    color: "#C2410C",
  },
  {
    provider: "ECOURIER",
    displayName: "eCourier",
    displayNameBn: "ইকুরিয়ার",
    apiBaseUrl: "https://backoffice.ecourier.com.bd/api",
    docsHint: "API Key, API Secret, User ID from eCourier",
    color: "#1D4ED8",
  },
];
