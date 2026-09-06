// JJuma environment configuration.
// Keep these server-side only — never expose secrets to Client Components.
export const env = {
  JJUMA_API_BASE_URL:
    process.env.JJUMA_API_BASE_URL ?? "https://api.jjuma.com",
  JJUMA_PUBLIC_API_KEY: process.env.JJUMA_PUBLIC_API_KEY ?? "",
  JJUMA_SECRET_API_KEY: process.env.JJUMA_SECRET_API_KEY ?? "",
  JJUMA_WEBHOOK_SECRET: process.env.JJUMA_WEBHOOK_SECRET ?? "",
  JJUMA_CHECKOUT_HOST: process.env.JJUMA_CHECKOUT_HOST ?? "pay.jjuma.com",
  APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.APP_URL ??
    "http://localhost:3000",
};

export function assertJjumaEnv() {
  const missing: string[] = [];
  if (!env.JJUMA_PUBLIC_API_KEY) missing.push("JJUMA_PUBLIC_API_KEY");
  if (!env.JJUMA_SECRET_API_KEY) missing.push("JJUMA_SECRET_API_KEY");
  if (!env.JJUMA_WEBHOOK_SECRET) missing.push("JJUMA_WEBHOOK_SECRET");
  if (missing.length) {
    throw new Error(`Missing Jjuma env vars: ${missing.join(", ")}`);
  }
}

export function isJjumaConfigured(): boolean {
  return Boolean(
    env.JJUMA_PUBLIC_API_KEY &&
      env.JJUMA_SECRET_API_KEY &&
      env.JJUMA_WEBHOOK_SECRET,
  );
}
