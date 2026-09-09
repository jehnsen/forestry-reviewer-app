import { NextResponse } from "next/server";

import { embeddedName } from "@/lib/questions";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/supabase/server-session";

/** Never cached: the first call writes the row that later calls read. */
export const dynamic = "force-dynamic";

/**
 * Explanations are shown to candidates as authoritative teaching text, so this
 * runs on the stronger model too. It is an easier task than writing the item —
 * the correct answer is supplied — but a wrong justification is still wrong.
 */
const MODEL = process.env.OPENAI_MODEL || "gpt-4o";

interface QuestionRow {
  id: string;
  subjects: { name: string } | { name: string }[] | null;
  topics: { name: string } | { name: string }[] | null;
  question: string;
  options: { id: string; text: string }[];
  correct_answer_id: string;
  explanation: string | null;
  detailed_explanation: string | null;
  tips: string | null;
}

interface GeneratedExplanation {
  explanation: string;
  detailed_explanation: string;
  tips: string;
}

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["explanation", "detailed_explanation", "tips"],
  properties: {
    explanation: { type: "string" },
    detailed_explanation: { type: "string" },
    tips: { type: "string" },
  },
};

async function generate(row: QuestionRow): Promise<GeneratedExplanation> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set, so explanations cannot be generated.");
  }

  const correct = row.options.find((o) => o.id === row.correct_answer_id);
  const optionList = row.options
    .map((o) => `${o.id.toUpperCase()}. ${o.text}`)
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "question_explanation",
          strict: true,
          schema: RESPONSE_SCHEMA,
        },
      },
      messages: [
        {
          role: "system",
          content: [
            "You are a reviewer for the Philippine Forester Licensure Examination administered by the PRC.",
            "You are given a question and its verified correct answer. The correct answer is authoritative: explain why it is correct, never dispute it.",
            "explanation: two or three sentences stating why the correct option is right.",
            "detailed_explanation: a fuller treatment that also says why each wrong option fails, with any formula worked through step by step.",
            "tips: one short exam-room heuristic for recognising this kind of item.",
            "Use SI units and Philippine legal citations where relevant. Plain prose, no markdown headings.",
          ].join(" "),
        },
        {
          role: "user",
          content: [
            `Board paper: ${embeddedName(row.subjects)}`,
            `Topic: ${embeddedName(row.topics)}`,
            `Question: ${row.question}`,
            "",
            optionList,
            "",
            `Correct answer: ${row.correct_answer_id.toUpperCase()}. ${correct?.text ?? ""}`,
          ].join("\n"),
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI request failed (${response.status})`);
  }

  const body = await response.json();
  return JSON.parse(body.choices[0].message.content) as GeneratedExplanation;
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Generation costs money per call, so it is gated on a real session rather
  // than being an open endpoint.
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("questions")
    .select(
      "id,subjects(name),topics(name),question,options,correct_answer_id," +
        "explanation,detailed_explanation,tips"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  const row = data as unknown as QuestionRow;

  // Already generated (or hand-written): serve it and spend nothing.
  if (row.explanation) {
    return NextResponse.json({
      explanation: row.explanation,
      detailedExplanation: row.detailed_explanation,
      tips: row.tips,
      cached: true,
    });
  }

  let generated: GeneratedExplanation;
  try {
    generated = await generate(row);
  } catch (cause) {
    return NextResponse.json(
      {
        error:
          cause instanceof Error ? cause.message : "Could not generate an explanation.",
      },
      { status: 502 }
    );
  }

  // Conditional on explanation still being null, so two users answering the
  // same question at once cannot overwrite each other. Whoever loses the race
  // simply reads back the winner's text below.
  const { data: updated } = await supabase
    .from("questions")
    .update({
      explanation: generated.explanation,
      detailed_explanation: generated.detailed_explanation,
      tips: generated.tips,
      explanation_generated_at: new Date().toISOString(),
      explanation_model: MODEL,
    })
    .eq("id", id)
    .is("explanation", null)
    .select("explanation,detailed_explanation,tips")
    .maybeSingle();

  if (updated) {
    const row = updated as unknown as {
      explanation: string;
      detailed_explanation: string | null;
      tips: string | null;
    };
    return NextResponse.json({
      explanation: row.explanation,
      detailedExplanation: row.detailed_explanation,
      tips: row.tips,
      cached: false,
    });
  }

  // Lost the race: return whatever the winner stored.
  const { data: existing } = await supabase
    .from("questions")
    .select("explanation,detailed_explanation,tips")
    .eq("id", id)
    .maybeSingle();

  const winner = existing as unknown as {
    explanation: string | null;
    detailed_explanation: string | null;
    tips: string | null;
  } | null;

  return NextResponse.json({
    explanation: winner?.explanation ?? generated.explanation,
    detailedExplanation: winner?.detailed_explanation ?? generated.detailed_explanation,
    tips: winner?.tips ?? generated.tips,
    cached: true,
  });
}
