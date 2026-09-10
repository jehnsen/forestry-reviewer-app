import { NextResponse } from "next/server";

import { embeddedName } from "@/lib/questions";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/supabase/server-session";

export const dynamic = "force-dynamic";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o";

/** Keeps one runaway conversation from becoming an unbounded prompt. */
const MAX_TURNS = 12;
const MAX_MESSAGE_CHARS = 600;

interface TurnInput {
  role: "user" | "assistant";
  content: string;
}

interface QuestionRow {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correct_answer_id: string;
  explanation: string | null;
  detailed_explanation: string | null;
  subjects: { name: string } | { name: string }[] | null;
  topics: { name: string } | { name: string }[] | null;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set, so the tutor is unavailable." },
      { status: 503 }
    );
  }

  let body: { message?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return NextResponse.json(
      { error: `Keep it under ${MAX_MESSAGE_CHARS} characters.` },
      { status: 400 }
    );
  }

  // History is echoed back by the client, so it is re-validated rather than
  // trusted: only the two known roles, only strings, only recent turns.
  const history: TurnInput[] = Array.isArray(body.history)
    ? (body.history as unknown[])
        .filter((t): t is TurnInput => {
          if (typeof t !== "object" || t === null) return false;
          const turn = t as { role?: unknown; content?: unknown };
          return (
            (turn.role === "user" || turn.role === "assistant") &&
            typeof turn.content === "string"
          );
        })
        .slice(-MAX_TURNS)
        .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_MESSAGE_CHARS) }))
    : [];

  // The question is read server-side from its id. The client sends only the id,
  // so it cannot pass off arbitrary text as "the question being studied".
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id,question,options,correct_answer_id,explanation,detailed_explanation," +
        "subjects(name),topics(name)"
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  const row = data as unknown as QuestionRow;
  const correct = row.options.find((o) => o.id === row.correct_answer_id);

  const context = [
    `Board paper: ${embeddedName(row.subjects)}`,
    `Topic: ${embeddedName(row.topics)}`,
    "",
    `Question: ${row.question}`,
    ...row.options.map((o) => `  ${o.id.toUpperCase()}. ${o.text}`),
    "",
    `Correct answer: ${row.correct_answer_id.toUpperCase()}. ${correct?.text ?? ""}`,
    row.explanation ? `\nExplanation on file: ${row.explanation}` : "",
    row.detailed_explanation ? `\nWorked solution: ${row.detailed_explanation}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: [
            "You are a forestry tutor helping a candidate revise for the Philippine Forester Licensure Examination.",
            "You are given the question they just answered, its correct answer, and any explanation on file. The correct answer is authoritative.",
            "Answer their follow-up directly and specifically. Show the actual formula and work the actual numbers when the question is computational.",
            "Be concise: a short paragraph, or a few steps. No preamble, no restating their question back to them, no closing offer to help further.",
            "If they ask something outside this question or outside forestry, say so briefly and steer back.",
            "Cite Philippine law by number where relevant (PD 705, RA 7586, RA 8371, RA 9147, RA 11038). Use SI units.",
          ].join(" "),
        },
        { role: "system", content: context },
        ...history,
        { role: "user", content: message },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    // 429 covers both rate limiting and an exhausted credit balance; the
    // difference matters to whoever is paying, so it is surfaced, not hidden.
    const exhausted = detail.includes("insufficient_quota");
    return NextResponse.json(
      {
        error: exhausted
          ? "The OpenAI account has no credits remaining, so the tutor is unavailable."
          : `The tutor could not be reached (${response.status}).`,
      },
      { status: 502 }
    );
  }

  const payload = await response.json();
  const answer = payload.choices?.[0]?.message?.content;

  if (typeof answer !== "string" || !answer.trim()) {
    return NextResponse.json({ error: "The tutor returned nothing." }, { status: 502 });
  }

  return NextResponse.json({ answer: answer.trim() });
}
