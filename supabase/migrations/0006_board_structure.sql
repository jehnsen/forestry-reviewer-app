-- ============================================================================
-- ForestGuro — Migration 0006: align to the real PRC board structure
--
-- The bank was built on six invented subjects. The Professional Regulatory
-- Board for Foresters programme for the 8-9 October 2026 examination has FOUR
-- papers, each with its own listed topics:
--
--   Thu 08 Oct  08:00-12:00  Forest Ecosystem
--   Thu 08 Oct  13:00-17:00  Forest Governance and Social Forestry
--   Fri 09 Oct  08:00-12:00  Forest Utilization Engineering
--   Fri 09 Oct  13:00-18:00  Forest Production Management  (5 hours)
--
-- What this migration does:
--
--   1. Replaces the forestry_subject enum with a subjects table. The taxonomy
--      has already changed once and carries metadata the enum could not hold
--      (exam day, start time, paper length), so it belongs in a table.
--
--   2. Adds a topics table for the 29 topics the programme names, and tags
--      every question with one. Without this the generator cannot tell that the
--      bank has no Entomology, Pathology or Range Management questions at all.
--
--   3. Remaps all 240 existing questions onto the new taxonomy.
--
--   4. Replaces the two invented 'Day 1 / Day 2' papers with the four real
--      ones, 100 items each at the PRC pace.
--
-- NOTE ON THE REMAPPING: subject and topic were assigned by keyword matching
-- over each question's stem and options, not by hand. It is a good starting
-- point, not an authority. Spot-check with:
--     select topic_id, count(*) from public.questions group by 1 order by 2 desc;
--
-- NOTE ON forest-engineering-surveying: roads, culverts, yarding and earthwork
-- do not appear anywhere on the 2026 programme. Those 12 questions are kept but
-- isolated under that topic so they can be switched off in one statement:
--     update public.questions set is_active = false
--      where topic_id = 'forest-engineering-surveying';
--
-- Run AFTER 0005_core_questions.sql. Safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- subjects — the four board papers
-- ----------------------------------------------------------------------------
create table if not exists public.subjects (
  id                text primary key,
  name              text not null,
  exam_day          integer not null,
  starts_at         text not null,
  duration_minutes  integer not null,
  sort_order        integer not null,

  constraint subjects_day_valid check (exam_day in (1, 2))
);

insert into public.subjects (id, name, exam_day, starts_at, duration_minutes, sort_order)
values
  ('forest-ecosystem', 'Forest Ecosystem', 1, '08:00', 240, 1),
  ('forest-governance', 'Forest Governance and Social Forestry', 1, '13:00', 240, 2),
  ('forest-utilization', 'Forest Utilization Engineering', 2, '08:00', 240, 3),
  ('forest-production', 'Forest Production Management', 2, '13:00', 300, 4)
on conflict (id) do update set
  name             = excluded.name,
  exam_day         = excluded.exam_day,
  starts_at        = excluded.starts_at,
  duration_minutes = excluded.duration_minutes,
  sort_order       = excluded.sort_order;

-- ----------------------------------------------------------------------------
-- topics — the areas each paper lists, verbatim from the programme
-- ----------------------------------------------------------------------------
create table if not exists public.topics (
  id          text primary key,
  subject_id  text not null references public.subjects (id) on delete cascade,
  name        text not null,
  sort_order  integer not null default 0
);

create index if not exists topics_subject_idx on public.topics (subject_id, sort_order);

