-- ============================================================================
-- ForestGuro — Database Schema
-- PRC Forester Licensure Examination Reviewer
--
-- Run this FIRST in the Supabase SQL Editor, then run seed_questions.sql.
-- Safe to re-run: all objects use IF NOT EXISTS / CREATE OR REPLACE.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'forestry_subject') then
    create type forestry_subject as enum (
      'Silviculture & Forest Ecology',
      'Forest Resources Management',
      'Forest Engineering & Surveying',
      'Wood Science & Forest Products',
      'Social Forestry & Forest Policy',
      'Forest Biometrics & Mensuration'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'question_difficulty') then
    create type question_difficulty as enum ('Easy', 'Medium', 'Hard');
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- Helper: does the options array contain an option with the given id?
-- A CHECK constraint may not contain a subquery, so the lookup is wrapped in an
-- IMMUTABLE function, which a CHECK constraint is allowed to call.
-- ----------------------------------------------------------------------------
create or replace function public.options_contain_id(options jsonb, answer_id text)
returns boolean
language sql
immutable
strict
as $$
  -- Returns false (rather than raising) when options is not an array, so the
  -- separate array-shape constraint reports the real problem.
  select case
    when jsonb_typeof(options) <> 'array' then false
    else coalesce(
      (select bool_or(opt ->> 'id' = answer_id)
       from jsonb_array_elements(options) as opt),
      false
    )
  end;
$$;

-- ----------------------------------------------------------------------------
-- questions
-- Options are stored as JSONB: [{"id":"a","text":"..."}, ...]
--
-- sort_order carries the display order so it is not welded to the primary key:
-- a question can be reordered or slotted between two others without renaming a
-- key that user_answers references. New rows draw from a sequence rather than
-- max()+10, because rows inserted by one statement (the seed file) cannot see
-- each other's values.
-- ----------------------------------------------------------------------------
create sequence if not exists public.questions_sort_order_seq;

create table if not exists public.questions (
  id                    text primary key,
  subject               forestry_subject not null,
  difficulty            question_difficulty not null default 'Medium',
  question              text not null,
  options               jsonb not null,
  correct_answer_id     text not null,
  explanation           text not null,
  detailed_explanation  text,
  tips                  text,
  is_active             boolean not null default true,
  sort_order            integer not null default nextval('public.questions_sort_order_seq') * 10,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  -- Options must be a 2-6 element array of {id, text} objects.
  constraint questions_options_is_array
    check (jsonb_typeof(options) = 'array'
           and jsonb_array_length(options) between 2 and 6),

  -- The correct answer must actually be one of the offered options.
  constraint questions_correct_answer_in_options
    check (public.options_contain_id(options, correct_answer_id))
);

-- Added here too, so re-running this file over a pre-0002 database picks it up.
alter table public.questions
  add column if not exists sort_order integer not null
  default nextval('public.questions_sort_order_seq') * 10;

-- Every read filters on is_active, so the predicate rides along on the indexes
-- that are actually used. An index on is_active alone was never selectable.
drop index if exists public.questions_active_idx;

create index if not exists questions_subject_idx
  on public.questions (subject) where is_active;
create index if not exists questions_difficulty_idx
  on public.questions (difficulty) where is_active;
create index if not exists questions_sort_order_idx
  on public.questions (sort_order) where is_active;

-- ----------------------------------------------------------------------------
-- profiles — one row per auth user
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  full_name         text,
  target_exam_date  date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- user_answers — every submitted answer, for analytics
-- ----------------------------------------------------------------------------
create table if not exists public.user_answers (
  id                  bigint generated always as identity primary key,
  user_id             uuid not null references auth.users (id) on delete cascade,
  question_id         text not null references public.questions (id) on delete cascade,
  selected_answer_id  text not null,
  is_correct          boolean not null,
  answered_at         timestamptz not null default now()
);

create index if not exists user_answers_user_idx      on public.user_answers (user_id, answered_at desc);
create index if not exists user_answers_question_idx  on public.user_answers (question_id);

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists questions_set_updated_at on public.questions;
create trigger questions_set_updated_at
  before update on public.questions
  for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- A profile for every user at sign-up. Without this the table stays empty no
