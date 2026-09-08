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
-- ----------------------------------------------------------------------------
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

create index if not exists questions_subject_idx     on public.questions (subject);
create index if not exists questions_difficulty_idx  on public.questions (difficulty);
create index if not exists questions_active_idx      on public.questions (is_active) where is_active;

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
-- study_sessions
-- ----------------------------------------------------------------------------
create table if not exists public.study_sessions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users (id) on delete cascade,
  started_at          timestamptz not null default now(),
  ended_at            timestamptz,
  questions_completed integer not null default 0,
  correct_answers     integer not null default 0
);

create index if not exists study_sessions_user_idx on public.study_sessions (user_id, started_at desc);

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
-- Row Level Security
-- Questions are readable by any authenticated user; personal data is private.
-- ----------------------------------------------------------------------------
alter table public.questions       enable row level security;
alter table public.profiles        enable row level security;
alter table public.user_answers    enable row level security;
alter table public.study_sessions  enable row level security;

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

drop policy if exists "own sessions" on public.study_sessions;
create policy "own sessions"
  on public.study_sessions for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Convenience view: per-subject accuracy for the calling user
-- ----------------------------------------------------------------------------
create or replace view public.user_subject_accuracy
with (security_invoker = true) as
select
  ua.user_id,
  q.subject,
  count(*)                                              as answered,
  count(*) filter (where ua.is_correct)                 as correct,
  round(
    100.0 * count(*) filter (where ua.is_correct) / nullif(count(*), 0)
  )                                                     as accuracy_pct
from public.user_answers ua
join public.questions q on q.id = ua.question_id
group by ua.user_id, q.subject;
