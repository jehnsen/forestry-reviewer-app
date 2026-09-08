# ForestGuro - Quick Start Guide

## Installation & Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## Page Navigation Guide

### 🏠 Landing Page
**URL:** `/`
- View the marketing homepage
- Click "Start Reviewing Now" or "Get Board Pass" to go to dashboard

### 📊 Dashboard
**URL:** `/dashboard`
- View student statistics and progress
- See board exam countdown (52 days)
- Check weakest subject (Forest Biometrics & Mensuration)
- Click "Continue Reviewing" or "Practice Mode" card

### 📚 Practice Mode
**URL:** `/practice`
- Select a subject to practice
- Or click "Continue Practice" to resume
- Or choose "Start Mixed Practice"

### ✏️ Question Review (CRITICAL - Must Test!)
**URL:** `/practice/fbm-001` (or q2, q3, q4, q5, q6)

**Test Flow:**
1. Read the question
2. Click "Show Hint" to see a hint (optional)
3. Select an answer (A, B, C, or D)
4. Click "Submit Answer"
5. View correct/incorrect feedback
6. Read the explanation
7. Type a question in the AI Tutor chat
8. Click Send or press Enter
9. View AI response
10. Click "Next Question" to continue

### 📝 Mock Exam
**URL:** `/mock-exam`
- View available mock exams
- Professional and Sub-Professional levels

### 📈 Analytics
**URL:** `/analytics`
- View performance trends
- See subject breakdown
- Check study streak

### ⚙️ Settings
**URL:** `/settings`
- Update profile information
- Manage notifications
- View subscription status

## Sample Questions Available

Navigate directly to these questions:

1. **Mensuration (tree volume):** [/practice/fbm-001](http://localhost:3000/practice/fbm-001)
2. **Silviculture (silvicultural systems):** [/practice/sil-002](http://localhost:3000/practice/sil-002)
3. **Forest Policy (PD 705 slope rule):** [/practice/sfp-001](http://localhost:3000/practice/sfp-001)
4. **Wood Science (fiber saturation point):** [/practice/wsf-001](http://localhost:3000/practice/wsf-001)
5. **Surveying (closed traverse):** [/practice/fes-001](http://localhost:3000/practice/fes-001)
6. **Forest Management (area control):** [/practice/frm-001](http://localhost:3000/practice/frm-001)
7. **Ecology (primary succession):** [/practice/sil-007](http://localhost:3000/practice/sil-007)
8. **Wood Science (heartwood):** [/practice/wsf-002](http://localhost:3000/practice/wsf-002)
9. **Social Forestry (CBFMA):** [/practice/sfp-002](http://localhost:3000/practice/sfp-002)
10. **Mensuration (prism / BAF):** [/practice/fbm-002](http://localhost:3000/practice/fbm-002)
11. **Surveying (road gradient):** [/practice/fes-002](http://localhost:3000/practice/fes-002)
12. **Forest Management (DENR mandate):** [/practice/frm-002](http://localhost:3000/practice/frm-002)

## Testing Checklist

### ✅ Responsive Design
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on desktop (> 1024px)

### ✅ Navigation
- [ ] Navbar menu (public pages)
- [ ] Navbar mobile hamburger menu
- [ ] Sidebar navigation (dashboard)
- [ ] Sidebar mobile toggle
- [ ] Question next/previous buttons

### ✅ Interactive Features
- [ ] Answer selection (click to select)
- [ ] Submit answer button
- [ ] Hint reveal
- [ ] AI chat input and send
- [ ] Flag for review
- [ ] Subject selection cards

### ✅ Visual Feedback
- [ ] Correct answer (green highlight)
- [ ] Incorrect answer (red highlight)
- [ ] Progress bars
- [ ] Loading states (if applicable)
- [ ] Hover effects on buttons/cards

## Common Development Tasks

### Add a New Question
Edit `lib/mock-data.ts`:
```typescript
{
  id: "q7",
  subject: "Math",
  difficulty: "Medium",
  question: "Your question here",
  options: [
    { id: "a", text: "Option A" },
    { id: "b", text: "Option B" },
    { id: "c", text: "Option C" },
    { id: "d", text: "Option D" },
  ],
  correctAnswerId: "a",
  explanation: "Brief explanation",
  detailedExplanation: "Detailed explanation",
  tips: "Helpful tip"
}
```

### Customize Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: "#15803d", // Change this
  }
}
```

### Add a New Page
1. Create file in `app/your-page/page.tsx`
2. Use DashboardLayout for protected pages
3. Use Navbar + Footer for public pages

## Build for Production

```bash
npm run build
npm run start
```

## Troubleshooting

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### TypeScript Errors
```bash
npm run lint
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

## Key Features to Showcase

1. **Three-State Question Interface:**
   - State A: Before answering (hint available)
   - State B: After answering (feedback)
   - State C: Explanation + AI chat

2. **Premium Design:**
   - Clean, professional aesthetics
   - Generous whitespace
   - Subtle shadows and borders
   - Smooth transitions

3. **Responsive Layout:**
   - Mobile-first design
   - Split-screen on desktop
   - Stacked on mobile

4. **Interactive Elements:**
   - Real-time answer feedback
   - AI chat simulation
   - Progress tracking
   - Subject filtering

## Need Help?

Check these files:
- [README.md](README.md) - Full documentation
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Architecture details
- `lib/types.ts` - TypeScript interfaces
- `lib/mock-data.ts` - Sample data

---

**Happy Testing! 🚀**