-- matter how many people register.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- Questions are readable by any authenticated user; personal data is private.
-- ----------------------------------------------------------------------------
alter table public.questions       enable row level security;
alter table public.profiles        enable row level security;
alter table public.user_answers    enable row level security;

drop policy if exists "questions readable by authenticated" on public.questions;
create policy "questions readable by authenticated"
  on public.questions for select
  to authenticated
  using (is_active);

drop policy if exists "own profile" on public.profiles;
create policy "own profile"
  on public.profiles for all
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "own answers" on public.user_answers;
create policy "own answers"
  on public.user_answers for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Answer integrity
--
-- is_correct is derived here rather than trusted from the client, and
-- selected_answer_id is checked against the question's options — the same
-- guarantee questions.correct_answer_id already carries.
--
-- SECURITY DEFINER so correctness never depends on whether the caller's RLS
-- policy happens to make the question row visible; the function returns no
-- question data to the caller, only a verdict on their own answer.
-- ----------------------------------------------------------------------------
create or replace function public.enforce_answer_correctness()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_correct_answer_id text;
  v_options           jsonb;
begin
  select q.correct_answer_id, q.options
    into v_correct_answer_id, v_options
  from public.questions q
  where q.id = new.question_id;

  if v_correct_answer_id is null then
    raise exception 'Question % does not exist', new.question_id
      using errcode = 'foreign_key_violation';
  end if;

  if not coalesce(
       public.options_contain_id(v_options, new.selected_answer_id), false
     ) then
    raise exception 'Answer % is not an option for question %',
      coalesce(new.selected_answer_id, '<null>'), new.question_id
      using errcode = 'check_violation';
  end if;

  new.is_correct := (new.selected_answer_id = v_correct_answer_id);

  -- Stamped here rather than defaulted, so a forged timestamp cannot reorder
  -- which attempt counts as first.
  if tg_op = 'INSERT' then
    new.answered_at := now();
  end if;

  return new;
end;
$$;

drop trigger if exists user_answers_enforce_correctness on public.user_answers;
create trigger user_answers_enforce_correctness
  before insert or update of question_id, selected_answer_id
  on public.user_answers
  for each row execute function public.enforce_answer_correctness();

-- ----------------------------------------------------------------------------
-- Convenience view: per-subject accuracy for the calling user
--
-- Scores each question by its FIRST attempt only. user_answers keeps every
-- attempt, but re-answering a question after reading the explanation must not
-- lift a subject's accuracy — that would hide exactly the weakness the
-- dashboard exists to surface.
--
-- Ordered by id, not answered_at: id is a monotonic identity column, so it is
-- the true insertion order and cannot be spoofed by a client-supplied time.
-- ----------------------------------------------------------------------------
create index if not exists user_answers_first_attempt_idx
  on public.user_answers (user_id, question_id, id);

drop view if exists public.user_subject_accuracy;

create view public.user_subject_accuracy
with (security_invoker = true) as
with first_attempts as (
  select distinct on (ua.user_id, ua.question_id)
    ua.user_id,
    ua.question_id,
    ua.is_correct
  from public.user_answers ua
  order by ua.user_id, ua.question_id, ua.id
)
select
  fa.user_id,
  q.subject,
  count(*)                                              as answered,
  count(*) filter (where fa.is_correct)                 as correct,
  round(
    100.0 * count(*) filter (where fa.is_correct) / nullif(count(*), 0)
  )                                                     as accuracy_pct
from first_attempts fa
join public.questions q on q.id = fa.question_id
group by fa.user_id, q.subject;

-- ============================================================================
-- Mock exams
--
-- Exam definitions live in a table rather than app code, so the browser cannot
-- ask start_exam_attempt() for a shorter paper or a longer clock. Scoring is
-- server-side for the same reason, and the runner is never sent the key.
--
-- An exam serves least(target_questions, what the bank holds), so a paper
-- shortens itself rather than failing while the bank is still growing.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- exams — one row per mock paper
-- ----------------------------------------------------------------------------
create table if not exists public.exams (
  id                    text primary key,
  name                  text not null,
  description           text,
  subjects              forestry_subject[] not null,
  target_questions      integer not null,
  seconds_per_question  integer not null,
  passing_pct           integer not null default 80,
  sort_order            integer not null default 0,
  is_active             boolean not null default true,

  constraint exams_subjects_not_empty check (cardinality(subjects) > 0),
  constraint exams_target_positive    check (target_questions > 0),
  constraint exams_seconds_positive   check (seconds_per_question > 0),
  constraint exams_passing_pct_range  check (passing_pct between 1 and 100)
);

