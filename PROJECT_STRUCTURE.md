# ForestGuro - Complete Project Structure

## File Tree

```
forestry-reviewer-app/
│
├── app/                                    # Next.js App Router
│   ├── analytics/
│   │   └── page.tsx                       # Analytics dashboard with performance tracking
│   ├── dashboard/
│   │   └── page.tsx                       # Main student dashboard
│   ├── mock-exam/
│   │   └── page.tsx                       # Mock examination interface
│   ├── practice/
│   │   ├── page.tsx                       # Practice mode subject selection
│   │   └── [id]/
│   │       └── page.tsx                   # Interactive question review (CRITICAL COMPONENT)
│   ├── settings/
│   │   └── page.tsx                       # User settings and preferences
│   ├── globals.css                         # Global CSS with Tailwind directives
│   ├── layout.tsx                          # Root layout with Inter font
│   └── page.tsx                            # Landing page
│
├── components/
│   ├── layout/
│   │   ├── dashboard-layout.tsx           # Protected dashboard layout with sidebar toggle
│   │   ├── footer.tsx                      # Site footer with links
│   │   ├── navbar.tsx                      # Public navigation with mobile menu
│   │   └── sidebar.tsx                     # Dashboard sidebar navigation
│   └── ui/
│       ├── badge.tsx                       # Badge component (5 variants)
│       ├── button.tsx                      # Button component (5 variants, 3 sizes)
│       ├── card.tsx                        # Card component with Header/Content/Footer
│       └── input.tsx                       # Input component with error states
│
├── lib/
│   ├── mock-data.ts                        # 6 sample questions + user progress data
│   ├── types.ts                            # TypeScript interfaces for Question, User, etc.
│   └── utils.ts                            # Utility functions (cn for className merging)
│
├── public/                                 # Static assets (empty for now)
│
├── .env.example                            # Environment variables template
├── .eslintrc.json                          # ESLint configuration
├── .gitignore                              # Git ignore rules
├── next.config.ts                          # Next.js configuration
├── package.json                            # Dependencies and scripts
├── postcss.config.mjs                      # PostCSS configuration for Tailwind
├── PROJECT_STRUCTURE.md                    # This file
├── README.md                               # Comprehensive project documentation
├── tailwind.config.ts                      # Tailwind configuration with custom colors
└── tsconfig.json                           # TypeScript configuration
```

## Component Hierarchy

### Public Pages
```
Landing Page (/)
├── Navbar
├── Hero Section
├── Features Section
├── Pricing Section
├── CTA Section
└── Footer
```

### Protected Pages
```
Dashboard Layout
├── Sidebar (with navigation)
├── Header (with user info)
└── Main Content Area
    ├── Dashboard (/dashboard)
    ├── Practice Mode (/practice)
    ├── Question View (/practice/[id])
    ├── Mock Exam (/mock-exam)
    ├── Analytics (/analytics)
    └── Settings (/settings)
```

## Key Features by Page

### 1. Landing Page (`app/page.tsx`)
- Hero with value proposition
- Trust indicators (2,847 passed, money-back guarantee)
- 3 feature cards (AI Tutor, Pass Assurance, Mobile)
- Pricing comparison table
- CTA section with free trial offer

### 2. Dashboard (`app/dashboard/page.tsx`)
- Welcome banner with exam countdown (45 days)
- 4 stat cards (Questions Answered, Accuracy, Days Until Exam, Study Streak)
- Progress bars by subject
- Focus area recommendation
- Quick links to Practice and Mock Exam

### 3. Practice Mode (`app/practice/page.tsx`)
- Continue last session card
- Subject selection grid
- Individual subject stats
- Mixed practice option

### 4. Question Review (`app/practice/[id]/page.tsx`) ⭐ CRITICAL
**Three-State Interface:**

**State A - Before Answer:**
- Question display with 4 options (A, B, C, D)
- Selectable option buttons
- Optional hint button
- Submit answer button
- Flag for review option

