"use client";

import { ensureSession } from "./supabase/session";

export type RecordAnswerResult =
  | { status: "recorded" }
  | { status: "skipped"; reason: string };

/**
 * Persist one submitted answer to public.user_answers.
 *
 * Recording is best-effort: a study session should never break because
 * analytics could not be written, so failures are reported back to the caller
 * for a quiet indicator rather than thrown.
 */
export async function recordAnswer(params: {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
}): Promise<RecordAnswerResult> {
  const session = await ensureSession();

  if (session.status === "anonymous-disabled") {
    return {
      status: "skipped",
      reason:
        "Anonymous sign-ins are disabled in Supabase, so progress is not being saved.",
    };
  }

  if (session.status === "error") {
    return { status: "skipped", reason: session.message };
  }

  const { error } = await session.client.from("user_answers").insert({
    user_id: session.userId,
    question_id: params.questionId,
    selected_answer_id: params.selectedAnswerId,
    is_correct: params.isCorrect,
  });

  if (error) {
    return { status: "skipped", reason: error.message };
  }

  return { status: "recorded" };
}