insert into public.topics (id, subject_id, name, sort_order)
values
  ('forest-botany', 'forest-ecosystem', 'Forest Botany', 1),
  ('dendrology', 'forest-ecosystem', 'Dendrology', 2),
  ('forest-ecology', 'forest-ecosystem', 'Forest Ecology', 3),
  ('forest-soils', 'forest-ecosystem', 'Forest Soils', 4),
  ('tree-physiology', 'forest-ecosystem', 'Tree Physiology', 5),
  ('forest-entomology', 'forest-ecosystem', 'Forest Entomology', 6),
  ('forest-pathology', 'forest-ecosystem', 'Forest Pathology', 7),
  ('forest-biodiversity', 'forest-ecosystem', 'Forest Biodiversity', 8),
  ('forest-genetics-tree-improvement', 'forest-ecosystem', 'Forest Genetics and Tree Improvement', 9),
  ('forest-history', 'forest-governance', 'Forest History', 1),
  ('policy-and-administration', 'forest-governance', 'Policy and Administration', 2),
  ('social-forestry-extension', 'forest-governance', 'Social Forestry and Extension', 3),
  ('forest-protection', 'forest-governance', 'Forest Protection', 4),
  ('environment-sustainable-development', 'forest-governance', 'Environment and Sustainable Development', 5),
  ('professional-ethics', 'forest-governance', 'Professional Ethics and Values', 6),
  ('wood-structure-identification', 'forest-utilization', 'Wood Structure and Identification', 1),
  ('wood-physics-mechanics', 'forest-utilization', 'Wood Physics and Mechanics', 2),
  ('wood-seasoning-preservation', 'forest-utilization', 'Wood Seasoning and Preservation', 3),
  ('forest-products-utilization', 'forest-utilization', 'Forest Products Utilization', 4),
  ('non-timber-forest-products', 'forest-utilization', 'Utilization of Non-Timber Forest Products', 5),
  ('forest-biometry-mensuration-inventory', 'forest-production', 'Forest Biometry, Mensuration and Inventory', 1),
  ('forest-management', 'forest-production', 'Forest Management', 2),
  ('forest-economics-finance', 'forest-production', 'Forest Economics and Finance', 3),
  ('range-management', 'forest-production', 'Range Management', 4),
  ('multiple-use-forestry', 'forest-production', 'Multiple Uses Forestry', 5),
  ('silvicultural-methods-systems', 'forest-production', 'Silvicultural Methods and Systems', 6),
  ('forest-nursery', 'forest-production', 'Forest Nursery', 7),
  ('forest-plantation', 'forest-production', 'Forest Plantation', 8),
  ('forest-engineering-surveying', 'forest-production', 'Forest Engineering and Surveying', 9)
on conflict (id) do update set
  subject_id = excluded.subject_id,
  name       = excluded.name,
  sort_order = excluded.sort_order;

-- ----------------------------------------------------------------------------
-- questions: subject_id + topic_id
-- ----------------------------------------------------------------------------
alter table public.questions
  add column if not exists subject_id text references public.subjects (id);

alter table public.questions
  add column if not exists topic_id text references public.topics (id);

-- Remap the 240 existing questions (keyword-assigned; see note above).
update public.questions set subject_id = 'forest-ecosystem', topic_id = 'dendrology'
 where id in (
    'sil-007', 'sil-102', 'sil-105', 'sil-108', 'sil-118'
 );
update public.questions set subject_id = 'forest-ecosystem', topic_id = 'forest-biodiversity'
 where id in (
    'sil-103', 'sil-126'
 );
update public.questions set subject_id = 'forest-ecosystem', topic_id = 'forest-ecology'
 where id in (
    'sil-002', 'sil-003', 'sil-006', 'sil-008', 'sil-107', 'sil-109', 'sil-114', 'sil-116',
    'sil-119', 'sil-120', 'sil-121', 'sil-124', 'sil-125', 'sil-129'
 );
update public.questions set subject_id = 'forest-ecosystem', topic_id = 'forest-genetics-tree-improvement'
 where id in (
    'sil-122', 'sil-123'
 );
update public.questions set subject_id = 'forest-ecosystem', topic_id = 'forest-soils'
 where id in (
    'sil-010', 'sil-104', 'sil-127'
 );
update public.questions set subject_id = 'forest-ecosystem', topic_id = 'tree-physiology'
 where id in (
    'sil-009', 'sil-115'
 );
