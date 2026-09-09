-- ============================================================================
-- ForestGuro — Migration 0001: answer integrity
--
-- Fixes two defects in how user_answers is recorded and aggregated:
--
--   1. Accuracy counted every attempt. Re-answering a question after reading
--      the explanation inflated a subject's score without anything being
--      learned. The view now scores each question by its FIRST attempt only,
--      while user_answers keeps the full attempt history.
--
--   2. is_correct arrived from the browser and was never verified, and
--      selected_answer_id was unconstrained (unlike questions.correct_answer_id,
--      which is checked against the options array). Both are now enforced
--      server-side by a trigger.
--
-- Run AFTER schema.sql. Safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Derive is_correct server-side and validate the submitted option.
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

  -- Mirrors the constraint questions.correct_answer_id already carries, so an
  -- answer can never reference an option the question does not offer.
  if not coalesce(
       public.options_contain_id(v_options, new.selected_answer_id), false
     ) then
    raise exception 'Answer % is not an option for question %',
      coalesce(new.selected_answer_id, '<null>'), new.question_id
      using errcode = 'check_violation';
  end if;

  -- The client's opinion of its own score is ignored, not trusted.
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
-- 2. Repair rows written before the trigger existed.
-- ----------------------------------------------------------------------------
update public.user_answers ua
set is_correct = (ua.selected_answer_id = q.correct_answer_id)
from public.questions q
where q.id = ua.question_id
  and ua.is_correct is distinct from (ua.selected_answer_id = q.correct_answer_id);

-- ----------------------------------------------------------------------------
-- 3. Score first attempts only.
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
