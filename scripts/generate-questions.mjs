#!/usr/bin/env node
/**
 * Generate the bulk of the question bank with OpenAI and emit SQL.
 *
 * The hand-authored 180 in supabase/migrations/0005_core_questions.sql are the
 * verified backbone; this fills the rest of the 2000 practice / 3000 mock
 * target. Nothing is written to the database — the script emits .sql files you
 * review and run yourself.
 *
 * Every generated question is validated before it is accepted:
 *   - exactly 4 options, ids a-d, no blank or duplicate option text
 *   - correct_answer_id must name one of those options
 *   - the stem must not duplicate anything already in the bank or this run
 *   - the answer key is rebalanced at the end so it is not guessable
 *
 * Usage:
 *   node scripts/generate-questions.mjs                  # generate the deficit
 *   node scripts/generate-questions.mjs --limit 50       # small trial run
 *   node scripts/generate-questions.mjs --dry-run        # plan only, no API calls
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY.
 * Reads .env.local automatically.
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

/**
 * The four papers of the PRC Forester Licensure Examination and the topics the
 * Professional Regulatory Board programme lists under each. Generation targets
 * TOPICS, not subjects: aiming at "Forest Ecosystem" as a whole produces piles
 * of ecology and nothing on entomology or pathology.
 *
 * Keep in step with supabase/migrations/0006_board_structure.sql.
 */
const SUBJECTS = [
  {
    id: "forest-ecosystem",
    code: "fe",
    name: "Forest Ecosystem",
    topics: [
      ["forest-botany", "Forest Botany"],
      ["dendrology", "Dendrology"],
      ["forest-ecology", "Forest Ecology"],
      ["forest-soils", "Forest Soils"],
      ["tree-physiology", "Tree Physiology"],
      ["forest-entomology", "Forest Entomology"],
      ["forest-pathology", "Forest Pathology"],
      ["forest-biodiversity", "Forest Biodiversity"],
      ["forest-genetics-tree-improvement", "Forest Genetics and Tree Improvement"],
    ],
  },
  {
    id: "forest-governance",
    code: "fg",
    name: "Forest Governance and Social Forestry",
    topics: [
      ["forest-history", "Forest History"],
      ["policy-and-administration", "Policy and Administration"],
      ["social-forestry-extension", "Social Forestry and Extension"],
      ["forest-protection", "Forest Protection"],
      ["environment-sustainable-development", "Environment and Sustainable Development"],
      ["professional-ethics", "Professional Ethics and Values"],
    ],
  },
  {
    id: "forest-utilization",
    code: "fu",
    name: "Forest Utilization Engineering",
    topics: [
      ["wood-structure-identification", "Wood Structure and Identification"],
      ["wood-physics-mechanics", "Wood Physics and Mechanics"],
      ["wood-seasoning-preservation", "Wood Seasoning and Preservation"],
      ["forest-products-utilization", "Forest Products Utilization"],
      ["non-timber-forest-products", "Utilization of Non-Timber Forest Products"],
    ],
  },
  {
    id: "forest-production",
    code: "fp",
    name: "Forest Production Management",
    topics: [
      ["forest-biometry-mensuration-inventory", "Forest Biometry, Mensuration and Inventory"],
      ["forest-management", "Forest Management"],
      ["forest-economics-finance", "Forest Economics and Finance"],
      ["range-management", "Range Management"],
      ["multiple-use-forestry", "Multiple Uses Forestry"],
      ["silvicultural-methods-systems", "Silvicultural Methods and Systems"],
      ["forest-nursery", "Forest Nursery"],
      ["forest-plantation", "Forest Plantation"],
      // forest-engineering-surveying is deliberately absent: it is not on the
      // 2026 programme, so nothing new should be generated into it.
    ],
  },
];

/** Roughly the shape of a real board paper rather than an even split. */
const DIFFICULTY_MIX = { Easy: 0.3, Medium: 0.45, Hard: 0.25 };

const POOL_TARGETS = { practice: 2000, mock: 3000 };

/** Questions requested per API call. Large enough to be cheap, small enough
 *  that one bad response does not waste much. */
const BATCH_SIZE = 10;

/** Generated questions per emitted .sql file, to keep each one pasteable. */
const ROWS_PER_FILE = 500;

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const OUT_DIR = path.join(process.cwd(), "supabase", "generated");

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