-- The two papers the page already advertised. seconds_per_question preserves
-- the advertised pace (170 questions in 3h10m is about 67s each), so a
-- shortened exam is shortened in time too rather than handing out a slow clock.
insert into public.exams
  (id, name, description, subjects, target_questions, seconds_per_question, passing_pct, sort_order)
values
  ('day-1', 'Full Board Simulation — Day 1',
   'Covers Silviculture & Forest Ecology, Forest Resources Management, and Forest Biometrics & Mensuration.',
   array[
     'Silviculture & Forest Ecology',
     'Forest Resources Management',
     'Forest Biometrics & Mensuration'
   ]::forestry_subject[],
   170, 67, 80, 1),
  ('day-2', 'Full Board Simulation — Day 2',
   'Covers Forest Engineering & Surveying, Wood Science & Forest Products, and Social Forestry & Forest Policy.',
   array[
     'Forest Engineering & Surveying',
     'Wood Science & Forest Products',
     'Social Forestry & Forest Policy'
   ]::forestry_subject[],
   165, 67, 80, 2)
on conflict (id) do update set
  name                 = excluded.name,
  description          = excluded.description,
  subjects             = excluded.subjects,
  target_questions     = excluded.target_questions,
  seconds_per_question = excluded.seconds_per_question,
  passing_pct          = excluded.passing_pct,
  sort_order           = excluded.sort_order;

-- ----------------------------------------------------------------------------
-- exam_attempts — one sitting. question_ids freezes the paper at start time, so
-- a reload cannot reshuffle it into an easier one.
-- ----------------------------------------------------------------------------
create table if not exists public.exam_attempts (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  exam_id       text not null references public.exams (id) on delete cascade,
  question_ids  text[] not null,
  total         integer not null,
  passing_pct   integer not null,
  started_at    timestamptz not null default now(),
  expires_at    timestamptz not null,
  submitted_at  timestamptz,
  score         integer,

  constraint exam_attempts_has_questions check (cardinality(question_ids) > 0),
  constraint exam_attempts_total_matches check (total = cardinality(question_ids)),
  constraint exam_attempts_score_range   check (score is null or score between 0 and total)
);

create index if not exists exam_attempts_user_idx
  on public.exam_attempts (user_id, started_at desc);

-- ----------------------------------------------------------------------------
-- exam_answers — one row per answered question. The primary key lets a
-- candidate change their mind: answering again upserts rather than stacking.
-- ----------------------------------------------------------------------------
create table if not exists public.exam_answers (
  attempt_id          uuid not null references public.exam_attempts (id) on delete cascade,
  question_id         text not null references public.questions (id) on delete cascade,
  selected_answer_id  text not null,
  is_correct          boolean not null,
  answered_at         timestamptz not null default now(),

  primary key (attempt_id, question_id)
);

-- ----------------------------------------------------------------------------
-- Answer validation and scoring, all server-side.
-- ----------------------------------------------------------------------------
create or replace function public.enforce_exam_answer()
returns trigger
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_attempt           public.exam_attempts;
  v_correct_answer_id text;
  v_options           jsonb;
begin
  select * into v_attempt
  from public.exam_attempts
  where id = new.attempt_id;

  if v_attempt.id is null then
    raise exception 'Exam attempt % does not exist', new.attempt_id
      using errcode = 'foreign_key_violation';
  end if;

  if v_attempt.user_id <> auth.uid() then
    raise exception 'That exam attempt belongs to someone else'
      using errcode = 'insufficient_privilege';
  end if;

  if v_attempt.submitted_at is not null then
    raise exception 'This exam has already been submitted'
      using errcode = 'check_violation';
  end if;

  -- A small grace window, so an answer sent as the clock runs out is not lost
  -- to network latency. submit_exam_attempt is what finalises the score.
  if now() > v_attempt.expires_at + interval '10 seconds' then
    raise exception 'Time is up for this exam'
      using errcode = 'check_violation';
  end if;

  if not (new.question_id = any(v_attempt.question_ids)) then
    raise exception 'Question % is not part of this exam', new.question_id
      using errcode = 'check_violation';
  end if;

  select q.correct_answer_id, q.options
    into v_correct_answer_id, v_options
  from public.questions q
  where q.id = new.question_id;

  if not coalesce(
       public.options_contain_id(v_options, new.selected_answer_id), false
     ) then
    raise exception 'Answer % is not an option for question %',
      coalesce(new.selected_answer_id, '(null)'), new.question_id
      using errcode = 'check_violation';
  end if;

  new.is_correct  := (new.selected_answer_id = v_correct_answer_id);
  new.answered_at := now();

  return new;
