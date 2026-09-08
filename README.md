# ForestGuro - Forester Licensure Exam Reviewer

An interactive, AI-powered web application for Philippine Forester Licensure Examination preparation. Built with Next.js 14+, TypeScript, and Tailwind CSS.

## Project Overview

ForestGuro is a premium forester licensure exam reviewer designed for busy government workers. It offers an affordable alternative to expensive review centers with AI-powered tutoring, personalized study plans, and unlimited practice questions.

### Design Philosophy: "Professional Trust"

- Clean, distraction-free interface optimized for long study sessions
- High readability with generous whitespace
- Professional color palette: Slate-900, Blue-700, Emerald-600, Amber-500
- Responsive design that works seamlessly on mobile and desktop

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Font:** Inter (Google Fonts)

## Features

### Landing Page
- Hero section with compelling value proposition
- Features showcase (AI Tutor, Pass Assurance, Mobile-Friendly)
- Pricing comparison (Board Pass vs Traditional Review Centers)
- Social proof and trust indicators

### Student Dashboard
- Welcome banner with exam countdown
- Performance statistics (Questions Answered, Accuracy, Study Streak)
- Progress tracking by subject
- Weak subject identification with recommendations
- Quick access to Practice Mode and Mock Exams

### Interactive Review Interface (Practice Mode)
- Split-screen layout (Desktop) / Stacked (Mobile)
- Real-time answer feedback with visual indicators
- Three-state tutor panel:
  1. **Before Answer:** Hint system
  2. **After Answer:** Correct/Incorrect feedback
  3. **Explanation Mode:** Detailed explanations + AI chat interface
- AI Tutor chat for follow-up questions
- Question flagging and navigation
- Subject-based filtering

### Mock Exams
- Full-length practice exams under timed conditions
- Professional and Sub-Professional levels
- Historical results tracking

### Analytics
- Subject performance breakdown
- 7-day accuracy trends
- Study time tracking
- Study streak monitoring

### Settings
- Profile management
- Notification preferences
- Subscription status
- Account security

## Project Structure

```
forestry-reviewer-app/
├── app/
│   ├── analytics/          # Analytics dashboard
│   ├── dashboard/          # Main student dashboard
│   ├── mock-exam/          # Mock examination interface
│   ├── practice/           # Practice mode
│   │   └── [id]/          # Individual question view
│   ├── settings/           # User settings
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── layout/             # Layout components
│   │   ├── navbar.tsx      # Public navigation
│   │   ├── footer.tsx      # Site footer
│   │   ├── sidebar.tsx     # Dashboard sidebar
│   │   └── dashboard-layout.tsx
│   └── ui/                 # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── input.tsx
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── mock-data.ts        # Sample questions and user data
│   └── utils.ts            # Utility functions
└── public/                 # Static assets

```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd forestry-reviewer-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Mock Data

The application uses realistic mock data located in `lib/mock-data.ts`:

- **12 Sample Questions** (2 per subject) covering:
  - Silviculture & Forest Ecology
  - Forest Resources Management
  - Forest Engineering & Surveying
  - Wood Science & Forest Products
  - Social Forestry & Forest Policy
  - Forest Biometrics & Mensuration

  The full 60-question bank lives in `supabase/seed_questions.sql`.

- **User Progress Data:**
  - 168 questions answered
  - 74% overall accuracy
  - 52 days until the board exam
  - Subject-wise performance tracking

## Supabase Database

The full question bank ships as SQL, ready to run against a Supabase project.

```
supabase/
├── schema.sql            # Tables, enums, indexes, RLS policies, triggers
└── seed_questions.sql    # 60 board questions (10 per subject)
```

### Running the migrations

In the Supabase SQL Editor (or with `psql`), run them in order:

```bash
psql "$DATABASE_URL" -f supabase/schema.sql
psql "$DATABASE_URL" -f supabase/seed_questions.sql
```

`schema.sql` creates:

| Table | Purpose |
|-------|---------|
| `questions` | The question bank, with options stored as JSONB |
| `profiles` | One row per authenticated user |
| `user_answers` | Every submitted answer, for analytics |
| `study_sessions` | Practice session records |

