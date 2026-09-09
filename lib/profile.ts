"use client";

import { getActiveSession } from "./supabase/session";

export interface Profile {
  fullName: string;
  /** ISO yyyy-mm-dd, or "" when unset — the shape a date input expects. */
  targetExamDate: string;
  email: string;
}

export type ProfileResult =
  | { status: "ready"; profile: Profile }
  | { status: "unavailable"; reason: string };

export type SaveProfileResult =
  | { status: "saved" }
  | { status: "skipped"; reason: string };

const SIGNED_OUT_REASON =
  "Your session has ended. Sign in again to keep saving your progress.";

/**
 * Load the signed-in user's profile row.
 *
 * A row is created by the on_auth_user_created trigger, but an account created
 * before that trigger existed may not have one — so a missing row is treated as
 * an empty profile rather than an error, and saving will create it.
 */
export async function fetchProfile(): Promise<ProfileResult> {
  const session = await getActiveSession();

  if (session.status === "signed-out") {
    return { status: "unavailable", reason: SIGNED_OUT_REASON };
  }
  if (session.status === "error") {
    return { status: "unavailable", reason: session.message };
  }

  const { data, error } = await session.client
    .from("profiles")
    .select("full_name, target_exam_date")
    .eq("id", session.userId)
    .maybeSingle();

  if (error) {
    return { status: "unavailable", reason: error.message };
  }

  const { data: userData } = await session.client.auth.getUser();
  const row = data as { full_name: string | null; target_exam_date: string | null } | null;

  return {
    status: "ready",
    profile: {
      fullName: row?.full_name ?? "",
      targetExamDate: row?.target_exam_date ?? "",
      email: userData.user?.email ?? "",
    },
  };
}

/** Write the editable fields back. Blank inputs are stored as NULL, not "". */
export async function saveProfile(params: {
  fullName: string;
  targetExamDate: string;
}): Promise<SaveProfileResult> {
  const session = await getActiveSession();

  if (session.status === "signed-out") {
    return { status: "skipped", reason: SIGNED_OUT_REASON };
  }
  if (session.status === "error") {
    return { status: "skipped", reason: session.message };
  }

  const { error } = await session.client.from("profiles").upsert({
    id: session.userId,
    full_name: params.fullName.trim() || null,
    target_exam_date: params.targetExamDate || null,
  });

  if (error) {
    return { status: "skipped", reason: error.message };
  }

  return { status: "saved" };
}