end;
$fn$;

drop trigger if exists exam_answers_enforce on public.exam_answers;
create trigger exam_answers_enforce
  before insert or update on public.exam_answers
  for each row execute function public.enforce_exam_answer();

-- ----------------------------------------------------------------------------
-- start_exam_attempt — takes only an exam id, so size and duration cannot be
-- chosen by the caller.
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

  -- Pick at random, then keep that order as the paper's order.
  with picked as (
    select q.id as question_id, row_number() over () as rn
    from public.questions q
    where q.is_active
      and q.subject = any(v_exam.subjects)
    order by random()
    limit v_exam.target_questions
  )
  select array_agg(picked.question_id order by picked.rn)
    into v_ids
  from picked;

  v_count := coalesce(cardinality(v_ids), 0);

  if v_count = 0 then
    raise exception 'No active questions available for exam %', p_exam_id
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
-- submit_exam_attempt — idempotent, so a double-click, or an auto-submit racing
-- the candidate's own click, cannot rescore a finished paper.
-- ----------------------------------------------------------------------------
create or replace function public.submit_exam_attempt(p_attempt_id uuid)
returns public.exam_attempts
language plpgsql
security definer
set search_path = ''
as $fn$
declare
  v_attempt public.exam_attempts;
begin
  select * into v_attempt
  from public.exam_attempts
  where id = p_attempt_id;

  if v_attempt.id is null then
    raise exception 'Exam attempt % does not exist', p_attempt_id
      using errcode = 'foreign_key_violation';
  end if;

  if v_attempt.user_id <> auth.uid() then
    raise exception 'That exam attempt belongs to someone else'
      using errcode = 'insufficient_privilege';
  end if;

  if v_attempt.submitted_at is not null then
    return v_attempt;
  end if;

  update public.exam_attempts a
  set submitted_at = now(),
      score = (
        select count(*)
        from public.exam_answers ea
        where ea.attempt_id = a.id and ea.is_correct
      )
  where a.id = p_attempt_id
  returning * into v_attempt;

  return v_attempt;
end;
$fn$;

-- ----------------------------------------------------------------------------
-- Row Level Security
--
-- exam_attempts is readable but not writable by the candidate: both writes go
-- through the definer functions above, so score and expires_at cannot be edited
-- from the browser.
-- ----------------------------------------------------------------------------
alter table public.exams          enable row level security;
alter table public.exam_attempts  enable row level security;
alter table public.exam_answers   enable row level security;

drop policy if exists "exams readable by authenticated" on public.exams;
create policy "exams readable by authenticated"
  on public.exams for select
  to authenticated
  using (is_active);

drop policy if exists "own attempts readable" on public.exam_attempts;
create policy "own attempts readable"
  on public.exam_attempts for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "own exam answers" on public.exam_answers;
create policy "own exam answers"
  on public.exam_answers for all
  to authenticated
  using (
    exists (select 1 from public.exam_attempts a
            where a.id = attempt_id and a.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.exam_attempts a
            where a.id = attempt_id and a.user_id = auth.uid())
  );

-- ----------------------------------------------------------------------------
-- exam_catalog — what the listing page reads. question_count is what the bank
-- can actually serve right now, not the aspirational target.
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
     where q.is_active and q.subject = any(e.subjects))
  )::integer as question_count,
  least(
    e.target_questions,
    (select count(*) from public.questions q
     where q.is_active and q.subject = any(e.subjects))
  )::integer * e.seconds_per_question as duration_seconds
from public.exams e
where e.is_active;
