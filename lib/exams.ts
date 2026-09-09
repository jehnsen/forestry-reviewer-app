import "server-only";

import { createServiceRoleClient } from "./supabase/server";
import { createServerSessionClient } from "./supabase/server-session";
import { QuestionsUnavailableError, parseOptions } from "./questions";
import type { ForestrySubject, Question } from "./types";

/** One mock paper, sized to what the question bank can actually serve. */
export interface ExamSummary {
  id: string;
  name: string;
  description: string | null;
  subjects: ForestrySubject[];
  /** The full-length target, e.g. 170. */
  targetQuestions: number;
  /** What this exam will actually serve today. */
  questionCount: number;
  durationSeconds: number;
  passingPct: number;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examName: string;
  questionIds: string[];
  total: number;
  passingPct: number;
  startedAt: string;
  expiresAt: string;
  submittedAt: string | null;
  score: number | null;
}

/**
 * A question as shown during an exam.
 *
 * Deliberately missing correctAnswerId, explanation and tips: the runner is a
 * Client Component, so anything on this object is readable from the page
 * source. Scoring happens in the database instead.
 */
export interface ExamQuestion {
  id: string;
  subject: ForestrySubject;
  difficulty: Question["difficulty"];
  question: string;
  options: Question["options"];
}

/** A finished question, with the key — only ever built after submission. */
export interface ExamReviewItem {
  question: Question;
  selectedAnswerId: string | null;
  isCorrect: boolean;
}

interface AttemptRow {
  id: string;
  exam_id: string;
  question_ids: string[];
  total: number;
  passing_pct: number;
  started_at: string;
  expires_at: string;
  submitted_at: string | null;
  score: number | null;
  exams: { name: string } | { name: string }[] | null;
}

const ATTEMPT_COLUMNS =
  "id,exam_id,question_ids,total,passing_pct,started_at,expires_at,submitted_at,score,exams(name)";

function toAttempt(row: AttemptRow): ExamAttempt {
  // PostgREST returns an embedded row as an object, but types it as an array
  // for one-to-many relationships; normalise both shapes.
  const exam = Array.isArray(row.exams) ? row.exams[0] : row.exams;

  return {
    id: row.id,
    examId: row.exam_id,
    examName: exam?.name ?? "Mock Exam",
    questionIds: row.question_ids,
    total: row.total,
    passingPct: row.passing_pct,
    startedAt: row.started_at,
    expiresAt: row.expires_at,
    submittedAt: row.submitted_at,
    score: row.score,
  };
}

/** The papers on offer. Reads exam_catalog, which computes real sizes. */
export async function fetchExamCatalog(): Promise<ExamSummary[]> {
  const supabase = await createServerSessionClient();

  const { data, error } = await supabase
    .from("exam_catalog")
    .select(
      "id,name,description,subjects,target_questions,question_count,duration_seconds,passing_pct,sort_order"
    )
    .order("sort_order", { ascending: true });

  if (error) {
    throw new QuestionsUnavailableError(
      `Could not load mock exams: ${error.message}`,
      { cause: error }
    );
  }

  return (data ?? []).map((row) => {
    const r = row as unknown as {
      id: string;
      name: string;
      description: string | null;
      subjects: ForestrySubject[];
      target_questions: number;
      question_count: number;
      duration_seconds: number;
      passing_pct: number;
    };

    return {
      id: r.id,
      name: r.name,
      description: r.description,
      subjects: r.subjects,
      targetQuestions: r.target_questions,
      questionCount: r.question_count,
      durationSeconds: r.duration_seconds,
      passingPct: r.passing_pct,
    };
  });
}

