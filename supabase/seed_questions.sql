-- ============================================================================
-- ForestGuro — Seed Questions
-- PRC Forester Licensure Examination Reviewer
--
-- 60 questions across the six board subjects, 10 per subject.
--
-- PREREQUISITE: run schema.sql first (creates the enums and the questions table).
--
-- This script is IDEMPOTENT — re-running it updates existing rows rather than
-- failing on duplicate keys, so it is safe to run after editing a question.
--
-- Usage: paste into the Supabase SQL Editor and run, or
--        psql "$DATABASE_URL" -f supabase/seed_questions.sql
-- ============================================================================

insert into public.questions
  (id, subject, difficulty, question, options, correct_answer_id,
   explanation, detailed_explanation, tips)
values
  ('sil-001', 'Silviculture & Forest Ecology', 'Medium', 'Which silvicultural system removes the entire stand in one cutting and regenerates the area as a single even-aged cohort?',
   '[{"id": "a", "text": "Clearcutting system"}, {"id": "b", "text": "Selection system"}, {"id": "c", "text": "Shelterwood system"}, {"id": "d", "text": "Coppice-with-standards system"}]'::jsonb,
   'a', 'Clearcutting removes all merchantable trees in one operation, producing a fully exposed site that regenerates as a single even-aged stand.',
   'The four major silvicultural systems differ in how and when the overstory is removed:

• CLEARCUTTING — one cutting removes the whole stand. Regeneration is even-aged. Favors light-demanding (intolerant) species like Gmelina and Falcata.

• SHELTERWOOD — the stand is removed in a series of two or three cuts (preparatory, seed, removal). The residual overstory shelters seedlings until the final cut. Also produces an even-aged stand.

• SELECTION — individual trees or small groups are removed at intervals. Produces an uneven-aged stand with continuous canopy. Favors shade-tolerant species.

• COPPICE — regeneration comes from stump sprouts or root suckers rather than seed.

Clearcutting is the only one that removes everything in a single entry.',
   'Anchor on the phrase ''in one cutting.'' Shelterwood is staged, selection is continuous, and coppice regenerates vegetatively.'),

  ('sil-002', 'Silviculture & Forest Ecology', 'Hard', 'Which succession process describes the colonization of a bare lahar deposit or newly cooled lava flow where no soil or seed bank exists?',
   '[{"id": "a", "text": "Secondary succession"}, {"id": "b", "text": "Primary succession"}, {"id": "c", "text": "Retrogressive succession"}, {"id": "d", "text": "Cyclic succession"}]'::jsonb,
   'b', 'Primary succession occurs on substrates that have never supported vegetation and contain no soil or seed bank — lava flows, lahar deposits, and newly exposed rock.',
   'PRIMARY SUCCESSION begins on sterile substrate:
• No soil, no seed bank, no organic matter.
• Pioneer colonizers are lichens, mosses, and nitrogen-fixing species.
• Soil must be built from scratch — a process taking centuries.
• Philippine example: the lahar fields of Pinatubo.

SECONDARY SUCCESSION begins after a disturbance that removes vegetation but LEAVES THE SOIL INTACT:
• Soil, seed bank, and root systems survive.
• Recovery takes decades rather than centuries.
• Philippine example: abandoned kaingin plots recovering through cogon, then Trema and Macaranga.

The deciding question is always: DOES SOIL REMAIN?',
   'One diagnostic question separates these: is there soil to start with? Lava, lahar, and bare rock mean primary. Fire, kaingin, and logging mean secondary.'),

  ('sil-003', 'Silviculture & Forest Ecology', 'Easy', 'A species that requires full sunlight and cannot survive under a closed canopy is best described as:',
   '[{"id": "a", "text": "Shade-tolerant"}, {"id": "b", "text": "Hemi-epiphytic"}, {"id": "c", "text": "Shade-intolerant (light-demanding)"}, {"id": "d", "text": "Sciophytic"}]'::jsonb,
   'c', 'Shade-intolerant or light-demanding species need high light levels and die back under a closed canopy. They dominate open sites and early succession.',
   'SHADE TOLERANCE governs which silvicultural system suits a species.

SHADE-INTOLERANT (light-demanding):
• Require full or near-full sunlight.
• Fast early growth, short-lived, low wood density.
• Examples: Gmelina arborea, Falcata (Falcataria), Bagras.
• Managed by CLEARCUTTING — they need the open site.

SHADE-TOLERANT (sciophytic):
• Regenerate and persist in the understory.
• Slower growth, longer-lived, denser wood.
• Examples: many dipterocarps in the seedling stage, Narra.
• Managed by SELECTION or SHELTERWOOD.

Matching the system to the tolerance class is the core silvicultural decision.',
   'Link tolerance to system: intolerant → clearcutting, tolerant → selection. If a question names Gmelina or Falcata, it is signalling light-demanding.'),

  ('sil-004', 'Silviculture & Forest Ecology', 'Medium', 'In the shelterwood system, which cutting is made specifically to open the canopy and stimulate seed production and germination?',
   '[{"id": "a", "text": "Preparatory cutting"}, {"id": "b", "text": "Removal cutting"}, {"id": "c", "text": "Salvage cutting"}, {"id": "d", "text": "Seed cutting"}]'::jsonb,
   'd', 'The seed cutting opens the canopy enough to create conditions favorable for seed germination and seedling establishment, while retaining seed trees.',
   'The shelterwood system proceeds in a sequence:

1. PREPARATORY CUTTING — removes poor-form and undesirable trees, improving the crowns and root systems of the trees that will produce seed. Sometimes skipped.

2. SEED CUTTING — opens the canopy to admit light and stimulate both seed production and germination. This is the cut that establishes regeneration.

3. REMOVAL (FINAL) CUTTING — takes out the remaining overstory once regeneration is established, releasing the young stand.

SALVAGE CUTTING is not part of the sequence — it recovers value from trees killed or damaged by typhoon, fire, or insects.',
   'Remember the order Preparatory → Seed → Removal. The middle cut is named for what it does: it makes seed and lets it germinate.'),

  ('sil-005', 'Silviculture & Forest Ecology', 'Medium', 'What is the primary purpose of a thinning operation in a plantation?',
   '[{"id": "a", "text": "To redistribute growth potential onto fewer, better-formed crop trees"}, {"id": "b", "text": "To harvest the final crop for revenue"}, {"id": "c", "text": "To regenerate the stand from seed"}, {"id": "d", "text": "To convert the stand to an uneven-aged structure"}]'::jsonb,
   'a', 'Thinning is an intermediate cutting that reduces stand density so the remaining crop trees receive more light, water, and nutrients, concentrating growth on the best stems.',
   'THINNING is an INTERMEDIATE cutting — it occurs between establishment and final harvest and is not a regeneration cutting.

Purposes:
• Redistribute site resources onto selected crop trees.
• Improve stand quality by removing defective, diseased, and suppressed stems.
• Capture mortality that would otherwise be lost to competition.
• Generate intermediate income from the material removed.

Common thinning types:
• LOW THINNING (from below) — removes suppressed and intermediate trees. Mimics natural mortality.
• CROWN THINNING (from above) — removes competitors of the dominant crop trees.
• SELECTION THINNING — removes dominants to release the intermediate class.
• MECHANICAL/ROW THINNING — removes trees on a fixed pattern, common in plantations.

Thinning does NOT increase total stand volume production — it concentrates that volume onto fewer, larger, more valuable stems.',
   'A frequent trap: thinning does not raise total volume growth, it redistributes it. Choose the answer about individual tree size and quality, not total yield.'),

  ('sil-006', 'Silviculture & Forest Ecology', 'Hard', 'Which ecological term describes the maximum population size of a species that a given habitat can sustain indefinitely?',
   '[{"id": "a", "text": "Biotic potential"}, {"id": "b", "text": "Carrying capacity"}, {"id": "c", "text": "Ecological amplitude"}, {"id": "d", "text": "Net primary productivity"}]'::jsonb,
   'b', 'Carrying capacity (K) is the maximum number of individuals of a species that an environment can support indefinitely given available resources.',
   'Key population ecology terms:

• CARRYING CAPACITY (K) — the ceiling population an environment can sustain indefinitely. Growth slows as the population approaches K, producing the S-shaped logistic curve.

• BIOTIC POTENTIAL — the maximum reproductive capacity under unlimited, ideal conditions. Never realized in nature because environmental resistance (predation, disease, competition, limited resources) intervenes.

• ENVIRONMENTAL RESISTANCE — the sum of factors that keep a population below its biotic potential.

• ECOLOGICAL AMPLITUDE — the breadth of environmental conditions a species can tolerate. Wide-amplitude species are generalists.

• NET PRIMARY PRODUCTIVITY (NPP) — gross photosynthesis minus plant respiration. An energy measure, not a population measure.

Carrying capacity underpins wildlife stocking decisions in protected-area management.',
   'Watch the qualifier ''indefinitely'' or ''sustainably'' — that phrasing points to carrying capacity, not biotic potential, which assumes unlimited conditions.'),

  ('sil-007', 'Silviculture & Forest Ecology', 'Easy', 'Which forest formation in the Philippines is characterized by trees with stilt and pneumatophore roots growing in saline intertidal zones?',
   '[{"id": "a", "text": "Mossy forest"}, {"id": "b", "text": "Molave forest"}, {"id": "c", "text": "Mangrove forest"}, {"id": "d", "text": "Pine forest"}]'::jsonb,
   'c', 'Mangrove forests occupy saline intertidal zones and are distinguished by specialized aerial roots — stilt roots (Rhizophora) and pneumatophores (Avicennia, Sonneratia).',
   'Major Philippine forest formations:

• MANGROVE — intertidal, saline. Stilt roots and pneumatophores handle waterlogged, oxygen-poor soil. Genera: Rhizophora (bakhaw), Avicennia (api-api), Sonneratia (pagatpat), Nypa (sasa). Critical for coastal protection and fishery nurseries.

• BEACH FOREST — above the high tide line on sandy shores. Talisay, Botong, Agoho.

• DIPTEROCARP FOREST — the main timber-producing formation, lowland to 1,000 m. Lauan, Apitong, Yakal, Guijo.

• MOLAVE FOREST — drier limestone areas with a pronounced dry season. Molave, Narra, Ipil.

• PINE FOREST — high elevations of northern Luzon. Benguet pine (Pinus kesiya), Mindoro pine (Pinus merkusii).

• MOSSY FOREST — above roughly 1,000 m, stunted trees heavily draped in mosses and epiphytes. Vital watershed function.',
   'Match the diagnostic root or habitat to the formation. Pneumatophores and stilt roots mean mangrove; stunted trees covered in moss at high elevation mean mossy forest.'),

  ('sil-008', 'Silviculture & Forest Ecology', 'Medium', 'The gradual replacement of pioneer species by longer-lived, shade-tolerant species until a relatively stable community is reached describes:',
   '[{"id": "a", "text": "Ecological release"}, {"id": "b", "text": "Allelopathy"}, {"id": "c", "text": "Competitive exclusion"}, {"id": "d", "text": "A climax community developing through succession"}]'::jsonb,
   'd', 'Ecological succession proceeds through seral stages from pioneers toward a climax community — a relatively stable, self-perpetuating assemblage in equilibrium with the site.',
   'The successional sequence:

1. PIONEER (SERAL) STAGE — fast-growing, light-demanding, short-lived species colonize. In Philippine secondary forest these are typically Trema, Macaranga, and Musanga-type colonizers, often preceded by cogon grassland.

2. INTERMEDIATE SERAL STAGES — the pioneers shade the site, changing the microclimate and building soil organic matter. Their own seedlings can no longer regenerate under the canopy they created.

3. CLIMAX COMMUNITY — shade-tolerant, longer-lived species (dipterocarps in Philippine lowlands) dominate. The community becomes relatively self-perpetuating.

Modern ecology treats climax as a dynamic equilibrium rather than a fixed endpoint — typhoons, landslides, and gap formation constantly reset patches. This produces the SHIFTING MOSAIC of a natural forest.

The key mechanism: each seral stage alters the site in ways that favor its own successors — facilitation.',
   'Note that pioneers engineer their own replacement by creating shade their seedlings cannot tolerate. That self-defeating quality is the engine of succession.'),

  ('sil-009', 'Silviculture & Forest Ecology', 'Hard', 'In a forest ecosystem, which trophic process returns nutrients locked in dead organic matter back to a plant-available form?',
   '[{"id": "a", "text": "Decomposition and mineralization"}, {"id": "b", "text": "Photosynthesis"}, {"id": "c", "text": "Transpiration"}, {"id": "d", "text": "Primary production"}]'::jsonb,
   'a', 'Decomposers break down litter and dead organic matter, and mineralization converts organically bound nutrients into inorganic forms that plant roots can absorb.',
   'NUTRIENT CYCLING in a forest depends on the decomposer subsystem:

1. LITTERFALL — leaves, branches, and dead roots deposit organic matter on and in the soil.

2. DECOMPOSITION — fungi, bacteria, and soil fauna (termites, earthworms, mites) physically and chemically break down the litter.

3. MINERALIZATION — organically bound nutrients (N, P, S) are converted to inorganic, plant-available ions such as NH4+, NO3-, and PO4 3-.

4. UPTAKE — roots and their mycorrhizal partners absorb these ions.

Why this matters in tropical forestry: most nutrients in a humid tropical forest are held in the LIVING BIOMASS, not the soil. Decomposition is rapid and uptake is immediate, so the cycle is tight and nearly closed.

This explains why clearing and burning tropical forest yields only a few good cropping seasons — the nutrient capital left with the biomass, and the exposed soil rapidly loses what remains to leaching and erosion. It is the ecological basis for the failure of shifting cultivation at short fallow intervals.',
   'Connect this to kaingin: tropical soils are poor because the nutrients are in the trees. Remove the trees and you remove the nutrient capital — a common essay and multiple-choice theme.'),

  ('sil-010', 'Silviculture & Forest Ecology', 'Medium', 'Which symbiotic association between fungi and tree roots substantially improves the uptake of phosphorus and water, and is essential for dipterocarp seedling establishment?',
   '[{"id": "a", "text": "Rhizobium nodulation"}, {"id": "b", "text": "Mycorrhizal association"}, {"id": "c", "text": "Lichen symbiosis"}, {"id": "d", "text": "Nitrification"}]'::jsonb,
   'b', 'Mycorrhizae are mutualistic fungus-root associations. The fungal hyphae greatly extend the absorbing surface of the root system, improving uptake of phosphorus and water in exchange for photosynthates.',
   'MYCORRHIZAE are indispensable in forest nurseries and plantation establishment.

Two main types:

• ECTOMYCORRHIZAE (ECM) — the fungus forms a sheath around the root and grows between cortical cells without penetrating them. Characteristic of DIPTEROCARPS and PINES. This is why dipterocarp seedlings raised in sterile media often fail: without ECM inoculation they cannot take up phosphorus efficiently.

• ENDOMYCORRHIZAE (arbuscular / AM) — hyphae penetrate the root cell walls and form arbuscules inside. Found in most other tree families, including Gmelina and many fruit trees.

Benefits to the tree:
• Greatly increased absorbing surface area.
• Improved phosphorus uptake — the limiting nutrient in most tropical soils.
• Better drought tolerance and water uptake.
• Some protection against root pathogens.

The fungus receives carbohydrates from photosynthesis in return.

Do not confuse with RHIZOBIUM, which is bacterial nitrogen fixation in legume root nodules — relevant to Acacia and Falcata, but a different organism and a different nutrient.',
   'Distinguish carefully: mycorrhizae are FUNGI improving PHOSPHORUS uptake; Rhizobium is BACTERIA fixing NITROGEN in legumes. Exams pair these two as distractors constantly.'),

  ('frm-001', 'Forest Resources Management', 'Hard', 'A 400-hectare plantation is managed on a 25-year rotation under the area control method. How many hectares should be harvested annually to achieve a sustained yield?',
   '[{"id": "a", "text": "25 hectares"}, {"id": "b", "text": "40 hectares"}, {"id": "c", "text": "16 hectares"}, {"id": "d", "text": "10 hectares"}]'::jsonb,
   'c', 'Under area control, annual coupe = total area ÷ rotation age = 400 ha ÷ 25 years = 16 hectares per year.',
   'AREA CONTROL is the simplest method of regulating a forest for sustained yield. The principle: harvest an equal area each year so that by the end of one rotation, the entire forest has been cut once and the first-cut area is mature again.

Formula: Annual coupe = Total productive area ÷ Rotation age
• 400 ha ÷ 25 yr = 16 ha/yr

Verification: 16 ha/yr × 25 yr = 400 ha — the whole forest, exactly once. The stand cut in year 1 is 25 years old again in year 26. This is a NORMAL FOREST: equal areas in every age class.

Contrast with VOLUME CONTROL, which regulates by cubic meters removed and suits uneven-aged stands.

Why the distractors are wrong:
• 25 ha confuses the rotation age with the answer.
• 40 ha divides by 10 instead of 25.
• 10 ha divides 400 by 40.',
   'Area control is always area ÷ rotation — never area × rotation. Sanity-check by multiplying back: annual coupe × rotation must return the total area.'),

  ('frm-002', 'Forest Resources Management', 'Easy', 'Which Philippine agency has primary jurisdiction over the management, protection, and sustainable development of the country''s forestlands?',
   '[{"id": "a", "text": "Department of Agriculture (DA)"}, {"id": "b", "text": "Department of Agrarian Reform (DAR)"}, {"id": "c", "text": "National Commission on Indigenous Peoples (NCIP)"}, {"id": "d", "text": "Department of Environment and Natural Resources (DENR)"}]'::jsonb,
   'd', 'The DENR, through its Forest Management Bureau (FMB), is the primary agency responsible for the conservation, management, development, and proper use of the country''s forest resources.',
   'The DENR was created under Executive Order No. 192 (1987).

Relevant DENR bureaus:
• FOREST MANAGEMENT BUREAU (FMB) — policy and technical guidance on forestland management.
• BIODIVERSITY MANAGEMENT BUREAU (BMB) — protected areas and wildlife (formerly PAWB).
• ERDB — Ecosystems Research and Development Bureau, the research arm.
• LAND MANAGEMENT BUREAU (LMB) — alienable and disposable lands.

Jurisdiction of the others:
• DA — agricultural lands and crops, NOT forestlands.
• DAR — agrarian reform on private agricultural land under CARP.
• NCIP — ancestral domains under IPRA (RA 8371).

Field implementation runs DENR Regional Office → PENRO (provincial) → CENRO (community).',
   'Learn the chain of command: DENR → Regional Office → PENRO → CENRO. Exams frequently ask which office issues a permit — usually the CENRO at field level.'),

  ('frm-003', 'Forest Resources Management', 'Medium', 'What is the term for the maximum quantity of timber that may be harvested annually from a forest without impairing its productive capacity?',
   '[{"id": "a", "text": "Annual allowable cut (AAC)"}, {"id": "b", "text": "Mean annual increment (MAI)"}, {"id": "c", "text": "Standing volume"}, {"id": "d", "text": "Rotation age"}]'::jsonb,
   'a', 'The annual allowable cut is the volume of timber that may be harvested each year on a sustained-yield basis without reducing the forest''s long-term productive capacity.',
   'ANNUAL ALLOWABLE CUT (AAC) is the operational expression of sustained yield.

The governing principle: over the long run, harvest must not exceed growth. AAC is therefore anchored to the forest''s increment.

Related but distinct concepts:
• MEAN ANNUAL INCREMENT (MAI) — total volume ÷ age. Average yearly growth over the stand''s life.
• CURRENT ANNUAL INCREMENT (CAI) — growth in one specific year.
• STANDING VOLUME (growing stock) — total volume present at a point in time. A stock, not a flow.
• ROTATION AGE — the planned age at final harvest.

The critical relationship: MAI is MAXIMIZED at the age where CAI = MAI, and that intersection defines the rotation of maximum volume production. Before it, CAI exceeds MAI and MAI is still rising; after it, CAI falls below MAI and MAI declines.

Setting AAC above sustainable increment is precisely what drove the collapse of Philippine dipterocarp timber supply from the 1970s onward.',
   'Remember the intersection rule: the rotation for maximum volume production is where CAI crosses MAI. This single relationship generates many exam items.'),

  ('frm-004', 'Forest Resources Management', 'Medium', 'A stand has a total volume of 240 m³/ha at age 20. What is its mean annual increment (MAI)?',
   '[{"id": "a", "text": "20 m³/ha/yr"}, {"id": "b", "text": "12 m³/ha/yr"}, {"id": "c", "text": "4,800 m³/ha/yr"}, {"id": "d", "text": "24 m³/ha/yr"}]'::jsonb,
   'b', 'MAI = total volume ÷ age = 240 m³/ha ÷ 20 years = 12 m³/ha/yr.',
   'MEAN ANNUAL INCREMENT is the simplest growth statistic in forest management.

Formula: MAI = Total volume at age A ÷ A
• MAI = 240 ÷ 20 = 12 m³/ha/yr

Interpretation: on average, this stand has added 12 cubic meters per hectare every year of its life. It says nothing about the pattern — actual growth was slower in the establishment years and faster during the period of maximum vigor.

Compare CURRENT ANNUAL INCREMENT (CAI), the growth in a single year:
• CAI = V(age 20) − V(age 19)

Management use: to maximize sustained volume production, the rotation is set at the CULMINATION OF MAI — the age where MAI reaches its peak, which is also where CAI crosses MAI on the way down.

A plantation MAI of 12 m³/ha/yr is a plausible figure for a well-managed Philippine hardwood plantation. Fast-growing Falcata can exceed 30 m³/ha/yr on good sites.',
   'MAI divides by age; CAI subtracts consecutive years. If a problem gives one volume and one age, it is asking for MAI — a single division.'),

  ('frm-005', 'Forest Resources Management', 'Hard', 'In forest valuation, which criterion selects the rotation age that maximizes the net present value of an infinite series of rotations?',
   '[{"id": "a", "text": "Culmination of mean annual increment"}, {"id": "b", "text": "Biological rotation"}, {"id": "c", "text": "Faustmann formula (land expectation value)"}, {"id": "d", "text": "Technical rotation"}]'::jsonb,
   'c', 'The Faustmann formula computes land expectation value — the net present value of an infinite series of identical rotations — and the rotation maximizing it is the financially optimal rotation.',
   'Different rotation criteria answer different questions:

• BIOLOGICAL (SILVICULTURAL) ROTATION — set at the culmination of MAI. Maximizes VOLUME produced per unit area per year. Ignores money entirely.

• TECHNICAL ROTATION — set at the age when trees reach the size required for a specific product (poles, veneer bolts, sawlogs).

• FINANCIAL (FAUSTMANN) ROTATION — set where land expectation value is maximized. Accounts for the time value of money, establishment costs, and the opportunity to start the next rotation.

The crucial result: the FINANCIAL rotation is SHORTER than the biological rotation, and it shortens further as the discount rate rises. Money delayed is money discounted, so it pays to harvest and restart before the stand has maximized its physical volume.

The Faustmann land expectation value:
LEV = [R(T) − C(1+i)^T] ÷ [(1+i)^T − 1]

where R(T) is revenue at rotation age T, C is establishment cost, and i is the discount rate.

This is the theoretical foundation of forest economics and appears in nearly every board exam in some form.',
   'Memorize the direction of the effect: financial rotation < biological rotation, and higher discount rates shorten it further. That comparison alone answers most questions on this topic.'),

  ('frm-006', 'Forest Resources Management', 'Medium', 'What is a ''normal forest'' in classical forest management theory?',
   '[{"id": "a", "text": "A forest of only native species"}, {"id": "b", "text": "A forest that has never been logged"}, {"id": "c", "text": "A forest with an average stocking density"}, {"id": "d", "text": "A forest with an equal area in every age class, growing at full site capacity"}]'::jsonb,
   'd', 'A normal forest is the theoretical ideal: equal areas in each age class from 1 to the rotation age, full stocking, and normal increment, producing an identical harvest every year in perpetuity.',
   'The NORMAL FOREST is a theoretical construct used as a management benchmark. Three conditions must hold:

1. NORMAL AGE-CLASS DISTRIBUTION — equal area in every age class from year 1 to rotation age R. In a 400 ha forest on a 25-year rotation, that is 16 ha in each of the 25 age classes.

2. NORMAL STOCKING (normal growing stock) — every stand fully occupies its site with no gaps or overcrowding.

3. NORMAL INCREMENT — every stand grows at the full rate its site quality permits.

The consequence: harvesting the oldest age class each year yields an IDENTICAL volume in perpetuity, and the removed area re-enters as age class 1. Perfect sustained yield.

No real forest is normal. Its value is as a YARDSTICK — the manager compares the actual age-class distribution against the normal one to see where the surplus and deficit lie, then plans cutting to move the actual toward the normal over time.

Most Philippine second-growth forests are badly skewed toward young age classes, a direct legacy of the heavy logging era.',
   'Do not read ''normal'' as ''typical'' or ''natural'' — it is a technical term meaning fully regulated. That misreading is exactly what the distractors are built to exploit.'),

  ('frm-007', 'Forest Resources Management', 'Easy', 'Which of the following best defines ''sustained yield'' in forest management?',
   '[{"id": "a", "text": "Achieving and maintaining a continuous, approximately equal annual or periodic yield in perpetuity"}, {"id": "b", "text": "Harvesting the maximum possible volume in the shortest time"}, {"id": "c", "text": "Planting more trees than are harvested each year"}, {"id": "d", "text": "Harvesting only dead and dying trees"}]'::jsonb,
   'a', 'Sustained yield means managing the forest so it produces a continuous and approximately equal annual or periodic output of goods and services without impairing the productivity of the land.',
   'SUSTAINED YIELD is the organizing principle of professional forestry and the reason the profession exists.

Core requirements:
• CONTINUITY — output does not stop or fluctuate wildly between periods.
• APPROXIMATE EQUALITY — roughly the same volume each year or cutting cycle.
• PERPETUITY — indefinitely, not merely for one manager''s career.
• NON-IMPAIRMENT — the productive capacity of the land is not degraded.

Achieving it requires regulating the forest — through area control, volume control, or a combination — so that removals approximate growth.

The modern extension is SUSTAINABLE FOREST MANAGEMENT (SFM), which broadens the objective beyond timber to include biodiversity, watershed protection, carbon storage, and the livelihoods of forest-dependent communities. The Philippine expression of this shift is the Sustainable Forest Management framework and the CBFM strategy under EO 263.

Historical note: the abandonment of sustained-yield discipline during the TLA era, when annual allowable cuts far exceeded increment, is the standard case study of what happens when this principle is ignored.',
   'Watch for ''maximum'' in the distractors. Sustained yield is about CONTINUITY, not maximization — the two are frequently opposed.'),

  ('frm-008', 'Forest Resources Management', 'Medium', 'Under the volume control method (Von Mantel''s formula), the annual allowable cut is estimated as:',
   '[{"id": "a", "text": "AAC = Growing stock × Rotation ÷ 2"}, {"id": "b", "text": "AAC = 2 × Growing stock ÷ Rotation"}, {"id": "c", "text": "AAC = Growing stock ÷ (2 × Rotation)"}, {"id": "d", "text": "AAC = Growing stock ÷ Rotation"}]'::jsonb,
   'b', 'Von Mantel''s formula estimates AAC as twice the growing stock divided by the rotation age: AAC = 2Gs ÷ R.',
   'VON MANTEL''S FORMULA is the classic quick estimate for annual allowable cut under volume control.

Formula: AAC = 2 × Gs ÷ R
where Gs = total growing stock (volume) and R = rotation age.

Where the factor of 2 comes from: in a normal forest with linear volume accumulation, the average stand volume across all age classes is half the volume of a mature stand. Working backward from the total growing stock to the annual harvest therefore requires doubling.

Worked example: a forest with 12,000 m³ growing stock on a 40-year rotation.
• AAC = (2 × 12,000) ÷ 40 = 600 m³/yr

Limitations to keep in mind:
• Assumes a normal age-class distribution — rarely true in practice.
• Assumes linear volume growth, whereas real growth is sigmoid.
• Best used as a first approximation, then refined with actual increment data.

Compare with AREA CONTROL (annual coupe = area ÷ rotation), which regulates by hectares rather than cubic meters and suits even-aged plantations better.',
   'Keep the two control formulas straight: area control DIVIDES area by rotation; Von Mantel DOUBLES growing stock before dividing. The factor of 2 is the giveaway.'),

  ('frm-009', 'Forest Resources Management', 'Hard', 'A watershed''s forest cover is valued for regulating streamflow and reducing sedimentation downstream. In natural resource economics, this benefit is classified as:',
   '[{"id": "a", "text": "A direct use value"}, {"id": "b", "text": "An option value"}, {"id": "c", "text": "An indirect use value (ecosystem service)"}, {"id": "d", "text": "An existence value"}]'::jsonb,
   'c', 'Watershed regulation is an indirect use value — an ecosystem service that benefits people without the resource being directly consumed or extracted.',
   'TOTAL ECONOMIC VALUE (TEV) of a forest is decomposed as:

USE VALUES
• DIRECT USE — consuming or extracting the resource: timber, rattan, fuelwood, resin, ecotourism visits.
• INDIRECT USE — ecosystem services from ecological functions: watershed regulation, flood control, erosion and sedimentation control, carbon sequestration, pollination, microclimate moderation.
• OPTION VALUE — the value of keeping the resource available for possible future use, including undiscovered pharmaceutical compounds.

NON-USE VALUES
• BEQUEST VALUE — the value of leaving the resource intact for future generations.
• EXISTENCE VALUE — the satisfaction of knowing a species or forest continues to exist, even if you will never visit or use it. The Philippine eagle is the standard example.

Why this framework matters: direct use values have market prices and are easy to count, while indirect and non-use values usually do not. Forests are therefore systematically undervalued in land-use decisions, which biases conversion toward agriculture and settlement.

Correcting that bias is the rationale for PAYMENTS FOR ECOSYSTEM SERVICES (PES) schemes, where downstream water users pay upstream communities to maintain forest cover.',
   'Sort by the question ''is anything taken from the forest?'' If nothing is extracted but people still benefit, it is indirect use. If nobody benefits materially at all, it is existence value.'),

  ('frm-010', 'Forest Resources Management', 'Medium', 'What is the primary purpose of a forest inventory?',
   '[{"id": "a", "text": "To determine boundaries for titling purposes"}, {"id": "b", "text": "To assess the market price of standing timber only"}, {"id": "c", "text": "To count the number of workers required for harvesting"}, {"id": "d", "text": "To quantify the amount, condition, and distribution of forest resources as a basis for management decisions"}]'::jsonb,
   'd', 'A forest inventory systematically quantifies the quantity, quality, condition, and spatial distribution of forest resources so that management planning and yield regulation can rest on data.',
   'A FOREST INVENTORY answers: what is out there, how much, in what condition, and where?

Typical inventory outputs:
• Volume per hectare by species and size class.
• Basal area and stand density.
• Stand table (trees per hectare by diameter class) and stock table (volume by diameter class).
• Regeneration and residual stand condition.
• Site quality and accessibility.

Sampling designs:
• SIMPLE RANDOM SAMPLING — plots located at random. Unbiased but may cluster and miss strata.
• SYSTEMATIC SAMPLING — plots on a fixed grid. Standard in Philippine practice: good spatial coverage and easy to navigate in the field.
• STRATIFIED SAMPLING — the forest is divided into homogeneous strata (by forest type, elevation, or condition) and each is sampled separately. Gives the greatest precision per unit of effort when strata are genuinely different.

The inventory feeds directly into the AAC calculation and the management plan. Without it, sustained yield is guesswork — which is precisely how many concession forests were over-cut.',
   'Stratified sampling gives the best precision for the effort when the forest is genuinely heterogeneous. That trade-off is the most commonly tested point in inventory design.'),

  ('fes-001', 'Forest Engineering & Surveying', 'Medium', 'In a closed compass traverse, the sum of the interior angles of a five-sided (pentagon) boundary should equal:',
   '[{"id": "a", "text": "540°"}, {"id": "b", "text": "360°"}, {"id": "c", "text": "720°"}, {"id": "d", "text": "900°"}]'::jsonb,
   'a', 'The sum of interior angles of any closed polygon is (n − 2) × 180°. For n = 5: (5 − 2) × 180° = 540°.',
   'The interior angle check is the first thing a forester does when closing a traverse around a forest boundary or plantation block.

Formula: Σ interior angles = (n − 2) × 180°

• Triangle (n=3): 180°
• Quadrilateral (n=4): 360°
• Pentagon (n=5): 540°
• Hexagon (n=6): 720°

The companion formula for EXTERIOR angles is Σ = (n + 2) × 180°.

In practice, measured angles will not sum exactly to the theoretical value. The difference is the ANGULAR ERROR OF CLOSURE, distributed equally among stations before computing latitudes and departures. If the error exceeds the allowable limit for the survey class, the traverse must be re-run.',
   'Do not memorize per-shape values — memorize (n − 2) × 180° and derive. The exterior counterpart is (n + 2) × 180°, a favorite distractor.'),

  ('fes-002', 'Forest Engineering & Surveying', 'Hard', 'A forest road climbs 45 meters in elevation over a slope distance of 500 meters. What is the approximate gradient of the road?',
   '[{"id": "a", "text": "4.5%"}, {"id": "b", "text": "9%"}, {"id": "c", "text": "11%"}, {"id": "d", "text": "0.9%"}]'::jsonb,
   'b', 'Gradient = (rise ÷ run) × 100 = (45 ÷ 500) × 100 = 9%. At gentle grades, slope distance closely approximates horizontal distance.',
   'Step 1: Apply the gradient formula.
• G = (vertical rise ÷ horizontal distance) × 100
• G = (45 ÷ 500) × 100 = 9%

Step 2: Check whether slope distance matters.
• True horizontal distance = √(500² − 45²) = √247,975 = 497.98 m
• Recomputed: (45 ÷ 497.98) × 100 = 9.04%

The difference is negligible, which is why field foresters treat slope distance as horizontal for grades under about 10%.

PRACTICAL CONTEXT: forest road standards cap sustained grades at 8–10%, with short pitches to 12–15%. At 9% a loaded log truck is near the limit for traction and brake heating.

Distractors: 4.5% divides by 1,000; 11% inverts the ratio; 0.9% is a decimal-place error.',
   'Gradient is rise over run as a percent. Watch the decimal: 45/500 = 0.09, and 0.09 × 100 = 9%, not 0.9%.'),

  ('fes-003', 'Forest Engineering & Surveying', 'Easy', 'What is the bearing equivalent of the azimuth 135° (measured clockwise from north)?',
   '[{"id": "a", "text": "N 45° E"}, {"id": "b", "text": "S 45° W"}, {"id": "c", "text": "S 45° E"}, {"id": "d", "text": "N 45° W"}]'::jsonb,
   'c', 'An azimuth of 135° falls in the southeast quadrant. Bearing = 180° − 135° = 45°, giving S 45° E.',
   'AZIMUTHS run 0° to 360° clockwise from north. BEARINGS are acute angles (0°–90°) measured from either north or south, toward east or west.

Conversion rules by quadrant:
• NE quadrant (0°–90°): Bearing = N (Az) E
• SE quadrant (90°–180°): Bearing = S (180° − Az) E
• SW quadrant (180°–270°): Bearing = S (Az − 180°) W
• NW quadrant (270°–360°): Bearing = N (360° − Az) W

For Az = 135°, which lies in the SE quadrant:
• Bearing = S (180° − 135°) E = S 45° E

The BACK AZIMUTH is also frequently tested:
• If Az < 180°, back azimuth = Az + 180°
• If Az ≥ 180°, back azimuth = Az − 180°
• Here: back azimuth of 135° is 315°.

The back bearing simply reverses both letters: the back bearing of S 45° E is N 45° W.',
   'Sketch the quadrant before converting. Nearly every bearing-azimuth error comes from picking the wrong quadrant, not from the arithmetic.'),

  ('fes-004', 'Forest Engineering & Surveying', 'Medium', 'In the area computation of a closed traverse, what does the ''error of closure'' represent?',
   '[{"id": "a", "text": "The difference between measured and true bearings only"}, {"id": "b", "text": "The sum of all interior angles"}, {"id": "c", "text": "The difference between plotted and actual elevation"}, {"id": "d", "text": "The linear distance between the computed final point and the actual starting point"}]'::jsonb,
   'd', 'The error of closure (linear misclosure) is the straight-line distance between the computed position of the last point and the known starting point, derived from the sums of latitudes and departures.',
   'Computing linear error of closure:

1. Compute the LATITUDE (north-south component) and DEPARTURE (east-west component) of each course:
   • Latitude = Distance × cos(Bearing)
   • Departure = Distance × sin(Bearing)

2. Sum them. In a perfect closed traverse both sums equal zero — you returned to your starting point.

3. Any residual is the closure error:
   • Error of closure = √[(ΣLat)² + (ΣDep)²]

4. Express as a RELATIVE PRECISION:
   • Relative error = Error of closure ÷ Total traverse perimeter
   • Reported as a ratio: 1/3,000, 1/5,000, and so on.

Acceptable precision depends on the survey class. Ordinary forest boundary surveys with compass and tape typically require about 1/1,000 to 1/3,000; cadastral surveys demand far better.

If the traverse is within tolerance, the error is DISTRIBUTED — most commonly by the COMPASS RULE (Bowditch), which apportions correction to each course in proportion to its length. The TRANSIT RULE is used when angles are more reliable than distances.

Area is then computed from the adjusted latitudes and departures, usually by the DMD (double meridian distance) method.',
   'Remember the sequence: latitudes and departures → closure error → relative precision → adjust by compass rule → compute area by DMD. Questions usually target one step in this chain.'),

  ('fes-005', 'Forest Engineering & Surveying', 'Medium', 'Which logging system uses an elevated cable to suspend at least one end of the log during transport, minimizing soil disturbance on steep slopes?',
   '[{"id": "a", "text": "Cable yarding (highlead or skyline)"}, {"id": "b", "text": "Ground skidding with tractor"}, {"id": "c", "text": "Animal logging (carabao)"}, {"id": "d", "text": "Manual carrying"}]'::jsonb,
   'a', 'Cable yarding suspends logs partly or fully off the ground using an elevated cable system, greatly reducing soil disturbance and erosion on steep terrain.',
   'Logging systems ranked by ground impact:

• GROUND SKIDDING (tractor, skidder) — logs are dragged along the ground. Cheapest on gentle terrain but causes the most soil compaction, displacement, and erosion. Generally unsuitable above 30–35% slope.

• CABLE YARDING — logs are pulled to a landing by cable from a spar or tower.
   – HIGHLEAD: the leading end of the log lifts; the trailing end drags. Moderate disturbance.
   – SKYLINE: a suspended cable carries a carriage; logs can be fully suspended. Minimal disturbance, higher cost and setup time.

• ANIMAL LOGGING (carabao) — low capital cost, very low impact, low volume. Still common in Philippine community-based operations and appropriate for CBFM-scale harvesting.

• AERIAL SYSTEMS (helicopter) — no ground contact at all, minimal disturbance, very high cost. Reserved for high-value timber in inaccessible or highly sensitive terrain.

The selection criteria are slope, log size and volume per hectare, yarding distance, soil erodibility, and environmental restrictions.

Under Philippine regulations, selective logging in residual dipterocarp forest requires systems that protect the residual stand, which favors cable systems and directional felling over ground skidding on steep ground.',
   'Match system to slope: ground skidding on gentle terrain, cable above about 30%, helicopter only where value justifies the cost. Slope is almost always the deciding variable in these items.'),

  ('fes-006', 'Forest Engineering & Surveying', 'Hard', 'A rectangular plantation block measures 250 m by 400 m. What is its area in hectares?',
   '[{"id": "a", "text": "1 hectare"}, {"id": "b", "text": "10 hectares"}, {"id": "c", "text": "100 hectares"}, {"id": "d", "text": "0.1 hectare"}]'::jsonb,
   'b', 'Area = 250 m × 400 m = 100,000 m². Since 1 hectare = 10,000 m², the block is 100,000 ÷ 10,000 = 10 hectares.',
   'Step 1: Compute area in square meters.
• A = 250 m × 400 m = 100,000 m²

Step 2: Convert to hectares.
• 1 ha = 10,000 m² (a square 100 m × 100 m)
• 100,000 ÷ 10,000 = 10 ha

Unit conversions every forester must know cold:
• 1 hectare = 10,000 m²
• 1 hectare = 2.471 acres
• 1 km² = 100 hectares
• 1 square meter = 10.764 square feet

PRACTICAL APPLICATION: at a 3 m × 3 m spacing, each seedling occupies 9 m², so a hectare holds 10,000 ÷ 9 = 1,111 seedlings. This 10 ha block therefore needs about 11,111 seedlings, plus 10–20% extra for replacement planting.

Spacing-to-density is worth memorizing:
• 2 m × 2 m → 2,500 trees/ha
• 2.5 m × 2.5 m → 1,600 trees/ha
• 3 m × 3 m → 1,111 trees/ha
• 4 m × 4 m → 625 trees/ha',
   'Burn 1 ha = 10,000 m² into memory, and derive seedling requirements as 10,000 ÷ (spacing²). Both appear constantly on the board.'),

  ('fes-007', 'Forest Engineering & Surveying', 'Easy', 'Which instrument measures the difference in elevation between two points using a horizontal line of sight and a graduated rod?',
   '[{"id": "a", "text": "Abney level"}, {"id": "b", "text": "Brunton compass"}, {"id": "c", "text": "Engineer''s level (dumpy level)"}, {"id": "d", "text": "Planimeter"}]'::jsonb,
   'c', 'An engineer''s or dumpy level establishes a truly horizontal line of sight, and readings taken on a graduated leveling rod at successive points give their elevation differences.',
   'Survey instruments a forester should distinguish:

• ENGINEER''S / DUMPY LEVEL — establishes a horizontal line of sight. Used with a graduated rod for differential leveling to determine elevations and run profiles for road design. Highest precision for elevation.

• ABNEY LEVEL / CLINOMETER — hand-held, measures vertical angles and slopes. The forester''s standard tool for tree heights and slope percentages. Fast, portable, less precise.

• BRUNTON COMPASS — measures magnetic bearings and, with its clinometer, vertical angles. Used for compass traverses.

• THEODOLITE / TOTAL STATION — measures horizontal and vertical angles precisely; a total station adds electronic distance measurement and internal computation.

• PLANIMETER — a mechanical instrument that measures area on a map by tracing its perimeter. Largely superseded by GIS.

DIFFERENTIAL LEVELING procedure:
1. Take a BACKSIGHT (BS) on a point of known elevation.
2. Height of Instrument: HI = Known elevation + BS
3. Take a FORESIGHT (FS) on the unknown point.
4. Elevation of the new point = HI − FS

This BS/FS bookkeeping is a standard computational item on licensure exams.',
   'Learn the elevation formulas as a pair: HI = Elevation + BS, and new Elevation = HI − FS. Backsight adds, foresight subtracts.'),

  ('fes-008', 'Forest Engineering & Surveying', 'Medium', 'In forest road design, what is the primary purpose of installing cross drains or culverts at regular intervals?',
   '[{"id": "a", "text": "To widen the roadway for two-way traffic"}, {"id": "b", "text": "To mark property boundaries"}, {"id": "c", "text": "To provide turning space for log trucks"}, {"id": "d", "text": "To remove surface water from the roadway and prevent erosion of the road prism"}]'::jsonb,
   'd', 'Cross drains and culverts discharge accumulated surface water off the road before it gains enough volume and velocity to erode the road surface, ditches, and fill slopes.',
   'WATER IS THE PRIMARY ENEMY OF A FOREST ROAD. Nearly all road failure and nearly all road-related sedimentation traces back to uncontrolled water.

Drainage structures:
• CROSS DRAINS / CULVERTS — carry water from the inside ditch across and under the road. Spacing tightens as grade steepens, because water on a steeper grade accumulates erosive energy faster.
• DITCHES — collect water along the cut slope and route it to the nearest cross drain.
• OUTSLOPING / INSLOPING / CROWNING — shapes the running surface so water sheds sideways rather than running down the wheel tracks.
• WATER BARS — shallow diagonal berms, standard on temporary and skid roads.
• BROAD-BASED DIPS — a gentle reversal in grade that drains the surface while remaining driveable at speed.

Why this matters beyond the road: sediment from poorly drained forest roads is typically the LARGEST single source of stream sedimentation in a logging operation, exceeding the harvest units themselves. Road drainage is therefore a water quality issue and a fisheries issue, not merely a maintenance one.

Design rule of thumb: culvert spacing decreases as grade increases — a 10% grade needs far more frequent drainage than a 3% grade.',
   'Anchor on the principle ''get water off the road as fast as possible, as often as possible.'' Steeper grade always means closer drain spacing.'),

  ('fes-009', 'Forest Engineering & Surveying', 'Hard', 'Using a clinometer from 20 m horizontal distance, a forester reads +58% to the treetop and −5% to the base. What is the total tree height?',
   '[{"id": "a", "text": "12.6 m"}, {"id": "b", "text": "10.6 m"}, {"id": "c", "text": "11.6 m"}, {"id": "d", "text": "13.6 m"}]'::jsonb,
   'a', 'Height above eye = 0.58 × 20 = 11.6 m. Height below eye = 0.05 × 20 = 1.0 m. Total = 11.6 + 1.0 = 12.6 m.',
   'PERCENT-SCALE CLINOMETER METHOD — the standard field technique for tree height.

The percent scale reads directly as rise over run × 100, so:
• Height component = (reading ÷ 100) × horizontal distance

Step 1: Height from eye level to the top.
• (58 ÷ 100) × 20 m = 11.6 m

Step 2: Height from eye level down to the base.
• (5 ÷ 100) × 20 m = 1.0 m

Step 3: Combine. The base reading is NEGATIVE, meaning the tree base sits below eye level, so that segment must be ADDED to reach the true base.
• Total height = 11.6 + 1.0 = 12.6 m

THE SIGN RULE — the single most tested point here:
• Readings of OPPOSITE sign (top positive, base negative): ADD the absolute values. You are standing above the base.
• Readings of the SAME sign (both positive, looking up a slope at a tree above you): SUBTRACT. The lower reading measures ground you must not count.

Field cautions:
• The horizontal distance must be horizontal, not slope distance — correct it on sloping ground.
• Stand at roughly one tree length away for the best accuracy.
• Sight the true top, not a leaning branch tip.',
   'The whole item turns on the sign rule: opposite signs add, same signs subtract. Sketch the tree and your eye level before computing and you will never get it backwards.'),

  ('fes-010', 'Forest Engineering & Surveying', 'Medium', 'What does GIS stand for, and what is its principal function in forest management?',
   '[{"id": "a", "text": "Global Inventory System — counting trees by satellite"}, {"id": "b", "text": "Geographic Information System — capturing, storing, analyzing, and displaying spatially referenced data"}, {"id": "c", "text": "Ground Instrument Survey — field measurement of boundaries"}, {"id": "d", "text": "Growth Increment Statistics — modeling stand yield"}]'::jsonb,
   'b', 'A Geographic Information System captures, stores, manipulates, analyzes, and displays spatially referenced data, allowing foresters to overlay and analyze layers such as forest cover, slope, soils, and tenure boundaries.',
   'A GIS integrates spatial data into LAYERS that can be overlaid and analyzed together.

Typical forestry layers:
• Forest cover and land classification
• Elevation, slope, and aspect (from a digital elevation model)
• Soils and geology
• Streams, watersheds, and buffer zones
• Tenure boundaries: CBFMA, IFMA, protected areas, ancestral domains
• Roads and infrastructure

Characteristic forestry analyses:
• Delineating slopes 18% and above under PD 705 by classifying a DEM.
• Generating riparian buffer zones around streams.
• Identifying areas that are simultaneously steep, deforested, and inside a critical watershed to prioritize reforestation.
• Computing harvest block areas and planning road alignments.
• Detecting forest cover change between dates.

RELATED TECHNOLOGIES — distinguish carefully, as exams pair them:
• GPS/GNSS — determines POSITION in the field. A data collection tool.
• REMOTE SENSING — acquires data from satellite or aerial sensors without contact. A data SOURCE.
• GIS — STORES and ANALYZES the spatial data those tools produce.

The clean distinction: GPS locates, remote sensing observes, GIS analyzes.',
   'Keep the trio straight — GPS locates, remote sensing observes, GIS analyzes. Board items routinely offer all three as options for the same question.'),

  ('wsf-001', 'Wood Science & Forest Products', 'Medium', 'What is the fiber saturation point (FSP) of most wood species, and what happens to the wood below this moisture content?',
   '[{"id": "a", "text": "Around 12% MC; the wood begins to absorb free water"}, {"id": "b", "text": "Around 30% MC; the wood begins to swell and lose strength"}, {"id": "c", "text": "Around 30% MC; the wood begins to shrink and gain strength"}, {"id": "d", "text": "Around 50% MC; dimensional change stops entirely"}]'::jsonb,
   'c', 'The fiber saturation point is approximately 30% moisture content. Below the FSP, bound water leaves the cell walls, causing the wood to shrink and its strength properties to increase.',
   'Wood holds moisture in two forms:
• FREE WATER — liquid water in the cell lumens.
• BOUND WATER — water chemically held within the cell walls.

The FIBER SATURATION POINT (~30% MC, varying 28–32% by species) is where all free water has evaporated but the cell walls remain fully saturated.

Above FSP:
• Only free water is lost.
• No dimensional change.
• No change in mechanical strength.

Below FSP:
• Bound water leaves the cell walls.
• The wood SHRINKS.
• Strength properties INCREASE.

This is why lumber must be seasoned to its equilibrium moisture content (about 12–15% in the Philippines) before use — all shrinkage and warping happens below the FSP.',
   'Remember: ''Above FSP, nothing changes; below FSP, everything changes.'' Shrinkage and strength gain both begin only after crossing 30% MC going down.'),

  ('wsf-002', 'Wood Science & Forest Products', 'Easy', 'Which part of the tree trunk consists of dead cells that no longer conduct sap but provide structural support and are typically darker in color?',
   '[{"id": "a", "text": "Sapwood"}, {"id": "b", "text": "Cambium"}, {"id": "c", "text": "Phloem"}, {"id": "d", "text": "Heartwood"}]'::jsonb,
   'd', 'Heartwood is the inner, darker core of dead cells that has ceased conducting sap. It provides mechanical support and is usually more durable due to accumulated extractives.',
   'From the outside of the trunk inward:

1. BARK — outer protective layer.
2. PHLOEM (inner bark) — conducts food DOWNWARD from the leaves.
3. CAMBIUM — a single layer of living, dividing cells producing phloem outward and xylem inward. All diameter growth happens here.
4. SAPWOOD (outer xylem) — living, lighter, conducts water and minerals UPWARD.
5. HEARTWOOD (inner xylem) — dead cells, darker, no longer conducts sap. Extractives (tannins, resins, oils) make it resistant to decay and insects.

This is why heartwood commands a higher price: narra, molave, and yakal heartwood are prized for the durability those extractives provide.',
   'Girdling kills a tree because it severs the phloem and cambium — not the heartwood, which is already dead. Exams love this connection.'),

  ('wsf-003', 'Wood Science & Forest Products', 'Medium', 'Wood shrinks unequally in different directions. Which direction shows the GREATEST shrinkage?',
   '[{"id": "a", "text": "Tangential (parallel to growth rings)"}, {"id": "b", "text": "Longitudinal (along the grain)"}, {"id": "c", "text": "Radial (along the rays)"}, {"id": "d", "text": "All directions shrink equally"}]'::jsonb,
   'a', 'Tangential shrinkage is greatest — roughly twice radial shrinkage — while longitudinal shrinkage is negligible. This anisotropy causes most seasoning defects.',
   'ANISOTROPIC SHRINKAGE — typical magnitudes from green to oven-dry:

• TANGENTIAL (parallel to growth rings): 6–12% — GREATEST
• RADIAL (along the rays, pith to bark): 3–6% — about half of tangential
• LONGITUDINAL (along the grain): 0.1–0.2% — negligible

The approximate T:R:L ratio is 2 : 1 : 0.

WHY tangential exceeds radial: the ray cells run radially and act as restraining straps, physically resisting shrinkage in that direction. Differences in earlywood and latewood behavior contribute as well.

CONSEQUENCES — this single fact explains most seasoning defects:
• CUPPING — a flat-sawn board curves away from the bark side, because the face nearer the bark has more tangential character and shrinks more.
• DIAMOND-SHAPED distortion in squares cut off-center.
• A round cross-section drying into an oval.
• CHECKS and SPLITS from differential stress between the drying shell and the wetter core.

PRACTICAL APPLICATION: QUARTER-SAWN lumber, cut so the rings run roughly perpendicular to the face, is far more dimensionally stable in width than FLAT-SAWN (plain-sawn) lumber. It costs more and yields less per log, but it is what you specify for flooring and fine joinery.',
   'Fix the ratio T : R : L ≈ 2 : 1 : 0 in memory. It explains cupping, checking, and why quarter-sawn lumber is worth the premium.'),

  ('wsf-004', 'Wood Science & Forest Products', 'Hard', 'A wood sample weighs 60 g in its current condition and 48 g after oven-drying to constant weight. What is its moisture content on an oven-dry basis?',
   '[{"id": "a", "text": "20%"}, {"id": "b", "text": "25%"}, {"id": "c", "text": "12%"}, {"id": "d", "text": "80%"}]'::jsonb,
   'b', 'MC = [(wet weight − oven-dry weight) ÷ oven-dry weight] × 100 = [(60 − 48) ÷ 48] × 100 = 25%.',
   'MOISTURE CONTENT, OVEN-DRY BASIS — the standard in wood science.

Formula: MC% = [(Wwet − Wod) ÷ Wod] × 100

Step 1: Find the weight of water.
• 60 g − 48 g = 12 g of water

Step 2: Divide by the OVEN-DRY weight, not the wet weight.
• 12 ÷ 48 = 0.25

Step 3: Convert to percent.
• 0.25 × 100 = 25%

THE CLASSIC ERROR: dividing by the wet weight gives 12 ÷ 60 = 20%, the wet-basis figure offered among the choices. That basis is used, used in the pulp and biomass industries but NOT in wood science and NOT what a board exam means by moisture content unless it says so explicitly.

Note the consequence of the oven-dry basis: MC can exceed 100%. A freshly felled tree holding more water than dry substance might read 150% MC, which is perfectly valid — there is simply one and a half times as much water as wood.

OVEN-DRY procedure: dry at 103 ± 2°C until the weight stops changing.

Reference values:
• Green wood: 30% to over 200%
• Fiber saturation point: ~30%
• Air-dry in the Philippines: 12–15%
• Kiln-dry for furniture: 8–12%',
   'Always divide by the OVEN-DRY weight. The wet-basis answer is deliberately planted as a distractor in nearly every version of this question.'),

  ('wsf-005', 'Wood Science & Forest Products', 'Medium', 'Which wood product is manufactured by bonding thin veneer sheets with adjacent layers oriented at right angles to each other?',
   '[{"id": "a", "text": "Particleboard"}, {"id": "b", "text": "Medium-density fiberboard (MDF)"}, {"id": "c", "text": "Plywood"}, {"id": "d", "text": "Oriented strand board (OSB)"}]'::jsonb,
   'c', 'Plywood is made of thin veneer plies glued with the grain of each layer perpendicular to the adjacent ones, which balances the panel and greatly reduces dimensional movement.',
   'WOOD-BASED PANEL PRODUCTS, by the raw material used:

• PLYWOOD — VENEER sheets peeled from a log on a rotary lathe, glued in cross-laminated layers. Always an ODD number of plies so the panel is balanced about its centerline and does not warp. Cross-lamination equalizes strength in both directions and suppresses the tangential shrinkage problem.

• VENEER — the thin sheet itself, peeled (rotary-cut) or sliced. Philippine mills historically produced large volumes from dipterocarps such as Lauan.

• PARTICLEBOARD — wood PARTICLES and chips bonded with resin under heat and pressure. Uses mill residues and small material. Low cost, low moisture resistance.

• MDF — wood FIBERS refined and bonded. Very uniform and smooth, excellent for machining and painting, heavy, poor moisture resistance.

• OSB — large oriented STRANDS in cross-directional layers. Structural, common as sheathing.

• LVL (laminated veneer lumber) — veneers glued with grain all PARALLEL, unlike plywood. A structural member, not a panel.

• GLULAM — dimension lumber laminated face to face for large structural beams.

The distinguishing question for panel products is always: what is the raw unit — veneer, strand, particle, or fiber?',
   'Classify panels by raw unit: veneer (plywood, LVL), strands (OSB), particles (particleboard), fibers (MDF). And remember plywood always has an odd ply count.'),

  ('wsf-006', 'Wood Science & Forest Products', 'Easy', 'What is the main chemical component of wood that provides rigidity by cementing the cellulose fibers together?',
   '[{"id": "a", "text": "Cellulose"}, {"id": "b", "text": "Hemicellulose"}, {"id": "c", "text": "Extractives"}, {"id": "d", "text": "Lignin"}]'::jsonb,
   'd', 'Lignin is the amorphous polymer that encrusts and cements the cellulose fibers together, providing rigidity and compressive strength to the cell wall.',
   'CHEMICAL COMPOSITION OF WOOD (oven-dry basis):

• CELLULOSE (40–50%) — a linear glucose polymer forming the microfibrils. Provides TENSILE strength. The target component in pulp and paper.

• HEMICELLULOSE (20–30%) — branched, shorter polymers of mixed sugars. Acts as a matrix bonding cellulose to lignin. More readily hydrolyzed and the first component to degrade with heat.

• LIGNIN (20–30%) — a complex three-dimensional aromatic polymer. Cements fibers together, confers RIGIDITY and compressive strength, and provides resistance to microbial attack. Higher in softwoods (25–35%) than hardwoods (18–25%).

• EXTRACTIVES (1–10%) — tannins, resins, oils, gums, waxes. Not structural, but they determine color, odor, natural DURABILITY, and often complicate gluing and finishing. Heartwood durability in narra and molave comes from these.

• ASH (<1%) — inorganic mineral matter.

A useful analogy: cellulose is the steel reinforcing bar, lignin the concrete around it. Steel takes tension, concrete takes compression — precisely the division of labor in a wood cell wall.

WHY IT MATTERS IN PULPING: chemical pulping exists to DISSOLVE AND REMOVE LIGNIN while preserving cellulose fibers. The kraft process uses sodium hydroxide and sodium sulfide to do exactly this. Residual lignin is what yellows newsprint with age.',
   'Use the reinforced-concrete analogy: cellulose = rebar (tension), lignin = concrete (compression and rigidity). Also remember pulping = removing lignin.'),

  ('wsf-007', 'Wood Science & Forest Products', 'Medium', 'Which seasoning method uses controlled temperature, humidity, and air circulation in an enclosed chamber to dry lumber rapidly and to a precise moisture content?',
   '[{"id": "a", "text": "Kiln drying"}, {"id": "b", "text": "Air drying"}, {"id": "c", "text": "Solar drying"}, {"id": "d", "text": "Boiling"}]'::jsonb,
   'a', 'Kiln drying dries lumber in an enclosed chamber under controlled temperature, relative humidity, and air circulation, achieving a precise target moisture content in days rather than months.',
   'SEASONING METHODS compared:

• AIR DRYING — lumber stacked with stickers under a roof, exposed to ambient air.
   – Cost: very low. Energy: none.
   – Time: months. A 25 mm board takes roughly 2–4 months in Philippine conditions.
   – Floor: cannot go below the local equilibrium moisture content, about 12–15% in the humid Philippines.
   – Risk: fungal stain and insect attack during the long exposure.

• KILN DRYING — controlled chamber.
   – Time: days to a few weeks.
   – Precision: any target MC, including the 8–12% required for furniture and export.
   – Sterilization: kiln temperatures kill insects, larvae, and fungi — a phytosanitary requirement for export packaging.
   – Cost: high capital and energy.

• SOLAR DRYING — a greenhouse-type chamber using solar gain. A middle path: faster than air drying, cheaper than a kiln. Well suited to small Philippine operations.

STICKERING is essential in every method: uniform stickers, correctly aligned in vertical columns, at 40–60 cm spacing. Misaligned stickers cause permanent sag and warp.

WHY SEASONING IS MANDATORY: all shrinkage occurs below the fiber saturation point. Wood used green will shrink in service — joints open, floors gap, furniture racks apart. Drying to the equilibrium moisture content of the service environment BEFORE fabrication is the only remedy.

DRYING DEFECTS: checks and splits, casehardening (a dried shell in tension over a wet core), honeycombing (internal checks from over-fast drying), collapse, warp in its several forms — cup, bow, crook, twist.',
   'Kiln drying is the only method that reaches below the local equilibrium moisture content and the only one that sterilizes. Those two advantages answer most comparison questions.'),

  ('wsf-008', 'Wood Science & Forest Products', 'Hard', 'Which Philippine hardwood group, comprising species such as Red Lauan, White Lauan, and Tanguile, is marketed internationally under the trade name ''Philippine Mahogany''?',
   '[{"id": "a", "text": "The molave group"}, {"id": "b", "text": "The dipterocarp (lauan) group"}, {"id": "c", "text": "The pine group"}, {"id": "d", "text": "The mangrove group"}]'::jsonb,
   'b', 'The lauans and related dipterocarps — Red Lauan, White Lauan, Tanguile, Almon, Bagtikan, Mayapis — are traded internationally as ''Philippine Mahogany,'' although they are not true mahoganies.',
   'The DIPTEROCARPACEAE dominate Philippine lowland forest and formed the entire basis of the country''s timber export industry.

Major commercial dipterocarps:
• RED LAUAN (Shorea negrosensis) — reddish, the premium of the group.
• WHITE LAUAN (Shorea contorta) — pale, widely used.
• TANGUILE (Shorea polysperma)
• ALMON, BAGTIKAN, MAYAPIS — the rest of the lauan complex.
• APITONG (Dipterocarpus grandiflorus) — harder, used for truck flooring and heavy construction.
• YAKAL and GUIJO (Shorea spp.) — the heavy structural timbers of the family.

The name ''PHILIPPINE MAHOGANY'' is a TRADE name, not a botanical one. True mahogany is Swietenia, family Meliaceae — an entirely different family. The dipterocarps merely resemble it in color and working properties. This distinction is a standard exam item.

Distinguish the OTHER Philippine timber groups:
• PREMIUM HARDWOODS — Narra (Pterocarpus indicus, the national tree), Molave (Vitex parviflora), Ipil, Kamagong, Tindalo, Akle. Extremely durable, now heavily restricted.
• SOFTWOOD — Benguet pine (Pinus kesiya), the only significant native softwood.
• PLANTATION SPECIES — Gmelina, Falcata, Mangium, Mahogany (introduced Swietenia macrophylla), Bagras.

CONSERVATION STATUS: nearly all native dipterocarps are now IUCN-listed as threatened, and the 2011 total log ban in natural and residual forests under EO 23 ended legal harvesting of natural-forest dipterocarps. Legal supply now comes from plantations and imports.',
   '''Philippine Mahogany'' is a trade name for dipterocarps and is NOT true mahogany (Swietenia, Meliaceae). Examiners test this false-cognate pairing repeatedly.'),

  ('wsf-009', 'Wood Science & Forest Products', 'Medium', 'What is the primary objective of wood preservative treatment?',
   '[{"id": "a", "text": "To increase the wood''s mechanical strength"}, {"id": "b", "text": "To reduce the wood''s weight for easier handling"}, {"id": "c", "text": "To protect the wood against decay fungi, insects, and marine borers, extending its service life"}, {"id": "d", "text": "To eliminate shrinkage and swelling permanently"}]'::jsonb,
   'c', 'Preservative treatment introduces toxic or repellent chemicals into the wood to protect it from biological agents — decay fungi, termites, powder-post beetles, and marine borers — thereby extending service life.',
   'WHY TREAT: untreated non-durable wood in ground contact in the tropics may fail within 1–3 years. Properly treated, the same wood can serve 25–40 years. The Philippine climate — warm, humid, and heavily populated with termites — makes this among the most aggressive decay environments in the world.

WHAT IT DOES NOT DO — the source of the distractors:
• Does NOT increase strength. Some processes slightly reduce it.
• Does NOT reduce weight; treatment adds weight.
• Does NOT stop shrinking and swelling. Only dimensional stabilization treatments such as acetylation address that, and they are a different class of process.

TREATMENT PROCESSES:

PRESSURE PROCESSES — deepest, most reliable penetration, used for utility poles, marine piling, and structural members.
• Full-cell (Bethell) — maximum retention, for severe exposure.
• Empty-cell (Rueping, Lowry) — deep penetration with less preservative.

NON-PRESSURE PROCESSES — cheaper, shallower.
• Hot-and-cold bath, soaking, brushing, spraying.
• SAP DISPLACEMENT (Boucherie) — preservative is pushed through a freshly felled green pole by hydrostatic pressure, displacing the sap. Appropriate for rural and community-scale treatment of bamboo and small poles, and worth knowing for Philippine practice.

PRESERVATIVES:
• Waterborne — CCA (increasingly restricted), ACQ, copper azole. Clean, paintable.
• Oilborne — creosote, pentachlorophenol. For poles, crossties, marine work. Not paintable.

CRITICAL POINT: SAPWOOD treats readily; HEARTWOOD resists penetration almost entirely. Treatment specifications are therefore written around sapwood penetration, and incising is used to help treat refractory species.',
   'Preservation extends SERVICE LIFE — it does not add strength, reduce weight, or stop shrinkage. Distractors in these items are almost always one of those three false claims.'),

  ('wsf-010', 'Wood Science & Forest Products', 'Easy', 'Which non-timber forest product is tapped from Agathis philippinensis (almaciga) and used in varnishes, paints, and linoleum?',
   '[{"id": "a", "text": "Rattan"}, {"id": "b", "text": "Bamboo shoots"}, {"id": "c", "text": "Tanbark"}, {"id": "d", "text": "Almaciga resin (Manila copal)"}]'::jsonb,
   'd', 'Almaciga resin, traded as Manila copal, is tapped from Agathis philippinensis and used in varnishes, lacquers, paints, linoleum, and incense.',
   'NON-TIMBER FOREST PRODUCTS (NTFPs) are central to upland livelihoods and to CBFM economics, and they receive steady exam attention.

MAJOR PHILIPPINE NTFPs:

• ALMACIGA RESIN (Manila copal) — tapped from Agathis philippinensis, a conifer of higher-elevation forest. Used in varnish, lacquer, paint, linoleum, and incense. A significant export and a major income source for indigenous communities, notably in Palawan. Over-tapping and improper tapping wounds kill trees, so DENR regulates tapping technique and rest periods.

• RATTAN — climbing palms, chiefly Calamus spp. The raw material of the Philippine furniture export industry. Harvested from natural forest; supply has declined sharply with forest loss.

• BAMBOO — Kawayan tinik, Bolo, Giant bamboo. Construction, furniture, handicraft, engineered bamboo panels, and edible shoots. Fast-growing and increasingly promoted as a timber substitute.

• TANBARK — bark rich in tannins for leather tanning, historically from mangrove species.

• NIPA (Nypa fruticans) — thatch shingles from the leaves, and sap tapped for vinegar and alcohol.

• HONEY, resins, gums, medicinal plants, wild fruits, and edible ferns.

WHY NTFPs MATTER IN POLICY: they can be harvested WITHOUT felling the tree, which aligns household income with keeping the forest standing. That alignment is why NTFP development is written into CBFM strategy and why permits for NTFP collection are structured differently from timber cutting permits.',
   'Learn the source species with the product: almaciga → resin, Calamus → rattan, Nypa → thatch and sap. Board items usually give one and ask for the other.'),

  ('sfp-001', 'Social Forestry & Forest Policy', 'Easy', 'Under Presidential Decree No. 705 (Revised Forestry Reform Code of the Philippines), lands with a slope of what percentage or more are classified as permanent forest or forest reserves and may not be released for agriculture?',
   '[{"id": "a", "text": "18% and above"}, {"id": "b", "text": "25% and above"}, {"id": "c", "text": "50% and above"}, {"id": "d", "text": "12% and above"}]'::jsonb,
   'a', 'PD 705 sets the 18% slope line: land 18% in slope or steeper is classified as permanent forest and cannot be released for agricultural purposes.',
   'PD 705 (1975) is the foundational forestry statute of the Philippines, and the 18% slope rule is among its most heavily tested provisions.

Key provisions:
• Lands 18% in slope or above — permanent forest / forest reserve, not alienable and disposable.
• Lands below 18% slope — may be classified as alienable and disposable after proper survey and land classification.
• Exception: lands already covered by titles or approved public land applications before the decree.
• Lands 50% in slope or above, and mossy forests above 1,000 m elevation — declared needing strict protection.

The rationale is erosion control. Steep slopes cleared for cultivation lose topsoil rapidly, silt downstream waterways, and trigger landslides.',
   'Fix three numbers for PD 705: 18% slope, 50% slope, 1,000 m elevation. They appear in nearly every board exam.'),

  ('sfp-002', 'Social Forestry & Forest Policy', 'Medium', 'What is the tenurial instrument issued by the DENR to organized upland communities under the Community-Based Forest Management (CBFM) Program?',
   '[{"id": "a", "text": "Timber License Agreement (TLA)"}, {"id": "b", "text": "Community-Based Forest Management Agreement (CBFMA)"}, {"id": "c", "text": "Integrated Forest Management Agreement (IFMA)"}, {"id": "d", "text": "Certificate of Ancestral Domain Title (CADT)"}]'::jsonb,
   'b', 'The CBFMA is a 25-year, renewable-for-another-25-years production-sharing agreement between the DENR and an organized upland community (a People''s Organization).',
   'Executive Order No. 263 (1995) adopted CBFM as the national strategy for sustainable forestry and social justice in the uplands.

CBFMA essentials:
• Holder: a People''s Organization (PO) — not an individual, not a corporation.
• Term: 25 years, renewable for another 25.
• Grants the right to occupy, develop, utilize, and manage a defined forestland area.
• Requires a Community Resource Management Framework (CRMF) and annual work plans approved by the DENR.

Distinguish the other instruments:
• TLA — granted to corporations for logging natural forest. Largely phased out.
• IFMA — 25-year production-sharing agreement with a corporation or individual, typically for plantation development.
• CADT — issued by the NCIP (not the DENR) under IPRA (RA 8371), recognizing indigenous peoples'' ownership of ancestral domains.

The discriminator is WHO holds it: PO → CBFMA, corporation → IFMA/TLA, ICC/IP → CADT.',
   'Match holder to instrument. ''Organized community'' or ''People''s Organization'' means CBFMA; ''indigenous peoples'' switches both the instrument and the agency to CADT and NCIP.'),

  ('sfp-003', 'Social Forestry & Forest Policy', 'Medium', 'Republic Act No. 7586 established which system for the conservation of biologically important areas in the Philippines?',
   '[{"id": "a", "text": "The Integrated Social Forestry Program"}, {"id": "b", "text": "The Community-Based Forest Management Program"}, {"id": "c", "text": "The National Integrated Protected Areas System (NIPAS)"}, {"id": "d", "text": "The National Greening Program"}]'::jsonb,
   'c', 'RA 7586, the NIPAS Act of 1992, established the National Integrated Protected Areas System — the framework for classifying and managing the country''s protected areas.',
   'RA 7586 (NIPAS Act, 1992), later expanded by RA 11038 (E-NIPAS Act, 2018), is the backbone of Philippine protected area law.

PROTECTED AREA CATEGORIES under NIPAS:
• Strict Nature Reserve
• Natural Park
• Natural Monument
• Wildlife Sanctuary
• Protected Landscapes and Seascapes
• Resource Reserve
• Natural Biotic Areas

KEY MECHANISMS:
• PAMB (Protected Area Management Board) — the multi-sector governing body for each protected area. Includes DENR, LGUs, NGOs, and indigenous and local community representatives. Its composition is a favorite exam item.
• BUFFER ZONES — peripheral areas providing added protection.
• IPAF (Integrated Protected Areas Fund) — a trust fund financed partly by user fees, retained for protected area management.
• Recognition of ancestral domain rights and tenured migrant rights within protected areas.

OTHER MAJOR ENVIRONMENTAL STATUTES to keep distinct:
• PD 705 — Revised Forestry Code.
• RA 9147 — Wildlife Resources Conservation and Protection Act.
• RA 8371 — IPRA, ancestral domains.
• RA 7942 — Philippine Mining Act.
• PD 1586 — Environmental Impact Statement System.
• RA 9729 — Climate Change Act.
• EO 23 (2011) — moratorium on logging in natural and residual forests.
• EO 26 (2011) — National Greening Program.',
   'Memorize the statute numbers as pairs — RA 7586 NIPAS, RA 9147 Wildlife, RA 8371 IPRA, PD 705 Forestry Code. Exams ask by number as often as by name.'),

  ('sfp-004', 'Social Forestry & Forest Policy', 'Hard', 'Under RA 8371 (IPRA), which body issues the Certificate of Ancestral Domain Title (CADT)?',
   '[{"id": "a", "text": "Department of Environment and Natural Resources"}, {"id": "b", "text": "Land Registration Authority"}, {"id": "c", "text": "Department of Agrarian Reform"}, {"id": "d", "text": "National Commission on Indigenous Peoples (NCIP)"}]'::jsonb,
   'd', 'The National Commission on Indigenous Peoples, created under RA 8371, has the authority to identify, delineate, and issue Certificates of Ancestral Domain Title.',
   'RA 8371, the INDIGENOUS PEOPLES'' RIGHTS ACT of 1997, recognizes that ancestral domains held under native title were never part of the public domain — a legal principle that overturns the presumption underlying most forestland classification.

NCIP FUNCTIONS:
• Identification and delineation of ancestral domains and lands.
• Issuance of CADT (ancestral domain, communal) and CALT (ancestral land, individual or clan).
• Administration of the FREE AND PRIOR INFORMED CONSENT (FPIC) process.
• Protection of indigenous cultural communities'' rights.

FPIC is the provision most relevant to practicing foresters. Any project affecting an ancestral domain — logging, plantation, mining, road, energy, even reforestation — requires the community''s free and prior informed consent, obtained through their own customary decision-making processes and documented through the NCIP. Proceeding without it invalidates the permit.

THE JURISDICTIONAL OVERLAP: ancestral domains frequently sit inside classified forestland or even inside NIPAS protected areas. This creates genuine tension between the DENR''s jurisdiction under PD 705 and NIPAS, and the NCIP''s under IPRA. Current practice requires joint DENR-NCIP coordination, and an ADSDPP (Ancestral Domain Sustainable Development and Protection Plan) is the community''s own management plan for the domain.

RIGHTS CONFERRED by a CADT: ownership, the right to develop and manage resources, the right to stay in the territory, the right to resolve conflicts by customary law, and the right to FPIC.',
   'Watch the issuing agency in the options — NCIP for CADT, DENR for CBFMA and IFMA. Swapping the agency is the standard distractor in tenure questions.'),

  ('sfp-005', 'Social Forestry & Forest Policy', 'Medium', 'Executive Order No. 23, series of 2011, declared what policy regarding Philippine forests?',
   '[{"id": "a", "text": "A moratorium on the cutting and harvesting of timber in natural and residual forests"}, {"id": "b", "text": "The privatization of all forest plantations"}, {"id": "c", "text": "The transfer of forest management to local government units"}, {"id": "d", "text": "The opening of protected areas to mining"}]'::jsonb,
   'a', 'EO 23 (2011) declared a nationwide moratorium on the cutting and harvesting of timber in natural and residual forests, and created the Anti-Illegal Logging Task Force.',
   'EO 23, s. 2011 — the TOTAL LOG BAN.

What it did:
• Declared a moratorium on cutting and harvesting timber in NATURAL and RESIDUAL forests nationwide.
• Created the ANTI-ILLEGAL LOGGING TASK FORCE (DENR, DILG, AFP, PNP).
• Suspended and cancelled affected logging permits.
• Directed the DENR to close and shut down sawmills and wood processing plants that could not prove a legal supply of raw material.

What it did NOT cover — a heavily tested exception:
• PLANTATION forests remain harvestable. Timber from IFMAs, tree farms, and private plantations may still be cut under permit.
• The policy intent is to shift the industry''s raw material base from natural forest to plantations.

WHY IT WAS ISSUED: the catastrophic flooding and landslides attributed to denudation, culminating in a series of deadly typhoon disasters, made unregulated logging politically untenable. Philippine forest cover had fallen from roughly 70% at the start of the twentieth century to under 25%.

ITS COMPANION: EO 26, s. 2011 launched the NATIONAL GREENING PROGRAM (NGP), targeting 1.5 billion seedlings over 1.5 million hectares from 2011 to 2016, later extended as the Expanded NGP to 2028. EO 23 stops the cutting; EO 26 restores the cover. Board questions frequently pair them.

CRITICISMS worth knowing: the ban reduced legal domestic supply, increased imports and illegal logging pressure, and the NGP has faced documented issues with seedling survival rates and species selection.',
   'Learn EO 23 and EO 26 together — one bans cutting in natural forest, the other launches the National Greening Program, both in 2011. And remember plantations are exempt from the ban.'),

  ('sfp-006', 'Social Forestry & Forest Policy', 'Easy', 'What does ''agroforestry'' refer to in social forestry practice?',
   '[{"id": "a", "text": "Converting forestland entirely to agricultural crops"}, {"id": "b", "text": "The deliberate integration of trees with agricultural crops and/or livestock on the same land unit"}, {"id": "c", "text": "Planting only fruit trees in a forest reserve"}, {"id": "d", "text": "The mechanized farming of forest plantations"}]'::jsonb,
   'b', 'Agroforestry is a land use system that deliberately integrates woody perennials with agricultural crops and/or livestock on the same land management unit, in a spatial arrangement or temporal sequence.',
   'AGROFORESTRY combines trees with crops or animals to produce ecological and economic interactions between the components. The key word is DELIBERATE — the mixture is designed, not accidental.

MAJOR SYSTEMS:
• AGRISILVICULTURE — trees + crops.
• SILVOPASTORAL — trees + pasture and livestock.
• AGROSILVOPASTORAL — trees + crops + livestock.

PRACTICES COMMON IN THE PHILIPPINES:
• SALT (Sloping Agricultural Land Technology) — contour hedgerows of nitrogen-fixing shrubs alternating with crop strips on slopes. Developed at the Mindanao Baptist Rural Life Center and a standard Philippine exam item.
• ALLEY CROPPING — crops grown in alleys between hedgerows, with prunings applied as green manure and mulch.
• MULTISTOREY SYSTEMS — coconut over coffee or cacao over root crops, exploiting vertical light stratification.
• HOME GARDENS — highly diverse multi-layer plots around the dwelling.
• BOUNDARY PLANTING and WINDBREAKS.

BENEFITS:
• Erosion control on sloping land, which is why it is the standard alternative to kaingin.
• Nitrogen fixation and nutrient cycling from deep tree roots.
• Diversified income and staggered harvests, reducing household risk.
• Fuelwood, fodder, and fruit alongside the staple crop.
• Carbon sequestration on farmland.

POLICY ROLE: agroforestry is the technical backbone of the Integrated Social Forestry Program and of CBFM livelihood components. It reconciles the need of upland families to farm with the need to keep steep land under permanent cover.',
   'SALT and contour hedgerows are the Philippine-specific agroforestry answers examiners look for. Learn SALT by name and by what it does.'),

  ('sfp-007', 'Social Forestry & Forest Policy', 'Hard', 'In the Environmental Impact Statement System (PD 1586), what document is issued to a project proponent signifying that the project has complied with EIS requirements?',
   '[{"id": "a", "text": "Certificate of Non-Coverage (CNC)"}, {"id": "b", "text": "Environmental Impact Statement (EIS)"}, {"id": "c", "text": "Environmental Compliance Certificate (ECC)"}, {"id": "d", "text": "Initial Environmental Examination (IEE)"}]'::jsonb,
   'c', 'The Environmental Compliance Certificate is the document issued by the DENR-EMB certifying that a proposed project will not cause significant negative environmental impact and that the proponent has complied with EIS System requirements.',
   'PD 1586 (1978) established the PHILIPPINE ENVIRONMENTAL IMPACT STATEMENT SYSTEM.

THE DOCUMENTS — distinguish them carefully:

• EIS (Environmental Impact Statement) — the comprehensive STUDY prepared by the proponent for environmentally critical projects. Describes the project, baseline conditions, predicted impacts, mitigation measures, and the Environmental Management Plan.

• IEE (Initial Environmental Examination) — a shorter study for projects of lesser impact, or those in environmentally critical areas but not themselves critical projects.

• ECC (Environmental Compliance Certificate) — the DECISION DOCUMENT issued by the DENR-EMB after review. It certifies compliance and carries binding conditions the proponent must observe. This is what a proponent must hold before construction.

• CNC (Certificate of Non-Coverage) — issued when a project falls OUTSIDE the coverage of the EIS System entirely.

The clean distinction: the EIS and IEE are STUDIES SUBMITTED; the ECC and CNC are CERTIFICATES ISSUED. Confusing study with certificate is the trap.

COVERAGE — two categories require an ECC:
1. ENVIRONMENTALLY CRITICAL PROJECTS (ECPs) — heavy industry, resource extractive industry including LOGGING and MINING, infrastructure such as dams and major roads, golf courses.
2. Projects located in ENVIRONMENTALLY CRITICAL AREAS (ECAs) — protected areas, watersheds, habitats of endangered species, areas of unique history or culture, prone-to-disaster areas, recharge zones, mangroves, and coral reefs.

FORESTRY RELEVANCE: an IFMA plantation development, a forest road, or a timber harvesting operation of significant scale requires an ECC. The Environmental Management Plan within the EIS becomes an enforceable obligation through the ECC''s conditions, and violations can suspend or cancel the certificate.',
   'Sort by function: EIS and IEE are studies you SUBMIT; ECC and CNC are certificates the EMB ISSUES. That one distinction resolves most items on this system.'),

  ('sfp-008', 'Social Forestry & Forest Policy', 'Medium', 'What is the primary aim of the Integrated Social Forestry Program (ISFP) established under Letter of Instruction No. 1260?',
   '[{"id": "a", "text": "To remove all occupants from forestlands"}, {"id": "b", "text": "To convert forestlands into agricultural settlements"}, {"id": "c", "text": "To privatize forest plantations"}, {"id": "d", "text": "To grant qualified upland occupants tenurial security while enlisting them in forest rehabilitation"}]'::jsonb,
   'd', 'The ISFP grants qualified forest occupants tenurial security through Certificates of Stewardship Contract, making them partners in rehabilitating and protecting the land they occupy.',
   'LOI 1260 (1982) established the INTEGRATED SOCIAL FORESTRY PROGRAM, a decisive shift in Philippine forest policy.

THE POLICY REVERSAL: earlier forest administration treated upland occupants as squatters to be evicted. Decades of failed eviction demonstrated that people without secure tenure have no reason to invest in the land — they farm for immediate return and move on. The ISFP inverted the logic: give occupants secure, long-term rights, and their interest aligns with keeping the land productive and forested.

INSTRUMENTS:
• CSC (Certificate of Stewardship Contract) — issued to an INDIVIDUAL or family occupant. 25 years, renewable for 25.
• CFSC (Certificate of Community Forest Stewardship) — issued to a COMMUNITY or association.

OBLIGATIONS attached to the tenure: the holder must practice soil conservation, plant and maintain trees, protect the area from fire and illegal cutting, and follow an approved development plan. Tenure is conditional on performance.

WHERE IT LED: the ISFP, along with other community programs, was consolidated under EO 263 (1995) into COMMUNITY-BASED FOREST MANAGEMENT as the single national strategy, with CBFMA as the unifying instrument. Existing CSCs remained valid and many were integrated into CBFMA areas.

THE UNDERLYING PRINCIPLE, which is what exams actually test: TENURIAL SECURITY IS A PREREQUISITE FOR CONSERVATION INVESTMENT. A farmer who may be evicted next year will not plant a tree that yields in fifteen. This insight drives the entire social forestry framework.',
   'Connect the instruments to their scale: CSC is individual, CFSC is community, CBFMA superseded both as the unified strategy under EO 263.'),

  ('sfp-009', 'Social Forestry & Forest Policy', 'Easy', 'Which Philippine law provides for the conservation and protection of wildlife resources and their habitats?',
   '[{"id": "a", "text": "RA 9147"}, {"id": "b", "text": "RA 7586"}, {"id": "c", "text": "RA 8371"}, {"id": "d", "text": "RA 7942"}]'::jsonb,
   'a', 'RA 9147, the Wildlife Resources Conservation and Protection Act of 2001, governs the conservation and protection of wildlife species and their habitats.',
   'RA 9147 (2001) is the principal wildlife statute.

SCOPE AND JURISDICTION:
• DENR — terrestrial wildlife, all plants, and turtles and tortoises.
• Department of Agriculture — aquatic wildlife.
• PCSD — wildlife within Palawan, under RA 7611 (SEP Law).

CATEGORIES OF THREATENED SPECIES:
• Critically Endangered
• Endangered
• Vulnerable
• Other Threatened Species

PROHIBITED ACTS include killing and destroying wildlife, inflicting injury, trading, collecting, and destroying critical habitat. Penalties scale with the conservation status of the species — killing a critically endangered species carries the heaviest penalty, and the Philippine eagle is the standard illustration.

PERMITS: a Wildlife Farm Permit, Wildlife Collector''s Permit, or Certificate of Wildlife Registration is required to possess, breed, or collect wildlife legally.

BIOPROSPECTING: RA 9147 requires prior informed consent and benefit-sharing for the collection of biological resources for research — the Philippine implementation of Convention on Biological Diversity principles.

DISTINGUISH THE STATUTE NUMBERS, which is what the question is really testing:
• RA 7586 — NIPAS Act, protected AREAS.
• RA 9147 — Wildlife Act, protected SPECIES.
• RA 8371 — IPRA, indigenous peoples'' rights.
• RA 7942 — Philippine Mining Act.
• RA 9072 — National Caves and Cave Resources Management Act.
• RA 9175 — Chainsaw Act, regulating the sale and use of chainsaws.

The clean pairing to remember: NIPAS protects PLACES, RA 9147 protects SPECIES.',
   'Pair them as places versus species: RA 7586 NIPAS for protected areas, RA 9147 for wildlife. Also learn RA 9175, the Chainsaw Act — a frequent surprise item.'),

  ('sfp-010', 'Social Forestry & Forest Policy', 'Hard', 'In the context of climate change mitigation, what does REDD+ stand for?',
   '[{"id": "a", "text": "Rapid Emission Detection and Data Development"}, {"id": "b", "text": "Reducing Emissions from Deforestation and Forest Degradation, plus conservation, sustainable management, and enhancement of carbon stocks"}, {"id": "c", "text": "Reforestation and Ecological Development for Developing Districts"}, {"id": "d", "text": "Regional Environmental Data and Disclosure system"}]'::jsonb,
   'b', 'REDD+ is Reducing Emissions from Deforestation and Forest Degradation, with the ''+'' covering conservation of carbon stocks, sustainable forest management, and enhancement of forest carbon stocks.',
   'REDD+ is a UNFCCC mechanism that pays developing countries for verified reductions in forest-related emissions.

THE COMPONENTS:
• RED — reducing emissions from DEFORESTATION (forest converted to another land use).
• REDD — adds FOREST DEGRADATION (forest that remains forest but loses carbon density).
• REDD+ — the plus adds three activities: CONSERVATION of existing carbon stocks, SUSTAINABLE MANAGEMENT of forests, and ENHANCEMENT of forest carbon stocks through restoration.

WHY FORESTS: land use change and forestry account for a substantial share of global greenhouse gas emissions, and standing tropical forest is among the largest terrestrial carbon reservoirs. Avoiding emissions from deforestation is comparatively low-cost mitigation.

THE WARSAW FRAMEWORK requires four elements before a country can receive results-based payments:
1. A national REDD+ strategy or action plan.
2. A national FOREST REFERENCE EMISSION LEVEL — the baseline against which reductions are measured.
3. A national forest MONITORING SYSTEM (MRV: measurement, reporting, verification).
4. A SAFEGUARDS information system.

SAFEGUARDS matter especially in the Philippine context: respect for the rights of indigenous peoples and local communities, full and effective participation, and no conversion of natural forest. FPIC under IPRA applies directly to REDD+ projects on ancestral domains.

TECHNICAL CONCEPTS examiners target:
• ADDITIONALITY — the reduction must not have happened anyway under business as usual.
• LEAKAGE — deforestation merely displaced elsewhere does not count as a reduction.
• PERMANENCE — carbon stored must stay stored; a typhoon or fire can reverse it.

PHILIPPINE LINKAGE: the Philippine National REDD+ Strategy sits alongside RA 9729 (Climate Change Act), the National Climate Change Action Plan, and the country''s Nationally Determined Contribution. Forest carbon connects directly to CBFM, since community tenure is the practical vehicle for delivering safeguards and benefit-sharing.',
   'Learn the three additions behind the ''+'' — conservation, sustainable management, enhancement of stocks — and the trio additionality, leakage, permanence. Both sets are standard exam targets.'),

  ('fbm-001', 'Forest Biometrics & Mensuration', 'Medium', 'A standing dipterocarp has a DBH of 60 cm and a merchantable height of 18 m. Using V = (π/4) × D² × H × F with a form factor of 0.70, what is its approximate merchantable volume?',
   '[{"id": "a", "text": "5.09 m³"}, {"id": "b", "text": "2.49 m³"}, {"id": "c", "text": "3.56 m³"}, {"id": "d", "text": "7.27 m³"}]'::jsonb,
   'c', 'Basal area = (π/4) × (0.60 m)² = 0.2827 m². Volume = 0.2827 × 18 m × 0.70 = 3.56 m³.',
   'Step 1: Convert DBH to meters.
• 60 cm = 0.60 m

Step 2: Compute basal area.
• BA = (π/4) × D² = 0.7854 × 0.36 = 0.2827 m²

Step 3: Multiply by height and form factor.
• V = 0.2827 × 18 × 0.70 = 3.562 m³

The form factor corrects for taper — a tree bole is not a perfect cylinder. A form factor of 0.70 means the tree holds about 70% of the volume of a cylinder of the same DBH and height.

Distractors: 5.09 m³ omits the form factor; 2.49 m³ uses 0.49; 7.27 m³ mistakes 0.60 m for the radius.',
   'Memorize BA = 0.7854 × D² for D in meters, and always convert DBH from centimeters first. That conversion causes more errors than the formula.'),

  ('fbm-002', 'Forest Biometrics & Mensuration', 'Medium', 'Using a wedge prism with a basal area factor (BAF) of 4 m²/ha, a forester counts 9 ''in'' trees at a sample point. What is the estimated basal area per hectare?',
   '[{"id": "a", "text": "2.25 m²/ha"}, {"id": "b", "text": "13 m²/ha"}, {"id": "c", "text": "9 m²/ha"}, {"id": "d", "text": "36 m²/ha"}]'::jsonb,
   'd', 'In point sampling, basal area per hectare = tree count × BAF = 9 × 4 = 36 m²/ha.',
   'POINT SAMPLING (variable-radius, prism, or Bitterlich sampling) is the fastest field method for estimating basal area.

Procedure:
1. Stand at the sample point.
2. Sweep a full 360° with the prism.
3. Count every tree whose image is not fully offset — the ''in'' trees.
4. Multiply: BA/ha = count × BAF.

Here: 9 × 4 = 36 m²/ha.

Why it works: the prism selects trees with probability proportional to basal area. A large tree is ''in'' from much farther away than a small one, so each counted tree represents exactly BAF square meters per hectare regardless of size. No diameter measurement and no plot boundary are needed.

Borderline trees are the main source of field error — measure the limiting distance, or count every other borderline tree.',
   'The method reduces to count × BAF. Given a BAF and a tree count, it is a one-step multiplication — do not overthink it.'),

  ('fbm-003', 'Forest Biometrics & Mensuration', 'Easy', 'At what height above ground is diameter at breast height (DBH) conventionally measured in the Philippines and most of the metric world?',
   '[{"id": "a", "text": "1.30 m"}, {"id": "b", "text": "1.0 m"}, {"id": "c", "text": "1.50 m"}, {"id": "d", "text": "2.0 m"}]'::jsonb,
   'a', 'DBH is measured at 1.30 meters above ground level in the Philippines and in metric-system countries generally. The United States uses 4.5 feet, which is 1.37 m.',
   'DBH is the single most-measured variable in forestry, so its conventions are strictly standardized.

STANDARD HEIGHT:
• Metric countries, including the Philippines: 1.30 m above ground.
• United States and other imperial users: 4.5 ft = 1.37 m.

SPECIAL CASES — these are the exam targets:
• SLOPING GROUND — measure from the UPHILL side of the tree.
• LEANING TREE — measure perpendicular to the lean, along the axis of the stem, on the underside.
• BUTTRESSED TREES (common in dipterocarps) — measure ABOVE the buttress, typically 30 cm above where the buttress ends, and record the measurement height.
• FORKED BELOW 1.30 m — treat as two separate trees.
• FORKED ABOVE 1.30 m — one tree, one measurement.
• SWELLING OR DEFECT AT 1.30 m — measure above and below the abnormality and average.

INSTRUMENTS:
• DIAMETER TAPE (d-tape) — wrapped around the stem, graduated in π units so it reads diameter directly from circumference. Assumes a circular cross-section, so it slightly overestimates on irregular stems. Most common and most repeatable.
• CALIPER — measures directly. On non-circular stems take two perpendicular readings and average.
• BILTMORE STICK — quick and approximate.

WHY DBH DOMINATES: it is quick, cheap, highly repeatable, and correlates strongly with volume, biomass, and crown dimensions. Nearly every volume equation and biomass model takes DBH as its primary predictor.',
   'Learn the special cases, not just the number. Uphill side on slopes and above the buttress on dipterocarps are the two most frequently tested field rules.'),

  ('fbm-004', 'Forest Biometrics & Mensuration', 'Hard', 'A circular sample plot has a radius of 11.28 m. What is its area, and what expansion factor converts per-plot counts to per-hectare values?',
   '[{"id": "a", "text": "0.01 ha; multiply by 100"}, {"id": "b", "text": "0.04 ha; multiply by 25"}, {"id": "c", "text": "0.10 ha; multiply by 10"}, {"id": "d", "text": "0.05 ha; multiply by 20"}]'::jsonb,
   'b', 'Area = π × 11.28² = 399.7 m² ≈ 400 m² = 0.04 ha. The expansion factor is 1 ÷ 0.04 = 25.',
   'Step 1: Compute the plot area.
• A = πr² = 3.1416 × (11.28)² = 3.1416 × 127.24 = 399.7 m²
• ≈ 400 m²

Step 2: Convert to hectares.
• 400 ÷ 10,000 = 0.04 ha

Step 3: Derive the expansion factor.
• EF = 1 ha ÷ plot size in ha = 1 ÷ 0.04 = 25

Application: if you tally 18 trees in this plot, the estimate is 18 × 25 = 450 trees per hectare. The same factor expands plot basal area and plot volume to per-hectare figures.

STANDARD CIRCULAR PLOT RADII worth memorizing:
• r = 5.64 m → 100 m² = 0.01 ha → EF 100
• r = 11.28 m → 400 m² = 0.04 ha → EF 25
• r = 12.62 m → 500 m² = 0.05 ha → EF 20
• r = 17.84 m → 1,000 m² = 0.10 ha → EF 10

Note the pattern: radius scales with the square root of area, so quadrupling the area doubles the radius. 5.64 m and 11.28 m differ by exactly a factor of 2, and their areas by a factor of 4.

FIELD NOTE: on sloping ground, plot radius must be corrected because the plot is defined on the HORIZONTAL projection. Slope distance for the radius must be lengthened by 1/cos(slope angle), or the plot will be undersized and density overestimated.',
   'Memorize the radius-to-area pairs, especially 5.64 m for 0.01 ha and 11.28 m for 0.04 ha. Then the expansion factor is just 1 divided by plot size in hectares.'),

  ('fbm-005', 'Forest Biometrics & Mensuration', 'Medium', 'Which volume formula computes log volume using only the cross-sectional area at the MIDPOINT of the log multiplied by its length?',
   '[{"id": "a", "text": "Smalian''s formula"}, {"id": "b", "text": "Newton''s formula"}, {"id": "c", "text": "Huber''s formula"}, {"id": "d", "text": "Doyle rule"}]'::jsonb,
   'c', 'Huber''s formula uses the cross-sectional area at the log''s midpoint times its length: V = Am × L. It requires only one measurement but that measurement must be at the middle.',
   'THE THREE CLASSICAL LOG VOLUME FORMULAS:

• HUBER''S FORMULA: V = Am × L
  Uses only the MIDPOINT cross-sectional area. One measurement. Accurate for logs that approximate a paraboloid, but unusable when the log is decked or in a pile where the midpoint cannot be reached.

• SMALIAN''S FORMULA: V = [(Ab + At) ÷ 2] × L
  Averages the areas of the two ENDS. Two measurements, both at accessible ends — which is why it is the practical choice for decked logs and the most widely used in the field. It OVERESTIMATES volume for strongly tapering logs and butt logs with flare.

• NEWTON''S FORMULA: V = [(Ab + 4Am + At) ÷ 6] × L
  Uses both ends AND the midpoint. Three measurements. The most accurate of the three for any shape of solid of revolution, since it is Simpson''s rule applied to the taper curve. Rarely used in routine work because of the extra effort.

ACCURACY RANKING: Newton > Huber > Smalian for typical tapering logs.

PRACTICALITY RANKING: Smalian > Huber > Newton.

The field compromise is to shorten log sections — taper matters less over a short length, so Smalian applied to 2 m sections approaches Newton''s accuracy on the full log.

LOG RULES are a separate category and are estimates of SAWN LUMBER yield, not geometric volume:
• DOYLE RULE — underestimates small logs badly.
• SCRIBNER RULE — diagram-based.
• INTERNATIONAL 1/4-INCH RULE — the most accurate, includes a taper allowance.',
   'Tie each formula to its measurement points: Huber = middle only, Smalian = both ends, Newton = ends plus middle. And remember log RULES estimate lumber yield, not volume.'),

  ('fbm-006', 'Forest Biometrics & Mensuration', 'Easy', 'What does the ''form factor'' of a tree express?',
   '[{"id": "a", "text": "The ratio of crown width to tree height"}, {"id": "b", "text": "The proportion of heartwood to sapwood"}, {"id": "c", "text": "The ratio of merchantable height to total height"}, {"id": "d", "text": "The ratio of actual stem volume to the volume of a cylinder of the same diameter and height"}]'::jsonb,
   'd', 'The form factor is the ratio of the actual volume of the tree stem to the volume of a cylinder having the same diameter at breast height and the same height.',
   'FORM FACTOR (f) = Actual stem volume ÷ Cylinder volume

A tree bole tapers from base to tip, so it always holds less wood than a cylinder of the same DBH and height. The form factor quantifies that shortfall in a single multiplier.

TYPICAL VALUES:
• 0.40–0.50 — strongly tapering, open-grown trees with large crowns.
• 0.50–0.70 — most forest-grown trees.
• 0.70–0.80 — well-formed, closely spaced plantation stems with small crowns and cylindrical boles.

WHAT INFLUENCES FORM:
• STAND DENSITY — the dominant factor. Closely grown trees are drawn up, self-prune, and develop straight cylindrical boles with HIGH form factors. Open-grown trees put on a broad crown and heavy taper, giving LOW form factors. This is a primary silvicultural argument for adequate initial stocking.
• Species and genetics.
• Site quality and age.

RELATED MEASURES:
• FORM QUOTIENT — the ratio of a diameter higher up the stem to DBH. Girard form class, the ratio of the diameter inside bark at the top of the first 16-foot log to DBH, is the classic example.
• TAPER — the rate of diameter decrease per unit of height, commonly expressed in cm/m.

USE IN VOLUME ESTIMATION: V = BA × H × f. This is why a form factor appears in nearly every quick standing-volume computation, and why using a species-appropriate value matters — applying 0.70 to an open-grown tree overestimates its volume substantially.',
   'Connect form factor to silviculture: dense stands produce high form factors and cylindrical boles, open growth produces low ones. That link is tested as often as the definition.'),

  ('fbm-007', 'Forest Biometrics & Mensuration', 'Hard', 'In a systematic inventory, a forester establishes 0.05 ha plots and records an average of 22 trees per plot. What is the estimated stand density per hectare?',
   '[{"id": "a", "text": "440 trees/ha"}, {"id": "b", "text": "110 trees/ha"}, {"id": "c", "text": "1.1 trees/ha"}, {"id": "d", "text": "220 trees/ha"}]'::jsonb,
   'a', 'Expansion factor = 1 ÷ 0.05 = 20. Density = 22 trees/plot × 20 = 440 trees per hectare.',
   'Step 1: Compute the expansion factor.
• EF = 1 ha ÷ 0.05 ha = 20

Step 2: Multiply the per-plot average.
• 22 × 20 = 440 trees/ha

Common error: DIVIDING by the expansion factor gives 22 ÷ 20 = 1.1, one of the offered choices. Always ask whether the answer is sensible — a hectare containing one tree is not a forest. Plot values must always scale UP to per-hectare values, because a plot is smaller than a hectare.

SANITY BENCHMARKS for stand density:
• Newly planted plantation at 3 × 3 m: 1,111 trees/ha
• After first thinning: 600–800 trees/ha
• Mature plantation before final harvest: 300–500 trees/ha
• Natural dipterocarp forest, trees above 10 cm DBH: 400–600 trees/ha

440 trees/ha sits comfortably in the plausible range, confirming the answer.

WHY SYSTEMATIC SAMPLING: plots on a fixed grid give even spatial coverage across the tract, are simple to lay out and navigate with compass and GPS, and avoid the clustering that random plot locations can produce. The theoretical caution is that a systematic grid can align with a periodic pattern in the stand — planting rows, or ridge-and-valley topography — and bias the estimate. In practice this is rare in forestry, and systematic sampling is the Philippine standard.

The number of plots needed depends on the variability of the stand and the precision required, usually expressed as an allowable error of ±10% or ±20% at 95% confidence.',
   'Plot values always scale UP. If your per-hectare answer is smaller than your per-plot count, you divided when you should have multiplied.'),

  ('fbm-008', 'Forest Biometrics & Mensuration', 'Medium', 'What does a stand table present?',
   '[{"id": "a", "text": "The total volume of the stand by species only"}, {"id": "b", "text": "The number of trees per hectare by diameter class"}, {"id": "c", "text": "The monetary value of the standing timber"}, {"id": "d", "text": "The species composition as a percentage"}]'::jsonb,
   'b', 'A stand table shows the number of trees per unit area distributed by diameter class, and often by species. The corresponding volume distribution is called a stock table.',
   'THE PAIRED TABLES — a standard exam distinction:

• STAND TABLE — NUMBER of trees per hectare by diameter class.
• STOCK TABLE — VOLUME per hectare by diameter class.

Both may be further broken down by species. The mnemonic: stand = stems (count), stock = stock of wood (volume).

EXAMPLE STAND TABLE:
  DBH class (cm)   Trees/ha
  10–20            180
  20–30            120
  30–40             70
  40–50             40
  50+                20
  TOTAL            430

WHAT THE SHAPE OF THE DISTRIBUTION TELLS YOU — this is the real analytical value:

• REVERSE-J CURVE (many small stems, progressively fewer large ones) — indicates an UNEVEN-AGED stand with continuous recruitment. The stand is sustaining itself. This is the target structure under a selection system, and the ratio between successive classes is the q-factor used to set the residual stand.

• BELL-SHAPED / NORMAL CURVE — indicates an EVEN-AGED stand. All trees originated at once, and diameter variation reflects differences in vigor and competitive position rather than age. Typical of plantations and of stands regenerated by clearcutting or shelterwood.

• BROKEN or IRREGULAR distribution with a missing middle — signals disrupted recruitment, often from past high-grading, grazing, or fire.

MANAGEMENT USE: the stand table drives the marking guide. Comparing the actual distribution against the desired residual distribution tells the forester exactly how many trees to remove from each diameter class.',
   'Stand = stems, stock = volume. And read the curve: reverse-J means uneven-aged and self-sustaining, bell-shaped means even-aged.'),

  ('fbm-009', 'Forest Biometrics & Mensuration', 'Medium', 'If a stand has 500 trees per hectare with an average DBH of 20 cm, what is the approximate basal area per hectare?',
   '[{"id": "a", "text": "31.4 m²/ha"}, {"id": "b", "text": "7.85 m²/ha"}, {"id": "c", "text": "15.7 m²/ha"}, {"id": "d", "text": "62.8 m²/ha"}]'::jsonb,
   'c', 'Basal area of one tree = 0.7854 × (0.20 m)² = 0.0314 m². For 500 trees: 0.0314 × 500 = 15.7 m²/ha.',
   'Step 1: Basal area of the average tree.
• BA = (π/4) × D² = 0.7854 × (0.20)² = 0.7854 × 0.04 = 0.03142 m²

Step 2: Multiply by the number of trees.
• 0.03142 × 500 = 15.71 m²/ha

A CAUTION worth understanding: using the average DBH to compute stand basal area is an APPROXIMATION and is not strictly correct, because basal area is a function of D². The correct approach uses the QUADRATIC MEAN DIAMETER (Dg) — the diameter of the tree of average basal area:

• Dg = √(ΣD² ÷ n)

Because squaring weights large trees disproportionately, Dg is ALWAYS greater than or equal to the arithmetic mean diameter, with equality only when all trees are identical. Computing basal area from the arithmetic mean therefore UNDERESTIMATES the true stand basal area, and the error grows as the stand becomes more variable in size.

Board exams generally intend the simple calculation unless they supply individual diameters, but knowing why it is approximate distinguishes a strong answer.

BENCHMARK VALUES for basal area:
• Well-stocked tropical plantation: 20–35 m²/ha
• Mature natural dipterocarp forest: 25–40 m²/ha
• Understocked or heavily logged stand: below 15 m²/ha

At 15.7 m²/ha, this stand of many small trees is on the low side — consistent with a young stand yet to occupy the site fully.',
   'Compute basal area per tree first, then multiply by density. And remember quadratic mean diameter is always ≥ arithmetic mean, so the simple method underestimates.'),

  ('fbm-010', 'Forest Biometrics & Mensuration', 'Hard', 'A plantation stand had a volume of 180 m³/ha at age 14 and 205 m³/ha at age 15. What is the current annual increment (CAI) for that year?',
   '[{"id": "a", "text": "13.7 m³/ha/yr"}, {"id": "b", "text": "12.9 m³/ha/yr"}, {"id": "c", "text": "192.5 m³/ha/yr"}, {"id": "d", "text": "25 m³/ha/yr"}]'::jsonb,
   'd', 'CAI is the volume growth in a single year: 205 − 180 = 25 m³/ha/yr.',
   'Step 1: Apply the definition.
• CAI = V(age 15) − V(age 14) = 205 − 180 = 25 m³/ha/yr

CAI is a simple SUBTRACTION between consecutive years. MAI is a DIVISION of cumulative volume by age. Confusing the two operations is the single most common error on this topic.

Check the other quantities the distractors represent:
• MAI at age 15 = 205 ÷ 15 = 13.7 m³/ha/yr
• MAI at age 14 = 180 ÷ 14 = 12.9 m³/ha/yr
• Mean of the two volumes = 192.5 m³/ha

Each of these appears among the choices, and each represents a different misreading of the question.

THE CAI-MAI RELATIONSHIP — the concept the question is really probing:

• Early in the stand''s life, CAI rises steeply and exceeds MAI. Because each year''s growth is above the running average, it pulls MAI UPWARD.
• CAI peaks and then declines as the stand ages and competition, senescence, and mortality take hold.
• CAI eventually falls to equal MAI. At that exact point MAI reaches its MAXIMUM — the CULMINATION OF MEAN ANNUAL INCREMENT.
• After the crossover, CAI is below MAI and drags it downward.

Here: CAI is 25 while MAI is 13.7. CAI still substantially exceeds MAI, so the stand has NOT yet reached the culmination of MAI. Under a volume-maximizing objective, it is not yet financially or biologically ready for harvest.

This crossover defines the BIOLOGICAL ROTATION AGE. Recall that the FINANCIAL rotation, from the Faustmann criterion, is shorter — discounting pushes the harvest earlier.',
   'CAI subtracts consecutive volumes, MAI divides by age. When CAI still exceeds MAI, the stand has not yet reached the rotation of maximum volume production.')
on conflict (id) do update set
  subject              = excluded.subject,
  difficulty           = excluded.difficulty,
  question             = excluded.question,
  options              = excluded.options,
  correct_answer_id    = excluded.correct_answer_id,
  explanation          = excluded.explanation,
  detailed_explanation = excluded.detailed_explanation,
  tips                 = excluded.tips,
  updated_at           = now();

-- ----------------------------------------------------------------------------
-- Verification — expect 60 total, 10 per subject.
-- ----------------------------------------------------------------------------
select subject, count(*) as questions
from public.questions
group by subject
order by subject;

select difficulty, count(*) as questions
from public.questions
group by difficulty
order by difficulty;
