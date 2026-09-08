import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getPublicSupabaseEnv, getServiceRoleKey } from "./env";

/**
 * Server-side Supabase client using the service role key.
 *
 * The `server-only` import above makes the build fail if this module is ever
 * pulled into a Client Component, which would otherwise ship full database
 * access to the browser.
 *
 * This client bypasses Row Level Security, so it must only be used for reads
 * that are safe for any visitor to see — currently the question bank. Anything
 * scoped to a specific user goes through the browser client, where RLS applies.
 */
export function createServiceRoleClient() {
  const { url } = getPublicSupabaseEnv();

  return createClient(url, getServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