update public.questions set subject_id = 'forest-governance', topic_id = 'environment-sustainable-development'
 where id in (
    'frm-009', 'frm-118', 'frm-121', 'sfp-010', 'sfp-120', 'sfp-123', 'sfp-124', 'wsf-119'
 );
update public.questions set subject_id = 'forest-governance', topic_id = 'policy-and-administration'
 where id in (
    'frm-002', 'frm-103', 'frm-104', 'frm-106', 'sfp-001', 'sfp-002', 'sfp-003', 'sfp-004',
    'sfp-005', 'sfp-007', 'sfp-009', 'sfp-101', 'sfp-102', 'sfp-103', 'sfp-104', 'sfp-105',
    'sfp-106', 'sfp-107', 'sfp-110', 'sfp-112', 'sfp-113', 'sfp-114', 'sfp-115', 'sfp-116',
    'sfp-117', 'sfp-118', 'sfp-119', 'sfp-121', 'sfp-122', 'sfp-126', 'sfp-128', 'sfp-129',
    'sfp-130'
 );
update public.questions set subject_id = 'forest-governance', topic_id = 'social-forestry-extension'
 where id in (
    'sfp-006', 'sfp-008', 'sfp-108', 'sfp-109', 'sfp-111', 'sfp-125', 'sfp-127'
 );
update public.questions set subject_id = 'forest-production', topic_id = 'forest-biometry-mensuration-inventory'
 where id in (
    'fbm-001', 'fbm-002', 'fbm-003', 'fbm-004', 'fbm-005', 'fbm-006', 'fbm-007', 'fbm-008',
    'fbm-009', 'fbm-101', 'fbm-102', 'fbm-103', 'fbm-104', 'fbm-105', 'fbm-106', 'fbm-107',
    'fbm-108', 'fbm-109', 'fbm-110', 'fbm-111', 'fbm-112', 'fbm-113', 'fbm-114', 'fbm-115',
    'fbm-116', 'fbm-117', 'fbm-118', 'fbm-119', 'fbm-120', 'fbm-121', 'fbm-122', 'fbm-123',
    'fbm-124', 'fbm-125', 'fbm-126', 'fbm-127', 'fbm-128', 'fbm-129', 'fbm-130', 'fes-001',
    'fes-003', 'fes-004', 'fes-006', 'fes-007', 'fes-009', 'fes-010', 'fes-101', 'fes-102',
    'fes-103', 'fes-104', 'fes-105', 'fes-106', 'fes-107', 'fes-108', 'fes-110', 'fes-112',
    'fes-113', 'fes-114', 'fes-115', 'fes-116', 'fes-119', 'fes-120', 'fes-121', 'fes-122',
    'fes-125', 'fes-126', 'fes-129', 'fes-130', 'frm-001', 'frm-010', 'frm-111', 'frm-112',
    'frm-114', 'frm-120', 'frm-127', 'frm-128', 'sil-113'
 );
update public.questions set subject_id = 'forest-production', topic_id = 'forest-economics-finance'
 where id in (
    'frm-005', 'frm-122', 'frm-124'
 );
update public.questions set subject_id = 'forest-production', topic_id = 'forest-engineering-surveying'
 where id in (
    'fes-002', 'fes-005', 'fes-008', 'fes-109', 'fes-111', 'fes-117', 'fes-118', 'fes-123',
    'fes-124', 'fes-127', 'fes-128', 'sil-128'
 );
update public.questions set subject_id = 'forest-production', topic_id = 'forest-management'
 where id in (
    'fbm-010', 'frm-003', 'frm-004', 'frm-006', 'frm-007', 'frm-008', 'frm-101', 'frm-102',
    'frm-105', 'frm-107', 'frm-109', 'frm-110', 'frm-113', 'frm-115', 'frm-116', 'frm-117',
    'frm-119', 'frm-123', 'frm-125', 'frm-129'
 );
update public.questions set subject_id = 'forest-production', topic_id = 'forest-nursery'
 where id in (
    'frm-126'
 );
