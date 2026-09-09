-- ============================================================================
-- ForestGuro — Migration 0002: schema cleanup
--
--   1. profiles was never populated — no row was created on sign-up, so the
--      table was empty for every user. A trigger now creates one, and the
--      Settings page reads and writes it instead of showing hardcoded values.
--
--   2. study_sessions had no reader or writer anywhere in the app. Dropped
--      rather than left as schema that reads as implemented. The drop is
--      guarded: it is skipped if the table has any rows.
--
--   3. questions_active_idx was a partial index whose predicate was the column
--      it indexed, on a table where nearly every row qualifies — so it was
--      never usable. The predicate belongs on the other indexes instead.
--
--   4. Question order was welded to the primary key, so reordering or inserting
--      a question meant renaming a key that user_answers references. A
--      sort_order column now carries the ordering.
--
-- Run AFTER 0001_answer_integrity.sql. Safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Create a profile row for every user at sign-up.
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

-- Backfill anyone who signed up before the trigger existed.
insert into public.profiles (id)
select u.id from auth.users u
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- 2. Drop study_sessions, but only if nothing was ever written to it.
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from information_schema.tables
                 where table_schema = 'public' and table_name = 'study_sessions') then
    raise notice 'study_sessions already dropped.';
  elsif exists (select 1 from public.study_sessions limit 1) then
    raise notice 'study_sessions has rows — leaving it in place. Drop it by hand if the data is not needed.';
  else
    drop table public.study_sessions;
    raise notice 'study_sessions dropped (was empty).';
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- 3. Move the is_active predicate onto the indexes that are actually used.
-- ----------------------------------------------------------------------------
drop index if exists public.questions_active_idx;
drop index if exists public.questions_subject_idx;
drop index if exists public.questions_difficulty_idx;

create index if not exists questions_subject_idx
  on public.questions (subject) where is_active;
create index if not exists questions_difficulty_idx
  on public.questions (difficulty) where is_active;

-- ----------------------------------------------------------------------------
-- 4. Give questions an explicit order, independent of the primary key.
--
-- Backfilled in the enum's declaration order then by id, which reproduces the
-- ordering the app had, in gaps of 10 so a question can be slotted between two
-- others without renumbering. New rows take the next value from a sequence —
-- a sequence rather than max()+10 because rows inserted by one statement (the
-- seed file) cannot see each other's values.
-- ----------------------------------------------------------------------------
create sequence if not exists public.questions_sort_order_seq;

alter table public.questions
  add column if not exists sort_order integer;

update public.questions q
set sort_order = ranked.rn * 10
from (
  select id, row_number() over (order by subject, id) as rn
  from public.questions
) ranked
where ranked.id = q.id
  and q.sort_order is null;

select setval(
  'public.questions_sort_order_seq',
  greatest((select coalesce(max(sort_order), 0) / 10 from public.questions), 1)
);

alter table public.questions
  alter column sort_order set default nextval('public.questions_sort_order_seq') * 10;

alter table public.questions
  alter column sort_order set not null;

create index if not exists questions_sort_order_idx
  on public.questions (sort_order) where is_active;
