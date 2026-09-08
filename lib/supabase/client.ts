"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getPublicSupabaseEnv } from "./env";

let client: SupabaseClient | null = null;

/**
 * Browser Supabase client, using the anon key.
 *
 * Unlike the server client this respects Row Level Security, so it can only
 * touch rows the current session owns. Used for the visitor's own session and
 * for recording their answers.
 *
 * Memoized so every component shares one client and therefore one auth session.
 */
export function getBrowserClient() {
  if (!client) {
    const { url, anonKey } = getPublicSupabaseEnv();
    client = createBrowserClient(url, anonKey);
  }

  return client;
}
