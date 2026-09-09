"use client";

import { getActiveSession } from "./supabase/session";
import type { ForestrySubject } from "./types";

export interface SubjectAccuracy {
  subject: ForestrySubject;
  answered: number;
  correct: number;
  accuracy: number;
}

export interface ProgressSummary {
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  /** Lowest-accuracy subject with enough answers to be meaningful, if any. */
  weakestSubject: ForestrySubject | null;
  bySubject: SubjectAccuracy[];
}

export type ProgressResult =
  | { status: "ready"; progress: ProgressSummary }
  | { status: "unavailable"; reason: string };

/** Below this many answers, a subject's accuracy is too noisy to call "weakest". */
const MIN_ANSWERS_FOR_WEAKEST = 3;

interface AccuracyRow {
  subject: ForestrySubject;
  answered: number;
  correct: number;
  accuracy_pct: number | null;
}

/**
 * Load the signed-in user's progress.
 *
 * Queried from the browser because public.user_subject_accuracy is a
 * security_invoker view — it filters by auth.uid(), so it only returns rows for
 * whoever is signed in. Reading it with the service role key would return every
 * user's data instead.
 */
export async function fetchProgress(): Promise<ProgressResult> {
  const session = await getActiveSession();

  if (session.status === "signed-out") {
    return {
      status: "unavailable",
      reason: "Your session has ended. Sign in again to keep saving your progress.",
    };
  }

  if (session.status === "error") {
    return { status: "unavailable", reason: session.message };
  }

  const { data, error } = await session.client
    .from("user_subject_accuracy")
    .select("subject, answered, correct, accuracy_pct");

  if (error) {
    return { status: "unavailable", reason: error.message };
  }

  const rows = (data ?? []) as unknown as AccuracyRow[];

  const bySubject: SubjectAccuracy[] = rows
    .map((row) => ({
      subject: row.subject,
      answered: Number(row.answered) || 0,
      correct: Number(row.correct) || 0,
      accuracy: Number(row.accuracy_pct) || 0,
    }))
    .sort((a, b) => a.subject.localeCompare(b.subject));

  const questionsAnswered = bySubject.reduce((sum, s) => sum + s.answered, 0);
  const correctAnswers = bySubject.reduce((sum, s) => sum + s.correct, 0);

  // Ignore barely-sampled subjects so a single wrong answer does not brand a
  // subject as the weakest.
  const eligible = bySubject.filter((s) => s.answered >= MIN_ANSWERS_FOR_WEAKEST);
  const weakest = eligible.length
    ? eligible.reduce((lowest, s) => (s.accuracy < lowest.accuracy ? s : lowest))
    : null;

  return {
    status: "ready",
    progress: {
      questionsAnswered,
      correctAnswers,
      accuracy: questionsAnswered
        ? Math.round((correctAnswers / questionsAnswered) * 100)
        : 0,
      weakestSubject: weakest?.subject ?? null,
      bySubject,
    },
  };
}
