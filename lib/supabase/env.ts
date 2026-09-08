/**
 * Supabase environment access.
 *
 * Reading these through helpers (rather than process.env inline) keeps the
 * failure mode explicit: a missing variable throws a named error at the call
 * site instead of surfacing later as a confusing 401 from the API.
 */

/** Public values — safe to expose to the browser. */
export function getPublicSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
    );
  }

  return { url, anonKey };
}

/**
 * Service role key — bypasses Row Level Security.
 *
 * Server-only. Importing this from a Client Component would leak full database
 * access into the browser bundle, so every caller must run on the server.
 */
export function getServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. It is required to read questions " +
        "on the server."
    );
  }

  return key;
}

/** True when the public Supabase variables are present. */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