function loadEnvLocal() {
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;

  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}. Set it in .env.local or the environment.`);
    process.exit(1);
  }
  return value;
}

// ---------------------------------------------------------------------------
// Supabase (REST, so the script needs no dependencies)
// ---------------------------------------------------------------------------

async function supabaseSelect(url, key, pathAndQuery) {
  const response = await fetch(`${url}/rest/v1/${pathAndQuery}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });

  if (!response.ok) {
    throw new Error(
      `Supabase read failed (${response.status}): ${await response.text()}`
    );
  }

  return response.json();
}

/** Pull every existing stem so generated questions can be deduplicated. */
async function fetchExistingQuestions(url, key) {
  const rows = [];
  const pageSize = 1000;

  for (let offset = 0; ; offset += pageSize) {
    const page = await supabaseSelect(
      url,
      key,
      `questions?select=id,question,pool,subject_id,topic_id,difficulty` +
        `&limit=${pageSize}&offset=${offset}`
    );
    rows.push(...page);
    if (page.length < pageSize) break;
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Planning
// ---------------------------------------------------------------------------

function normaliseStem(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Whole-number split of `total` into `parts`, remainder to the earliest parts. */
function share(total, parts) {
  const base = Math.floor(total / parts);
  const extra = total % parts;
  return Array.from({ length: parts }, (_, i) => base + (i < extra ? 1 : 0));
}

/** How many of each (pool, topic, difficulty) are still missing. */
function buildPlan(existing) {
  const have = new Map();
  for (const row of existing) {
    const key = `${row.pool}|${row.topic_id}|${row.difficulty}`;
    have.set(key, (have.get(key) ?? 0) + 1);
  }

  const plan = [];

  for (const [pool, poolTarget] of Object.entries(POOL_TARGETS)) {
    // Pool -> the four papers -> each paper's topics -> difficulty, splitting
    // as whole questions at every step so the totals add back exactly.
    const perSubject = share(poolTarget, SUBJECTS.length);

    SUBJECTS.forEach((subject, si) => {
      const perTopic = share(perSubject[si], subject.topics.length);

      subject.topics.forEach(([topicId, topicName], ti) => {
        const topicTotal = perTopic[ti];
        const easy = Math.round(topicTotal * DIFFICULTY_MIX.Easy);
        const hard = Math.round(topicTotal * DIFFICULTY_MIX.Hard);
        const byDifficulty = {
          Easy: easy,
          Medium: topicTotal - easy - hard,
          Hard: hard,
        };

        for (const [difficulty, target] of Object.entries(byDifficulty)) {
          const key = `${pool}|${topicId}|${difficulty}`;
          const deficit = target - (have.get(key) ?? 0);
          if (deficit > 0) {
            plan.push({
              pool,
              difficulty,
              count: deficit,
              subjectId: subject.id,
              subjectName: subject.name,
              code: subject.code,
              topicId,
              topicName,
            });
          }
        }
      });
    });
  }

  return plan;
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["questions"],
  properties: {
    questions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["question", "options", "correct_answer_id"],
        properties: {
          question: { type: "string" },
          options: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["id", "text"],
              properties: {
                id: { type: "string", enum: ["a", "b", "c", "d"] },
                text: { type: "string" },
              },
            },
          },
          correct_answer_id: { type: "string", enum: ["a", "b", "c", "d"] },
        },
      },
    },
  },
};

