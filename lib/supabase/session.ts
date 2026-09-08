"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getBrowserClient } from "./client";

/**
 * Anonymous sign-in must be enabled in the Supabase dashboard
 * (Authentication → Providers → Anonymous sign-ins). When it is off, Supabase
 * returns this error code and answer recording is skipped rather than failing
 * the page.
 */
const ANONYMOUS_DISABLED = "anonymous_provider_disabled";

export type SessionResult =
  | { status: "ready"; client: SupabaseClient; userId: string }
  | { status: "anonymous-disabled" }
  | { status: "error"; message: string };

/**
 * Return a signed-in Supabase client, creating an anonymous session if needed.
 *
 * `user_answers.user_id` is a foreign key to `auth.users`, so a real auth user
 * is required before any answer can be written. An anonymous user satisfies
 * that constraint and keeps each visitor's rows isolated under RLS, without
 * asking anyone to create an account.
 */
export async function ensureSession(): Promise<SessionResult> {
  let supabase: SupabaseClient;

  try {
    supabase = getBrowserClient();
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Supabase is not configured.",
    };
  }

  const { data: existing } = await supabase.auth.getSession();
  if (existing.session?.user) {
    return { status: "ready", client: supabase, userId: existing.session.user.id };
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    if (error.code === ANONYMOUS_DISABLED) {
      return { status: "anonymous-disabled" };
    }
    return { status: "error", message: error.message };
  }

  if (!data.user) {
    return { status: "error", message: "Sign-in returned no user." };
  }

  return { status: "ready", client: supabase, userId: data.user.id };
}
