"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getBrowserClient } from "./client";

export type SessionResult =
  | { status: "ready"; client: SupabaseClient; userId: string }
  | { status: "signed-out" }
  | { status: "error"; message: string };

/**
 * Return the signed-in visitor's Supabase client, or report that nobody is
 * signed in.
 *
 * This never creates a session. Middleware redirects signed-out visitors away
 * from every page that calls this, so "signed-out" here means a session
 * expired mid-visit rather than a normal state — callers surface it as a
 * prompt to sign in again, not as an error.
 */
export async function getActiveSession(): Promise<SessionResult> {
  let supabase: SupabaseClient;

  try {
    supabase = getBrowserClient();
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Supabase is not configured.",
    };
  }

  // Checked first so that simply being signed out is not reported as an error:
  // getUser() raises "Auth session missing" when there is no session at all.
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    return { status: "signed-out" };
  }

  // Revalidates the cookie against the auth server rather than trusting it.
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return { status: "error", message: error.message };
  }
  if (!data.user) {
    return { status: "signed-out" };
  }

  return { status: "ready", client: supabase, userId: data.user.id };
}