function buildPrompt({ subjectName, topicName, difficulty, count, avoidStems }) {
  const avoid = avoidStems.slice(0, 40);

  return [
    {
      role: "system",
      content: [
        "You write multiple-choice items for the Philippine Forester Licensure Examination administered by the PRC.",
        "Every item must be factually correct and answerable from established forestry science or Philippine forestry law.",
        "Use Philippine context where relevant: PD 705, RA 7586 (NIPAS), RA 11038, RA 8371 (IPRA), RA 9147, CBFMA, DENR, dipterocarps, mangroves, Benguet pine.",
        "For Dendrology, examiners ask for common name, scientific name and family together, so write items that pair them (for example Narra / Pterocarpus indicus / Fabaceae).",
        "Use SI units. Numeric items must be arithmetically correct and solvable from the numbers given in the stem.",
        "Exactly four options, ids a, b, c and d. Distractors must be plausible and mutually exclusive, never 'all of the above' or 'none of the above'.",
        "Do not write an explanation. Do not repeat a stem you have been told to avoid.",
      ].join(" "),
    },
    {
      role: "user",
      content: [
        `Board paper: ${subjectName}.`,
        `Topic: ${topicName}. Every question must sit squarely inside this topic.`,
        `Write ${count} ${difficulty.toUpperCase()} multiple-choice questions.`,
        "",
        difficulty === "Easy"
          ? "Easy: direct recall of a definition, a statute name, or a single standard fact."
          : difficulty === "Medium"
            ? "Medium: one-step application, a single calculation, or distinguishing two related concepts."
            : "Hard: multi-step reasoning, a non-trivial computation, or a fine distinction between closely related provisions or processes.",
        "",
        avoid.length
          ? `Do not duplicate these existing stems:\n${avoid.map((s) => `- ${s}`).join("\n")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    },
  ];
}

async function callOpenAI(apiKey, messages) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.8,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "question_batch",
          strict: true,
          schema: RESPONSE_SCHEMA,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `OpenAI request failed (${response.status}): ${await response.text()}`
    );
  }

  const body = await response.json();
  return JSON.parse(body.choices[0].message.content);
}

/**
 * Reject anything malformed rather than letting it reach the database, where
 * the CHECK constraints would fail the whole insert.
 */
function validate(item, seenStems) {
  if (typeof item.question !== "string" || item.question.trim().length < 15) {
    return "stem too short";
  }
  if (!Array.isArray(item.options) || item.options.length !== 4) {
    return "not exactly 4 options";
  }

  const ids = item.options.map((o) => o.id);
  if (ids.join("") !== "abcd") return "option ids are not a,b,c,d in order";

  const texts = item.options.map((o) => (o.text ?? "").trim());
  if (texts.some((t) => t.length === 0)) return "blank option text";
  if (new Set(texts).size !== 4) return "duplicate option text";
  if (texts.some((t) => /^(all|none) of the above/i.test(t))) {
    return "all/none of the above";
  }
  if (!ids.includes(item.correct_answer_id)) return "key not among options";

  const stem = normaliseStem(item.question);
  if (seenStems.has(stem)) return "duplicate stem";

  return null;
}

// ---------------------------------------------------------------------------
// SQL emission
// ---------------------------------------------------------------------------

const sqlString = (value) => `'${String(value).replace(/'/g, "''")}'`;

function toSqlRow(row) {
  const options = JSON.stringify(
    row.options.map((o) => ({ id: o.id, text: o.text.trim() }))
  );

  return `  (${sqlString(row.id)}, ${sqlString(row.subjectId)}, ${sqlString(row.topicId)}, ${sqlString(row.difficulty)}, ${sqlString(row.pool)},
   ${sqlString(row.question.trim())},
   ${sqlString(options)}::jsonb, ${sqlString(row.correct_answer_id)})`;
}

function writeSqlFiles(rows) {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = [];

  for (let i = 0; i < rows.length; i += ROWS_PER_FILE) {
    const chunk = rows.slice(i, i + ROWS_PER_FILE);
    const index = String(i / ROWS_PER_FILE + 1).padStart(3, "0");
    const file = path.join(OUT_DIR, `generated_questions_${index}.sql`);

    const sql = `-- ForestGuro — generated questions (batch ${index})
--
-- Produced by scripts/generate-questions.mjs using ${MODEL}.
-- Explanations are intentionally absent: they are generated on first answer.
--
-- These questions were written by a language model and validated for shape,
-- not for factual accuracy. Review before relying on them for scored exams.

insert into public.questions
  (id, subject_id, topic_id, difficulty, pool, question, options, correct_answer_id)
values
${chunk.map(toSqlRow).join(",\n")}
on conflict (id) do nothing;
`;

    fs.writeFileSync(file, sql, "utf8");
    files.push({ file, rows: chunk.length });
  }

  return files;
}

/** Spread the key across a, b, c and d so the bank is not guessable. */
function rebalanceKeys(rows) {
  const targets = [];
  for (let i = 0; i < rows.length; i += 1) targets.push("abcd"[i % 4]);

  // Deterministic shuffle, so re-running with the same input is reproducible.
  let seed = 20260909;
  const next = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let i = targets.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [targets[i], targets[j]] = [targets[j], targets[i]];
  }

  rows.forEach((row, i) => {
    const correct = row.options.find((o) => o.id === row.correct_answer_id);
    const others = row.options.filter((o) => o.id !== row.correct_answer_id);
    const position = "abcd".indexOf(targets[i]);
    const ordered = [...others.slice(0, position), correct, ...others.slice(position)];

    row.options = ordered.map((o, j) => ({ id: "abcd"[j], text: o.text }));
    row.correct_answer_id = targets[i];
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  loadEnvLocal();

  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const limitArg = args.indexOf("--limit");
  const limit = limitArg >= 0 ? Number(args[limitArg + 1]) : Infinity;

  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  console.log("Reading existing bank…");
  const existing = await fetchExistingQuestions(supabaseUrl, serviceKey);
  console.log(`  ${existing.length} questions already in the bank`);

  const plan = buildPlan(existing);
  const totalPlanned = Math.min(
    plan.reduce((sum, p) => sum + p.count, 0),
    limit
  );

  console.log(`\nPlan: generate ${totalPlanned} questions`);
  for (const p of plan) {
    console.log(`  ${p.pool.padEnd(8)} ${p.difficulty.padEnd(6)} ${String(p.count).padStart(4)}  ${p.topicName}`);
  }

  if (dryRun) {
    console.log("\n--dry-run: stopping before any API calls.");
    return;
  }
  if (totalPlanned === 0) {
    console.log("\nNothing to generate — the bank already meets its targets.");
    return;
  }

  const openaiKey = requireEnv("OPENAI_API_KEY");

  const seenStems = new Set(existing.map((r) => normaliseStem(r.question)));
  // Keyed by topic: the avoid-list is only useful if it shows the model the
  // stems it is most likely to duplicate, which are the ones in the same topic.
  const stemsByTopic = new Map();
  for (const row of existing) {
    if (!stemsByTopic.has(row.topic_id)) stemsByTopic.set(row.topic_id, []);
    stemsByTopic.get(row.topic_id).push(row.question);
  }

  const accepted = [];
  const counters = new Map();
  let rejected = 0;

  outer: for (const task of plan) {
    let remaining = task.count;

    while (remaining > 0) {
      if (accepted.length >= limit) break outer;

      const batch = Math.min(BATCH_SIZE, remaining, limit - accepted.length);
      const avoidStems = (stemsByTopic.get(task.topicId) ?? []).slice(-40);

      let result;
      try {
        result = await callOpenAI(
          openaiKey,
          buildPrompt({ ...task, count: batch, avoidStems })
        );
      } catch (error) {
        console.error(`  ! ${error.message}`);
        console.error("  ! aborting; partial output will still be written");
        break outer;
      }

      for (const item of result.questions ?? []) {
        const problem = validate(item, seenStems);
        if (problem) {
          rejected += 1;
          continue;
        }

        const code = task.code;
        const n = (counters.get(code) ?? 0) + 1;
        counters.set(code, n);

        seenStems.add(normaliseStem(item.question));
        if (!stemsByTopic.has(task.topicId)) stemsByTopic.set(task.topicId, []);
        stemsByTopic.get(task.topicId).push(item.question);

        accepted.push({
          id: `${code}-g${String(n).padStart(5, "0")}`,
          subjectId: task.subjectId,
          topicId: task.topicId,
          difficulty: task.difficulty,
          pool: task.pool,
          question: item.question,
          options: item.options,
          correct_answer_id: item.correct_answer_id,
        });

        remaining -= 1;
        if (remaining <= 0) break;
      }

      process.stdout.write(
        `\r  accepted ${accepted.length}/${totalPlanned}, rejected ${rejected}   `
      );
    }
  }

  console.log("\n");

  if (accepted.length === 0) {
    console.log("No questions were accepted. Nothing written.");
    return;
  }

  rebalanceKeys(accepted);
  const files = writeSqlFiles(accepted);

  console.log(`Accepted ${accepted.length}, rejected ${rejected}.`);
  console.log("Wrote:");
  for (const { file, rows } of files) {
    console.log(`  ${path.relative(process.cwd(), file)}  (${rows} questions)`);
  }
  console.log("\nReview these, then run them in the Supabase SQL Editor.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