**State B - After Answer:**
- Visual feedback (green for correct, red for incorrect)
- Correct answer highlighted
- Success/failure message card
- Explanation panel appears

**State C - Explanation & AI Tutor:**
- Standard explanation text
- Detailed explanation (expandable)
- AI Chat interface
  - Input field for follow-up questions
  - Suggested questions
  - Chat history display
  - Real-time mock AI responses
- Navigation (Previous/Next buttons)

### 5. Mock Exam (`app/mock-exam/page.tsx`)
- Professional level exam card (170 questions, 3h 10m)
- Sub-professional level exam card (165 questions, 3h 5m)
- Past results access

### 6. Analytics (`app/analytics/page.tsx`)
- 7-day average accuracy (78%)
- Questions this week counter
- Study time tracking
- Subject performance chart
- Study streak calendar

### 7. Settings (`app/settings/page.tsx`)
- Profile information form
- Notification preferences
- Subscription status display
- Account security options

## Data Structure

### Question Type
```typescript
{
  id: string;
  subject: ForestrySubject; // one of the six PRC board subjects
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: { id: string; text: string; }[];
  correctAnswerId: string;
  explanation: string;
  detailedExplanation?: string;
  tips?: string;
}
```

### Mock Questions Available
1. Forest Biometrics & Mensuration (tree volume)
2. Silviculture & Forest Ecology (silvicultural systems)
3. Social Forestry & Forest Policy (PD 705)
4. Wood Science & Forest Products (fiber saturation point)
5. Forest Engineering & Surveying (closed traverse)
6. Forest Resources Management (area control)

## Design System

### Colors
- **Primary:** Blue-700 (#15803d) - Buttons, accents
- **Secondary:** Slate-100 (#f1f5f9) - Backgrounds
- **Success:** Emerald-600 - Correct answers
- **Warning:** Amber-500 - Hints, weak subjects
- **Error:** Rose-600 - Incorrect answers
- **Text:** Slate-900 (headings), Slate-600 (body)

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** Bold, various sizes (2xl-4xl)
- **Body:** Regular, base size
- **Labels:** Medium, sm size

### Component Variants

**Button:**
- primary (blue), secondary (slate), outline, ghost, danger
- sizes: sm, md, lg

**Card:**
- default, elevated (shadow), bordered

**Badge:**
- default, success, warning, error, info

## Responsive Breakpoints

- Mobile: < 768px (stacked layout)
- Tablet: 768px - 1024px
- Desktop: > 1024px (sidebar always visible)

## Interactive Features

1. **Mobile Menu Toggle:** Navbar hamburger menu
2. **Sidebar Toggle:** Dashboard mobile sidebar
3. **Answer Selection:** Click to select option
4. **Hint System:** Reveal hints before answering
5. **AI Chat:** Interactive follow-up questions
6. **Question Navigation:** Previous/Next with URL updates
7. **Subject Filtering:** Practice specific subjects

## Next Steps for Production

1. **Backend Integration:**
   - Set up database (PostgreSQL/MongoDB)
   - Implement authentication (NextAuth.js)
   - Create API routes for questions, progress, analytics

2. **AI Integration:**
   - Integrate OpenAI/Anthropic API
   - Build prompt engineering for tutor responses
   - Implement streaming responses

3. **Payment System:**
   - Stripe integration for Board Pass
   - Subscription management
   - Refund handling for guarantee

4. **Enhanced Features:**
   - Dark mode toggle
   - Offline support (PWA)
   - Social sharing
   - Referral system

5. **Testing:**
   - Unit tests for components
   - Integration tests for user flows
   - E2E tests with Playwright

## Performance Considerations

- Server Components for static content
- Client Components only where needed
- Image optimization with next/image
- Code splitting by route
- Lazy loading for heavy components

---

**Status:** ✅ Frontend Complete - Ready for Mock Testing
**Next Phase:** Backend Integration & Real AI Tutor
