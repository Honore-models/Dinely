import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error(
    "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
}

// Singleton for server-side (API routes) — uses service_role to bypass RLS
declare global {
  // eslint-disable-next-line no-var
  var _supabase: SupabaseClient | undefined;
}

let supabase: SupabaseClient;

if (process.env.NODE_ENV === "development") {
  if (!global._supabase) {
    global._supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  }
  supabase = global._supabase;
} else {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

export { supabase };

// Public (anon) client — for client-side usage if needed
export function getPublicClient() {
  return createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
