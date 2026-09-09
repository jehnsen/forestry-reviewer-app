-- ============================================================================
-- ForestGuro — Migration 0007: prune off-program content
--
-- The Oct 2026 Professional Regulatory Board programme lists no road
-- engineering, culvert design, earthwork, curve layout or cable yarding topic.
-- Eleven questions written against the old invented "Forest Engineering &
-- Surveying" subject have nowhere to sit and are removed.
--
-- VERIFIED BEFORE WRITING THIS: none of the eleven has any row in user_answers
-- or exam_answers, so the delete destroys no study history. Questions that HAVE
-- been answered are never deleted here — user_answers cascades on delete, and
-- losing a candidate's history to tidy the bank is not a trade worth making.
--
-- sil-128 was swept into the same bucket by a keyword ("Selective Logging
-- System") but is a silviculture question and is on the programme. It is
-- reclassified rather than removed.
--
-- Run AFTER 0006_board_structure.sql. Safe to re-run.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Rescue the one misfiled question.
-- ----------------------------------------------------------------------------
update public.questions
   set topic_id = 'silvicultural-methods-systems'
 where id = 'sil-128';

-- ----------------------------------------------------------------------------
-- 2. Refuse to delete anything that carries study history.
--
-- Belt and braces: if a later run of this file meets a question that has since
-- been answered, this leaves it alone rather than cascading the answer away.
-- ----------------------------------------------------------------------------
delete from public.questions q
 where q.topic_id = 'forest-engineering-surveying'
   and not exists (select 1 from public.user_answers ua where ua.question_id = q.id)
   and not exists (select 1 from public.exam_answers ea where ea.question_id = q.id);

-- ----------------------------------------------------------------------------
-- 3. Drop the topic itself, but only once nothing references it.
-- ----------------------------------------------------------------------------
delete from public.topics t
 where t.id = 'forest-engineering-surveying'
   and not exists (select 1 from public.questions q where q.topic_id = t.id);

-- ----------------------------------------------------------------------------
-- Verification — expect 0 rows in the off-program topic, and sil-128 sitting
-- under silvicultural-methods-systems.
-- ----------------------------------------------------------------------------
select
  (select count(*) from public.questions
    where topic_id = 'forest-engineering-surveying')            as off_program_remaining,
  (select count(*) from public.topics
    where id = 'forest-engineering-surveying')                  as off_program_topic_rows,
  (select topic_id from public.questions where id = 'sil-128')  as sil_128_topic,
  (select count(*) from public.questions)                       as questions_total;