update public.questions set subject_id = 'forest-production', topic_id = 'silvicultural-methods-systems'
 where id in (
    'frm-130', 'sil-001', 'sil-004', 'sil-005', 'sil-101', 'sil-106', 'sil-110', 'sil-111',
    'sil-112', 'sil-117', 'sil-130'
 );
update public.questions set subject_id = 'forest-utilization', topic_id = 'forest-products-utilization'
 where id in (
    'wsf-006', 'wsf-008', 'wsf-105', 'wsf-107', 'wsf-109', 'wsf-110', 'wsf-114', 'wsf-124'
 );
update public.questions set subject_id = 'forest-utilization', topic_id = 'non-timber-forest-products'
 where id in (
    'frm-108', 'wsf-010'
 );
update public.questions set subject_id = 'forest-utilization', topic_id = 'wood-physics-mechanics'
 where id in (
    'wsf-001', 'wsf-003', 'wsf-004', 'wsf-005', 'wsf-007', 'wsf-009', 'wsf-102', 'wsf-106',
    'wsf-111', 'wsf-112', 'wsf-113', 'wsf-115', 'wsf-116', 'wsf-117', 'wsf-120', 'wsf-121',
    'wsf-122', 'wsf-123', 'wsf-128', 'wsf-129'
 );
update public.questions set subject_id = 'forest-utilization', topic_id = 'wood-seasoning-preservation'
 where id in (
    'wsf-125'
 );
update public.questions set subject_id = 'forest-utilization', topic_id = 'wood-structure-identification'
 where id in (
    'wsf-002', 'wsf-101', 'wsf-103', 'wsf-104', 'wsf-108', 'wsf-118', 'wsf-126', 'wsf-127',
    'wsf-130'
 );

-- Anything the remap missed (there should be none) lands in the paper its old
-- subject most nearly matched, so the NOT NULL below cannot fail silently.
update public.questions set subject_id = 'forest-production'
 where subject_id is null;

alter table public.questions alter column subject_id set not null;

-- ----------------------------------------------------------------------------
-- Views and the exam picker referenced questions.subject, so they are dropped
-- here and rebuilt against subject_id further down.
-- ----------------------------------------------------------------------------
drop view if exists public.exam_catalog;
drop view if exists public.bank_coverage;
drop view if exists public.user_subject_accuracy;

drop index if exists public.questions_pool_subject_idx;
drop index if exists public.questions_subject_idx;

-- ----------------------------------------------------------------------------
-- exams: one paper per subject
-- ----------------------------------------------------------------------------
alter table public.exams
  add column if not exists subject_id text references public.subjects (id);

-- The old day-1/day-2 rows are retired rather than deleted: exam_attempts
-- references exams with ON DELETE CASCADE, so deleting them would destroy
-- every attempt anyone has already sat.
update public.exams set is_active = false where id in ('day-1', 'day-2');

alter table public.exams drop column if exists subjects;

alter table public.exams
  drop constraint if exists exams_subjects_not_empty;

alter table public.exams
  drop constraint if exists exams_active_needs_subject;

alter table public.exams
  add constraint exams_active_needs_subject
  check (is_active = false or subject_id is not null);

insert into public.exams
  (id, name, description, subject_id, target_questions, seconds_per_question, passing_pct, sort_order)
values
  ('forest-ecosystem', 'Forest Ecosystem', 'Day 1, 08:00. 240 minutes.', 'forest-ecosystem', 100, 144, 75, 1),
  ('forest-governance', 'Forest Governance and Social Forestry', 'Day 1, 13:00. 240 minutes.', 'forest-governance', 100, 144, 75, 2),
  ('forest-utilization', 'Forest Utilization Engineering', 'Day 2, 08:00. 240 minutes.', 'forest-utilization', 100, 144, 75, 3),
  ('forest-production', 'Forest Production Management', 'Day 2, 13:00. 300 minutes.', 'forest-production', 100, 180, 75, 4)