/** One attempt, or null when it does not exist or belongs to someone else. */
export async function fetchAttempt(id: string): Promise<ExamAttempt | null> {
  const supabase = await createServerSessionClient();

  const { data, error } = await supabase
    .from("exam_attempts")
    .select(ATTEMPT_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  // RLS makes another user's attempt simply invisible, so "no row" and "not
  // yours" arrive here identically — both mean the same thing to the caller.
  if (error || !data) return null;

  return toAttempt(data as unknown as AttemptRow);
}

/** This user's attempts, newest first, for the past-results list. */
export async function fetchRecentAttempts(limit = 10): Promise<ExamAttempt[]> {
  const supabase = await createServerSessionClient();

  const { data, error } = await supabase
    .from("exam_attempts")
    .select(ATTEMPT_COLUMNS)
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) return [];

  return (data as unknown as AttemptRow[]).map(toAttempt);
}

const EXAM_QUESTION_COLUMNS = "id,subject,difficulty,question,options";

/**
 * The paper's questions, without the answer key, in the order the attempt
 * froze at start time.
 */
export async function fetchExamQuestions(
  questionIds: string[]
): Promise<ExamQuestion[]> {
  if (questionIds.length === 0) return [];

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("questions")
    .select(EXAM_QUESTION_COLUMNS)
    .in("id", questionIds);

  if (error) {
    throw new QuestionsUnavailableError(
      `Could not load exam questions: ${error.message}`,
      { cause: error }
    );
  }

  const byId = new Map<string, ExamQuestion>();

  for (const row of (data ?? []) as unknown as {
    id: string;
    subject: ForestrySubject;
    difficulty: Question["difficulty"];
    question: string;
    options: unknown;
  }[]) {
    byId.set(row.id, {
      id: row.id,
      subject: row.subject,
      difficulty: row.difficulty,
      question: row.question,
      options: parseOptions(row.options, row.id),
    });
  }

  // Driven by questionIds so the stored paper order wins, not PostgREST's.
  return questionIds
    .map((id) => byId.get(id))
    .filter((q): q is ExamQuestion => Boolean(q));
}

/** Answers saved so far, as questionId -> selected option id. */
export async function fetchAttemptAnswers(
  attemptId: string
): Promise<Record<string, string>> {
  const supabase = await createServerSessionClient();

  const { data, error } = await supabase
    .from("exam_answers")
    .select("question_id,selected_answer_id")
    .eq("attempt_id", attemptId);

  if (error) return {};

  const answers: Record<string, string> = {};
  for (const row of (data ?? []) as unknown as {
    question_id: string;
    selected_answer_id: string;
  }[]) {
    answers[row.question_id] = row.selected_answer_id;
  }

  return answers;
}

/**
 * Full review data for a finished attempt — questions with the key, paired
 * with what the candidate chose.
 */
export async function fetchAttemptReview(
  attempt: ExamAttempt
): Promise<ExamReviewItem[]> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      "id,subject,difficulty,question,options,correct_answer_id,explanation,detailed_explanation,tips"
    )
    .in("id", attempt.questionIds);

  if (error) {
    throw new QuestionsUnavailableError(
      `Could not load exam review: ${error.message}`,
      { cause: error }
    );
  }

  const answers = await fetchAttemptAnswers(attempt.id);
  const byId = new Map<string, Question>();

  for (const row of (data ?? []) as unknown as {
    id: string;
    subject: ForestrySubject;
    difficulty: Question["difficulty"];
    question: string;
    options: unknown;
    correct_answer_id: string;
    explanation: string;
    detailed_explanation: string | null;
    tips: string | null;
  }[]) {
    byId.set(row.id, {
      id: row.id,
      subject: row.subject,
      difficulty: row.difficulty,
      question: row.question,
      options: parseOptions(row.options, row.id),
      correctAnswerId: row.correct_answer_id,
      explanation: row.explanation,
      detailedExplanation: row.detailed_explanation ?? undefined,
      tips: row.tips ?? undefined,
    });
  }

  return attempt.questionIds
    .map((id): ExamReviewItem | null => {
      const question = byId.get(id);
      if (!question) return null;

      const selectedAnswerId = answers[id] ?? null;
      return {
        question,
        selectedAnswerId,
        isCorrect: selectedAnswerId === question.correctAnswerId,
      };
    })
    .filter((item): item is ExamReviewItem => item !== null);
}
