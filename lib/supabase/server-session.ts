import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getPublicSupabaseEnv } from "./env";

/**
 * Server-side Supabase client bound to the request's auth cookies.
 *
 * Distinct from createServiceRoleClient: this one carries the visitor's own
 * session and therefore respects Row Level Security, so it is what Server
 * Components use to ask who is signed in. The service-role client bypasses RLS
 * and must never be used for that.
 */
export async function createServerSessionClient() {
  const { url, anonKey } = getPublicSupabaseEnv();
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. Harmless: middleware runs
          // on every matched request and refreshes the session there instead.
        }
      },
    },
  });
}

/**
 * The signed-in user, or null.
 *
 * Uses getUser() rather than getSession(): getSession() trusts whatever is in
 * the cookie, while getUser() revalidates it against the Supabase auth server.
 */
export async function getSessionUser() {
  const supabase = await createServerSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