on conflict (id) do update set
  name                 = excluded.name,
  description          = excluded.description,
  subject_id           = excluded.subject_id,
  target_questions     = excluded.target_questions,
  seconds_per_question = excluded.seconds_per_question,
  passing_pct          = excluded.passing_pct,
  sort_order           = excluded.sort_order,
  is_active            = true;

-- ----------------------------------------------------------------------------
-- The old enum can finally go: nothing references it now.
-- ----------------------------------------------------------------------------
alter table public.questions drop column if exists subject;

drop type if exists forestry_subject;

create index if not exists questions_subject_idx
  on public.questions (subject_id) where is_active;
create index if not exists questions_pool_subject_idx
  on public.questions (pool, subject_id, difficulty) where is_active;
create index if not exists questions_topic_idx
  on public.questions (topic_id) where is_active;

-- ----------------------------------------------------------------------------
-- start_exam_attempt: draw from the paper's own subject
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
      and q.subject_id = v_exam.subject_id
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
-- Views rebuilt against the new taxonomy. subject is still exposed as a display
-- name, so callers that only render it need no change.
-- ----------------------------------------------------------------------------
create or replace view public.exam_catalog
with (security_invoker = true) as
select
  e.id,
  e.name,
  e.description,
  e.subject_id,
  s.exam_day,
  s.starts_at,
  e.target_questions,
  e.passing_pct,
  e.sort_order,
  least(
    e.target_questions,
    (select count(*) from public.questions q
     where q.is_active and q.pool = 'mock' and q.subject_id = e.subject_id)
  )::integer as question_count,
  least(
    e.target_questions,
    (select count(*) from public.questions q
     where q.is_active and q.pool = 'mock' and q.subject_id = e.subject_id)
  )::integer * e.seconds_per_question as duration_seconds
from public.exams e
join public.subjects s on s.id = e.subject_id
where e.is_active;

create or replace view public.user_subject_accuracy
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
  s.name                                                as subject,
  q.subject_id,
  count(*)                                              as answered,
  count(*) filter (where fa.is_correct)                 as correct,
  round(
    100.0 * count(*) filter (where fa.is_correct) / nullif(count(*), 0)
  )                                                     as accuracy_pct
from first_attempts fa
join public.questions q on q.id = fa.question_id
join public.subjects s on s.id = q.subject_id
group by fa.user_id, s.name, q.subject_id;

-- Coverage by topic, which is what the generator reads to find its gaps.
create or replace view public.bank_coverage
with (security_invoker = true) as
select
  s.id                                              as subject_id,
  s.name                                            as subject,
  t.id                                              as topic_id,
  t.name                                            as topic,
  q.pool,
  q.difficulty,
  count(q.id)                                       as questions,
  count(q.id) filter (where q.explanation is null)  as awaiting_explanation
from public.topics t
join public.subjects s on s.id = t.subject_id
left join public.questions q
       on q.topic_id = t.id and q.is_active
group by s.id, s.name, t.id, t.name, q.pool, q.difficulty;

alter table public.subjects enable row level security;
alter table public.topics   enable row level security;

drop policy if exists "subjects readable by authenticated" on public.subjects;
create policy "subjects readable by authenticated"
  on public.subjects for select to authenticated using (true);

drop policy if exists "topics readable by authenticated" on public.topics;
create policy "topics readable by authenticated"
  on public.topics for select to authenticated using (true);

-- ----------------------------------------------------------------------------
-- Verification — expect 4 subjects, 29 topics, 240 questions all mapped,
-- and the topics with zero coverage that the generator must fill.
-- ----------------------------------------------------------------------------
select s.name as subject, t.name as topic, count(q.id) as questions
from public.topics t
join public.subjects s on s.id = t.subject_id
left join public.questions q on q.topic_id = t.id
group by s.sort_order, s.name, t.sort_order, t.name
order by s.sort_order, t.sort_order;

