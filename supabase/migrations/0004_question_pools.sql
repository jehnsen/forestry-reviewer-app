-- ============================================================================
-- ForestGuro — Migration 0004: question pools and deferred explanations
--
-- Two changes to the question bank:
--
--   1. pool splits the bank into the practice set and the mock-exam set, so a
--      candidate cannot rehearse the exact paper they will later sit. Practice
--      reads pool = 'practice'; start_exam_attempt() draws only 'mock'.
--
--   2. explanation becomes nullable. New questions land with it blank and the
--      first user to answer one triggers a single OpenAI call, whose result is
--      written back to the row and served from there forever after.
--      explanation_generated_at and explanation_model record that provenance,
--      so a hand-written explanation stays distinguishable from a generated one.
--
-- Run AFTER 0003_mock_exams.sql. Safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Pool enum
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'question_pool') then
    create type question_pool as enum ('practice', 'mock');
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- questions: pool + deferred explanation columns
--
-- The default is 'practice' so the 60 questions already in the bank stay
-- exactly where users expect them.
-- ----------------------------------------------------------------------------
alter table public.questions
  add column if not exists pool question_pool not null default 'practice';

alter table public.questions
  alter column explanation drop not null;

alter table public.questions
  add column if not exists explanation_generated_at timestamptz;

alter table public.questions
  add column if not exists explanation_model text;

-- Generated text must carry its provenance, and provenance must not be claimed
-- for text that is not there. Hand-written explanations leave both columns null.
alter table public.questions
  drop constraint if exists questions_explanation_provenance;

alter table public.questions
  add constraint questions_explanation_provenance
  check (
    (explanation_generated_at is null and explanation_model is null)
    or (explanation_generated_at is not null
        and explanation_model is not null
        and explanation is not null)
  );

-- Selection always filters pool + subject + difficulty together.
create index if not exists questions_pool_subject_idx
  on public.questions (pool, subject, difficulty) where is_active;

-- Lets the generator and any backfill find unexplained rows cheaply.
create index if not exists questions_needs_explanation_idx
  on public.questions (id) where explanation is null;

-- ----------------------------------------------------------------------------
-- Mock exams draw from the mock pool only.
-- ----------------------------------------------------------------------------
create or replace function public.start_exam_attempt(p_exam_id text)
returns public.exam_attempts
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_exam    public.exams;
  v_user_id uuid := auth.uid();
  v_ids     text[];
  v_count   integer;
  v_attempt public.exam_attempts;
begin
  if v_user_id is null then
    raise exception 'You must be signed in to start an exam'
      using errcode = 'insufficient_privilege';
  end if;

  select * into v_exam from public.exams where id = p_exam_id and is_active;

  if v_exam.id is null then
    raise exception 'Exam % does not exist', p_exam_id
      using errcode = 'foreign_key_violation';
  end if;

  with picked as (
    select q.id as question_id, row_number() over () as rn
    from public.questions q
    where q.is_active
      and q.pool = 'mock'
      and q.subject = any(v_exam.subjects)
    order by random()
    limit v_exam.target_questions
  )
  select array_agg(picked.question_id order by picked.rn)
    into v_ids
  from picked;

  v_count := coalesce(cardinality(v_ids), 0);

  if v_count = 0 then
    raise exception 'No mock-pool questions available for exam %', p_exam_id
      using errcode = 'check_violation';
  end if;

  insert into public.exam_attempts
    (user_id, exam_id, question_ids, total, passing_pct, expires_at)
  values
    (v_user_id, p_exam_id, v_ids, v_count, v_exam.passing_pct,
     now() + (v_count * v_exam.seconds_per_question) * interval '1 second')
  returning * into v_attempt;

  return v_attempt;
end;
$fn$;

-- ----------------------------------------------------------------------------
-- exam_catalog counts the mock pool, not the whole bank.
-- ----------------------------------------------------------------------------
create or replace view public.exam_catalog
with (security_invoker = true) as
select
  e.id,
  e.name,
  e.description,
  e.subjects,
  e.target_questions,
  e.passing_pct,
  e.sort_order,
  least(
    e.target_questions,
    (select count(*) from public.questions q
     where q.is_active and q.pool = 'mock' and q.subject = any(e.subjects))
  )::integer as question_count,
  least(
    e.target_questions,
    (select count(*) from public.questions q
     where q.is_active and q.pool = 'mock' and q.subject = any(e.subjects))
  )::integer * e.seconds_per_question as duration_seconds
from public.exams e
where e.is_active;

-- ----------------------------------------------------------------------------
-- bank_coverage — what the generator reads to know what is still missing.
-- Readable by any authenticated user; it exposes counts, never content.
-- ----------------------------------------------------------------------------
create or replace view public.bank_coverage
with (security_invoker = true) as
select
  q.pool,
  q.subject,
  q.difficulty,
  count(*)                                          as questions,
  count(*) filter (where q.explanation is null)     as awaiting_explanation
from public.questions q
where q.is_active
group by q.pool, q.subject, q.difficulty;
