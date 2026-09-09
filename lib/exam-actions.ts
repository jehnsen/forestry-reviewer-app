"use client";

import { getActiveSession } from "./supabase/session";

export type StartExamResult =
  | { status: "started"; attemptId: string }
  | { status: "failed"; reason: string };

export type SaveExamAnswerResult =
  | { status: "saved" }
  | { status: "failed"; reason: string };

export type SubmitExamResult =
  | { status: "submitted"; score: number; total: number }
  | { status: "failed"; reason: string };

const SIGNED_OUT = "Your session has ended. Sign in again to continue.";

/**
 * Both RPCs return a composite row rather than SETOF, which PostgREST sends as
 * a bare object — but a single-row array is also a valid shape here. Normalise
 * rather than calling .single(), which rejects the object form.
 */
function firstRow<T>(data: unknown): T | null {
  if (Array.isArray(data)) return (data[0] as T) ?? null;
  return (data as T) ?? null;
}

/**
 * Begin a sitting.
 *
 * The RPC takes only an exam id — length, timer and passing mark come from the
 * exams table, so none of them can be chosen from here.
 */
export async function startExam(examId: string): Promise<StartExamResult> {
  const session = await getActiveSession();

  if (session.status === "signed-out") {
    return { status: "failed", reason: SIGNED_OUT };
  }
  if (session.status === "error") {
    return { status: "failed", reason: session.message };
  }

  const { data, error } = await session.client.rpc("start_exam_attempt", {
    p_exam_id: examId,
  });

  if (error) {
    return { status: "failed", reason: error.message };
  }

  const attempt = firstRow<{ id: string }>(data);

  if (!attempt?.id) {
    return { status: "failed", reason: "The exam could not be started." };
  }

  return { status: "started", attemptId: attempt.id };
}

/**
 * Record one answer. Upserts on (attempt_id, question_id), so changing an
 * answer replaces it rather than stacking a second row.
 *
 * is_correct is intentionally not sent at all: a BEFORE trigger derives it
 * before the NOT NULL check runs, and also refuses answers to a submitted or
 * expired attempt. If that trigger ever went missing the insert would fail
 * loudly rather than record an unscored answer.
 */
export async function saveExamAnswer(params: {
  attemptId: string;
  questionId: string;
  selectedAnswerId: string;
}): Promise<SaveExamAnswerResult> {
  const session = await getActiveSession();

  if (session.status === "signed-out") {
    return { status: "failed", reason: SIGNED_OUT };
  }
  if (session.status === "error") {
    return { status: "failed", reason: session.message };
  }

  const { error } = await session.client.from("exam_answers").upsert(
    {
      attempt_id: params.attemptId,
      question_id: params.questionId,
      selected_answer_id: params.selectedAnswerId,
    },
    { onConflict: "attempt_id,question_id" }
  );

  if (error) {
    return { status: "failed", reason: error.message };
  }

  return { status: "saved" };
}

/** Finalise and score. Idempotent server-side, so double submission is safe. */
export async function submitExam(
  attemptId: string
): Promise<SubmitExamResult> {
  const session = await getActiveSession();

  if (session.status === "signed-out") {
    return { status: "failed", reason: SIGNED_OUT };
  }
  if (session.status === "error") {
    return { status: "failed", reason: session.message };
  }

  const { data, error } = await session.client.rpc("submit_exam_attempt", {
    p_attempt_id: attemptId,
  });

  if (error) {
    return { status: "failed", reason: error.message };
  }

  const attempt = firstRow<{ score: number | null; total: number }>(data);

  if (!attempt) {
    return { status: "failed", reason: "The exam could not be submitted." };
  }

  return {
    status: "submitted",
    score: attempt.score ?? 0,
    total: attempt.total,
  };
}