It also creates the `user_subject_accuracy` view, which reports per-subject
accuracy for the calling user.

### Notes

- **Idempotent.** `seed_questions.sql` uses `on conflict (id) do update`, so it is
  safe to re-run after editing a question — it updates rows rather than failing.
- **Validated.** A check constraint guarantees `correct_answer_id` always matches
  one of the ids in the `options` array, so a question can never be seeded with an
  unanswerable key.
- **RLS is enabled.** Questions are readable by any authenticated user; profiles,
  answers, and sessions are restricted to their owner via `auth.uid()`.
- **Balanced answer key.** The correct answer is distributed evenly across a/b/c/d
  (15 each), so the exam cannot be gamed by always guessing one letter.

### How the app reads the data

Questions are fetched **on the server** (`lib/questions.ts`) using the service role
key, which never reaches the browser — `lib/supabase/server.ts` imports
`server-only`, so the build fails if it is ever pulled into a Client Component.

This keeps the strict RLS policy on `questions` (authenticated-only) in place
without requiring visitors to log in. The `/practice` routes are marked
`force-dynamic` so they always reflect the current database rather than a
build-time snapshot.

Answer recording (`lib/answers.ts`) runs in the browser under the anon key, so RLS
applies and each visitor can only touch their own rows. Because
`user_answers.user_id` is a foreign key to `auth.users`, the app creates an
**anonymous Supabase session** per visitor. This requires *Authentication →
Providers → Anonymous sign-ins* to be enabled in the Supabase dashboard; when it
is off, answers simply are not recorded and the UI says so rather than failing.

### Progress and analytics

The dashboard and analytics pages read `public.user_subject_accuracy`, a
`security_invoker` view that aggregates the signed-in user's answers by subject.
Because it filters on `auth.uid()`, it is queried **from the browser** under the
anon key — reading it with the service role key would return every user's data.

Both pages show an empty state until the visitor answers their first question,
and a subject needs at least 3 answers before it can be flagged as the weakest,
so a single wrong answer does not skew the recommendation.

`lib/mock-data.ts` has been removed: the database is now the only source of
questions, and a parallel copy would drift out of sync.

## Key Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, features, and pricing |
| `/dashboard` | Student dashboard with stats and progress |
| `/practice` | Practice mode subject selection |
| `/practice/[id]` | Interactive question review interface |
| `/mock-exam` | Full-length mock examinations |
| `/analytics` | Detailed performance analytics |
| `/settings` | User preferences and account management |

## Design System

### Colors

```javascript
Primary: Blue-700 (#15803d)
Secondary: Slate-100 (#f1f5f9)
Success: Emerald-600
Warning: Amber-500
Error: Rose-600
Text: Slate-900
```

### Typography

- Font Family: Inter (system sans-serif fallback)
- Headings: Bold, Slate-900
- Body: Regular, Slate-600/700

### Components

All UI components are located in `components/ui/` and support:
- Multiple variants (primary, secondary, outline, ghost)
- Size options (sm, md, lg)
- Accessibility features
- Hover and focus states

## Features To Implement (Backend Integration)

Currently, the app uses mock data. Future backend integration should include:

1. **Authentication:** User registration and login
2. **Database:** Question bank, user progress, analytics
3. **AI Integration:** Real AI tutor using LLM API
4. **Payment:** Subscription management
5. **Email:** Notifications and reminders
6. **Analytics:** Advanced tracking and reporting

## Development Guidelines

### Component Patterns

- Use Client Components (`"use client"`) for interactive features
- Server Components for static content and data fetching
- Strict TypeScript typing for all props and data

### Styling Conventions

- Tailwind utility classes for all styling
- Use `cn()` utility for conditional class merging
- Maintain consistent spacing with Tailwind's spacing scale

### File Naming

- kebab-case for files and folders
- PascalCase for component names
- camelCase for functions and variables

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - All rights reserved

## Contact & Support

For questions or support, visit the application or contact: support@forestguro.ph

---

**Built with care for Filipino civil servants. Secure your permanent item this year! 🇵🇭**
