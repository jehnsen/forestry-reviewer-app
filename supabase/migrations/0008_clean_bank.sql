-- ============================================================================
-- ForestGuro — Migration 0008: drop the legacy seed, re-tag the rest by hand
--
-- Two things:
--
--   1. The 57 remaining questions from the original seed (ids like sil-001) are
--      deleted. They were written during the mock-data phase against the
--      six-subject taxonomy that no longer exists, and their answer keys were
--      never verified. They are replaced by pipeline-generated questions that
--      are re-solved by an independent check before they are accepted.
--
--      This DOES destroy study history: user_answers and exam_answers cascade.
--      That is accepted here deliberately — the history is a handful of test
--      answers against questions that are themselves being removed.
--
--   2. The 172 hand-authored questions keep their content but have their
--      subject and topic reassigned by reading each one, replacing the keyword
--      matching used in 0006. That classifier put roughly one question in six
--      in the wrong place, including five in the wrong board paper entirely:
--      two inventory/management questions and one wood-physics question were
--      sitting in Forest Governance.
--
-- Run AFTER 0007_prune_off_program.sql. Safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Retire the legacy seed.
-- ----------------------------------------------------------------------------
delete from public.questions
 where id ~ '^[a-z]{3}-0[0-9][0-9]$';

-- Attempts whose papers are gone would render an empty review, so they go too.
-- exam_answers cascades from this.
delete from public.exam_attempts;

-- ----------------------------------------------------------------------------
-- 2a. Wrong board paper — these five were being served by the wrong exam.
-- ----------------------------------------------------------------------------
update public.questions set subject_id = 'forest-production',
       topic_id = 'forest-biometry-mensuration-inventory' where id = 'frm-104';
update public.questions set subject_id = 'forest-production',
       topic_id = 'forest-management'                     where id = 'frm-106';
update public.questions set subject_id = 'forest-production',
       topic_id = 'multiple-use-forestry'                 where id = 'frm-118';
update public.questions set subject_id = 'forest-production',
       topic_id = 'forest-economics-finance'              where id = 'frm-121';
update public.questions set subject_id = 'forest-utilization',
       topic_id = 'wood-physics-mechanics'                where id = 'wsf-119';

-- ----------------------------------------------------------------------------
-- 2b. Right paper, wrong topic.
-- ----------------------------------------------------------------------------

-- Regulation of the cut is Forest Management, not mensuration: these ask how
-- the harvest is controlled, not how anything is measured.
update public.questions set topic_id = 'forest-management'
 where id in ('frm-111', 'frm-114', 'frm-120', 'frm-128', 'frm-130');

update public.questions set topic_id = 'forest-economics-finance'
 where id in ('frm-126');

-- Silvicultural system questions the classifier read as pure ecology. These
-- cross papers, so subject_id moves with the topic — setting topic_id alone
-- leaves the question claiming a subject its topic does not belong to.
update public.questions
   set subject_id = 'forest-production',
       topic_id   = 'silvicultural-methods-systems'
 where id in ('sil-119', 'sil-121');

update public.questions set topic_id = 'forest-ecology'
 where id in ('sil-103');

-- Community forestry instruments belong with Social Forestry and Extension
-- rather than being lumped into Policy and Administration, which was carrying
-- a third of the entire Governance paper.
update public.questions set topic_id = 'social-forestry-extension'
 where id in ('sfp-112', 'sfp-114', 'sfp-119', 'sfp-126');

-- EO 23's logging moratorium is a protection measure.
update public.questions set topic_id = 'forest-protection'
 where id in ('sfp-113');

-- Drying and decay are Seasoning and Preservation, not general wood physics.
update public.questions set topic_id = 'wood-seasoning-preservation'
 where id in ('wsf-106', 'wsf-117', 'wsf-118', 'wsf-123', 'wsf-130');

-- Wood chemistry and species identification sit under Structure and
-- Identification; the programme lists no separate chemistry topic.
update public.questions set topic_id = 'wood-structure-identification'
 where id in ('wsf-107', 'wsf-110', 'wsf-124');

-- Panel products are a utilisation question, not a physics one.
update public.questions set topic_id = 'forest-products-utilization'
 where id in ('wsf-128');

-- ----------------------------------------------------------------------------
-- Verification — expect 172 questions, none with a legacy id, and no question
-- whose topic belongs to a different subject than the question claims.
-- ----------------------------------------------------------------------------
select
  (select count(*) from public.questions)                              as questions_total,
  (select count(*) from public.questions
    where id ~ '^[a-z]{3}-0[0-9][0-9]$')                               as legacy_remaining,
  (select count(*) from public.questions q
     join public.topics t on t.id = q.topic_id
    where t.subject_id <> q.subject_id)                                as subject_topic_mismatches,
  (select count(*) from public.exam_attempts)                          as attempts,
  (select count(*) from public.user_answers)                           as user_answers;
