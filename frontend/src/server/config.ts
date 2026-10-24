/** Runtime flags for MerchOps backend */

export function isProd() {
  return process.env.NODE_ENV === "production";
}

/** Show quick-login hints on /login (local/demo only) */
export function allowDemoAccounts() {
  if (process.env.ALLOW_DEMO_ACCOUNTS === "true") return true;
  if (process.env.ALLOW_DEMO_ACCOUNTS === "false") return false;
  return !isProd();
}

/** In-desk role switcher (disable in real production) */
export function allowRoleSwitch() {
  if (process.env.ALLOW_ROLE_SWITCH === "true") return true;
  if (process.env.ALLOW_ROLE_SWITCH === "false") return false;
  return !isProd();
}

export const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "MerchOps";
