export const REASON_CODES = [
  "Customer didn't pick up",
  "Call forwarded",
  "Wrong address",
  "Customer refused parcel",
  "Reschedule requested",
  "Partial accept",
  "Exchange requested",
  "Payment issue",
  "Other",
] as const;

export const CHANNEL_LABELS: Record<string, string> = {
  INSTAGRAM: "Instagram",
  WHATSAPP: "WhatsApp",
  FACEBOOK: "Facebook",
  TIKTOK: "TikTok",
  WEBSITE: "Website",
  PHONE: "Phone",
  OTHER: "Other",
};

export const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  DELIVERED: "Delivered",
  FAILED: "Failed",
  PARTIAL: "Partial",
  EXCHANGE: "Exchange",
};

export const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  IN_PROGRESS: "bg-sky-100 text-sky-900",
  DELIVERED: "bg-emerald-100 text-emerald-900",
  FAILED: "bg-rose-100 text-rose-900",
  PARTIAL: "bg-violet-100 text-violet-900",
  EXCHANGE: "bg-orange-100 text-orange-900",
};
