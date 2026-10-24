export type Role = "ADMIN" | "STAFF" | "GUEST";

export type SourceChannel =
  | "INSTAGRAM"
  | "WHATSAPP"
  | "FACEBOOK"
  | "TIKTOK"
  | "WEBSITE"
  | "PHONE"
  | "OTHER";

export type DeliveryStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "FAILED"
  | "PARTIAL"
  | "EXCHANGE";

export type AuditAction =
  | "LOGIN"
  | "PRICE_CHANGE"
  | "EDIT_ORDER"
  | "STOCK_UPDATE"
  | "CREATE_ORDER"
  | "DELETE_ORDER"
  | "DELETE_PRODUCT"
  | "STATUS_CHANGE"
  | "PARTIAL_RETURN"
  | "EXCHANGE"
  | "MERGE_ORDERS"
  | "AD_SPEND_UPDATE"
  | "SETTINGS_CHANGE";

export type InboxStatus = "OPEN" | "LINKED" | "CLOSED" | "MERGED";
