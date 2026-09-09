import "server-only";

import { createServiceRoleClient } from "./supabase/server";
import type { ForestrySubject, Question } from "./types";

/**
 * PostgREST returns an embedded parent row as an object, but types it as an
 * array; accept both shapes.
 */
export function embeddedName(
  value: { name: string } | { name: string }[] | null
): string {
  const row = Array.isArray(value) ? value[0] : value;
  return row?.name ?? "";
}

/** Shape of a row in public.questions. */
interface QuestionRow {
  id: string;
  subject_id: string;
  subjects: { name: string } | { name: string }[] | null;
  topic_id: string | null;
  difficulty: Question["difficulty"];
  question: string;
  options: unknown;
  correct_answer_id: string;
  explanation: string | null;
  detailed_explanation: string | null;
  tips: string | null;
}

/** Raised when questions cannot be loaded, so pages can render an error state. */
export class QuestionsUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "QuestionsUnavailableError";
  }
}

const SELECT_COLUMNS =
  "id,subject_id,subjects(name),topic_id,difficulty,question,options," +
  "correct_answer_id,explanation,detailed_explanation,tips";

/**
 * Options arrive as JSONB. Validate the shape rather than trusting it, so a
 * malformed row fails loudly here instead of rendering an unanswerable question.
 */
export function parseOptions(raw: unknown, questionId: string): Question["options"] {
  if (!Array.isArray(raw)) {
    throw new QuestionsUnavailableError(
      `Question ${questionId} has malformed options (expected an array).`
    );
  }

  return raw.map((option) => {
    if (
      typeof option !== "object" ||
      option === null ||
      typeof (option as { id?: unknown }).id !== "string" ||
      typeof (option as { text?: unknown }).text !== "string"
    ) {
      throw new QuestionsUnavailableError(
        `Question ${questionId} has an option missing a string id or text.`
      );
    }

    const { id, text } = option as { id: string; text: string };
    return { id, text };
  });
}

function toQuestion(row: QuestionRow): Question {
  const options = parseOptions(row.options, row.id);

  if (!options.some((option) => option.id === row.correct_answer_id)) {
    throw new QuestionsUnavailableError(
      `Question ${row.id} has a correct_answer_id that matches no option.`
    );
  }

  return {
    id: row.id,
    subject: embeddedName(row.subjects) as ForestrySubject,
    topicId: row.topic_id ?? undefined,
    difficulty: row.difficulty,
    question: row.question,
    options,
    correctAnswerId: row.correct_answer_id,
    explanation: row.explanation ?? undefined,
    detailedExplanation: row.detailed_explanation ?? undefined,
    tips: row.tips ?? undefined,
  };
}

/**
 * Fetch active questions in display order.
 *
 * Ordered by sort_order rather than id: ids encode a subject prefix, so
 * sorting by them made the sequence a side effect of the naming scheme and
 * left no way to reorder a question without renaming a primary key that
 * user_answers references. id is kept as a tiebreaker for a stable order.
 */
export async function fetchQuestions(): Promise<Question[]> {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch (error) {
    throw new QuestionsUnavailableError(
      error instanceof Error ? error.message : "Supabase is not configured.",
      { cause: error }
    );
  }

  const { data, error } = await supabase
    .from("questions")
    .select(SELECT_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new QuestionsUnavailableError(
      `Could not load questions from Supabase: ${error.message}`,
      { cause: error }
    );
  }

  if (!data || data.length === 0) {
    throw new QuestionsUnavailableError(
      "No questions found. Run supabase/seed_questions.sql against your project."
    );
  }

  return (data as unknown as QuestionRow[]).map(toQuestion);
}

/** Fetch a single question by id, or null when it does not exist. */
export async function fetchQuestionById(id: string): Promise<Question | null> {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch (error) {
    throw new QuestionsUnavailableError(
      error instanceof Error ? error.message : "Supabase is not configured.",
      { cause: error }
    );
  }

  const { data, error } = await supabase
    .from("questions")
    .select(SELECT_COLUMNS)
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw new QuestionsUnavailableError(
      `Could not load question ${id}: ${error.message}`,
      { cause: error }
    );
  }

  return data ? toQuestion(data as unknown as QuestionRow) : null;
}

/** Ids in display order, for previous/next navigation without loading bodies. */
export async function fetchQuestionOrder(): Promise<string[]> {
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch (error) {
    throw new QuestionsUnavailableError(
      error instanceof Error ? error.message : "Supabase is not configured.",
      { cause: error }
    );
  }

  const { data, error } = await supabase
    .from("questions")
    .select("id")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new QuestionsUnavailableError(
      `Could not load question order: ${error.message}`,
      { cause: error }
    );
  }

  return (data ?? []).map((row) => (row as unknown as { id: string }).id);
}
