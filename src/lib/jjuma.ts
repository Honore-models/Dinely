// Jjuma Global Payments client — based on the official Next.js integration guide.
import { env, assertJjumaEnv } from "./jjuma-env";
import crypto from "node:crypto";

// The guide returns payment_url both top-level and under data on some endpoints.
// We accept either shape.
type JJumaResponse =
  | {
      message?: string;
      payment_url?: string;
      verify_url?: string;
      data?: { payment_url?: string; verify_url?: string } | null;
    }
  | {
      message?: string;
      payment_url?: string;
      verify_url?: string;
      data?: { payment_url?: string; verify_url?: string } | null;
    };

async function jjumaRequest(
  path: string,
  init: RequestInit,
): Promise<JJumaResponse> {
  const response = await fetch(`${env.JJUMA_API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  const data = (await response.json()) as JJumaResponse;
  if (!response.ok) {
    throw new Error(data.message ?? "The Jjuma request failed.");
  }
  return data;
}

export { env } from "./jjuma-env";

export async function createPayment(payload: Record<string, unknown>) {
  assertJjumaEnv();
  return jjumaRequest("/api/v1/payments/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.JJUMA_PUBLIC_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function verifyPayment(transactionId: string) {
  assertJjumaEnv();
  return jjumaRequest(
    `/api/v1/payments/verify/${encodeURIComponent(transactionId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${env.JJUMA_SECRET_API_KEY}`,
      },
    },
  );
}

/**
 * Verify an incoming Jjuma webhook signature using HMAC-SHA256.
 * Matches the official guide: signature is over `timestamp.rawBody`.
 */
export function isValidJjumaSignature(
  rawBody: string,
  timestamp: string,
  signature: string,
): boolean {
  const expected = crypto
    .createHmac("sha256", env.JJUMA_WEBHOOK_SECRET)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  const normalized = signature.replace(/^sha256=/i, "").trim();
  const expectedBuf = Buffer.from(expected, "hex");
  const receivedBuf = Buffer.from(normalized, "hex");

  if (expectedBuf.length !== receivedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

/**
 * Parse a webhook event and extract the fields the guide uses.
 * Keep the real payment update inside the webhook route so we can
 * re-validate against DB state before marking anything paid.
 */
export type JjumaWebhookEvent = {
  event?: string;
  data?: {
    order_id?: string;
    transaction_id?: string;
    reference?: string;
    amount?: string | number;
    currency?: string;
  };
};

export function parseJjumaWebhook(rawBody: string): JjumaWebhookEvent {
  return JSON.parse(rawBody) as JjumaWebhookEvent;
}
