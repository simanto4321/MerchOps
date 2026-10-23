/** MerchOps ops clock — Bangladesh retail desk */
export const APP_TIMEZONE = "Asia/Dhaka";
export const APP_LOCALE = "en-GB";

export function formatDhaka(
  value: Date | string | number,
  options?: Intl.DateTimeFormatOptions,
) {
  const d = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: APP_TIMEZONE,
    ...options,
  }).format(d);
}

export function formatDhakaDateTime(value: Date | string | number) {
  return formatDhaka(value, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDhakaDate(value: Date | string | number) {
  return formatDhaka(value, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Start of calendar day in Asia/Dhaka, as a UTC Date */
export function startOfDhakaDay(ref = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(ref);
  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  const d = Number(parts.find((p) => p.type === "day")?.value);
  // Dhaka is UTC+6 year-round
  return new Date(Date.UTC(y, m - 1, d, -6, 0, 0, 0));
}

/** Start of calendar month in Asia/Dhaka, as a UTC Date */
export function startOfDhakaMonth(ref = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(ref);
  const y = Number(parts.find((p) => p.type === "year")?.value);
  const m = Number(parts.find((p) => p.type === "month")?.value);
  return new Date(Date.UTC(y, m - 1, 1, -6, 0, 0, 0));
}

export function dhakaMonthLabel(ref = new Date()) {
  return formatDhaka(ref, { month: "long", year: "numeric" });
}
