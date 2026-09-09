"use client";

import { getActiveSession } from "./supabase/session";

export type RecordAnswerResult =
  | { status: "recorded" }
  | { status: "skipped"; reason: string };

/**
 * Persist one submitted answer to public.user_answers.
 *
 * Correctness is deliberately not sent. A before-insert trigger looks up the
 * question and derives is_correct itself, so a client cannot report a score it
 * did not earn, and the UI and the database can never disagree about a result.
 *
 * Recording is best-effort: a study session should never break because
 * analytics could not be written, so failures are reported back to the caller
 * for a quiet indicator rather than thrown.
 */
export async function recordAnswer(params: {
  questionId: string;
  selectedAnswerId: string;
}): Promise<RecordAnswerResult> {
  const session = await getActiveSession();

  if (session.status === "signed-out") {
    return {
      status: "skipped",
      reason: "Your session has ended. Sign in again to keep saving your progress.",
    };
  }

  if (session.status === "error") {
    return { status: "skipped", reason: session.message };
  }

  const { error } = await session.client.from("user_answers").insert({
    user_id: session.userId,
    question_id: params.questionId,
    selected_answer_id: params.selectedAnswerId,
  });

  if (error) {
    return { status: "skipped", reason: error.message };
  }

  return { status: "recorded" };
}
