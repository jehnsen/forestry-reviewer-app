# Component Reference Guide

## UI Components (`components/ui/`)

### Button
**File:** `components/ui/button.tsx`

**Usage:**
```tsx
import Button from "@/components/ui/button";

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

**Props:**
- `variant`: "primary" | "secondary" | "outline" | "ghost" | "danger"
- `size`: "sm" | "md" | "lg"
- All standard HTML button attributes

**Variants:**
- `primary` - Blue background, white text (main actions)
- `secondary` - Slate background, dark text (secondary actions)
- `outline` - Border only (alternative actions)
- `ghost` - Transparent, hover effect (subtle actions)
- `danger` - Red background (destructive actions)

---

### Card
**File:** `components/ui/card.tsx`

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

<Card variant="elevated">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content goes here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

**Components:**
- `Card` - Container with border and shadow
- `CardHeader` - Top section with padding
- `CardTitle` - Styled heading (h3)
- `CardContent` - Main content area
- `CardFooter` - Bottom section with border-top

**Card Variants:**
- `default` - Basic shadow and border
- `elevated` - Enhanced shadow
- `bordered` - Thicker border, no shadow

---

### Badge
**File:** `components/ui/badge.tsx`

**Usage:**
```tsx
import Badge from "@/components/ui/badge";

<Badge variant="success">Active</Badge>
```

**Props:**
- `variant`: "default" | "success" | "warning" | "error" | "info"

**Variants:**
- `default` - Slate background
- `success` - Green (emerald)
- `warning` - Orange (amber)
- `error` - Red (rose)
- `info` - Blue

---

### Input
**File:** `components/ui/input.tsx`

**Usage:**
```tsx
import Input from "@/components/ui/input";

<Input
  type="text"
  placeholder="Enter text..."
  error={hasError}
/>
```

**Props:**
- `error`: boolean - Shows error styling
- All standard HTML input attributes

**Features:**
- Focus ring (blue or red if error)
- Placeholder styling
- Disabled state

---

## Layout Components (`components/layout/`)

### Navbar
**File:** `components/layout/navbar.tsx`

**Usage:**
```tsx
import Navbar from "@/components/layout/navbar";

<Navbar />
```

**Features:**
- Sticky top positioning
- Logo with link to home
- Desktop navigation links
- Mobile hamburger menu
- CTA buttons (Sign In, Get Board Pass)
- Responsive breakpoint at md (768px)

**Client Component:** Yes (uses useState for mobile menu)

---

### Footer
**File:** `components/layout/footer.tsx`

**Usage:**
```tsx
import Footer from "@/components/layout/footer";

<Footer />
```

**Features:**
- 4-column grid on desktop
- Brand section with logo
- Product links
- Resources links
- Social media icons
- Copyright and legal links

**Client Component:** No (server component)

---

### Sidebar
**File:** `components/layout/sidebar.tsx`

**Usage:**
```tsx
import Sidebar from "@/components/layout/sidebar";

<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
```

**Props:**
- `isOpen`: boolean
- `onClose`: () => void

**Features:**
- Fixed position
- Mobile overlay backdrop
- Active route highlighting
- Navigation items: Dashboard, Practice, Mock Exam, Analytics, Settings
- Board Pass status at bottom
- Auto-close on navigation

**Client Component:** Yes (uses usePathname)

---

### DashboardLayout
**File:** `components/layout/dashboard-layout.tsx`

**Usage:**
```tsx
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function MyPage() {
  return (
    <DashboardLayout>
      <div>Your page content</div>
    </DashboardLayout>
  );
}
```

**Features:**
- Includes Sidebar component
- Mobile menu toggle button
- User profile display (top-right)
- Responsive padding
- Automatic left padding on desktop for sidebar

**Client Component:** Yes (manages sidebar state)

---

## Utility Functions (`lib/utils.ts`)

### cn()
**File:** `lib/utils.ts`

**Usage:**
```tsx
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  "more-classes"
)}>
  Content
</div>
```

**Purpose:** Merges and conditionally applies Tailwind classes

---

## Page Templates

### Public Page Template
```tsx
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function PublicPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Your content */}
      </main>

      <Footer />
    </div>
  );
}
```

### Protected Page Template
```tsx
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function ProtectedPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-slate-900">Page Title</h1>
        {/* Your content */}
      </div>
    </DashboardLayout>
  );
}
```

### Client Component Template
```tsx
"use client";

import { useState } from "react";

export default function ClientComponent() {
  const [state, setState] = useState(false);

  return (
    <div onClick={() => setState(!state)}>
      {/* Interactive content */}
    </div>
  );
}
```

---

## Common Patterns

### Stat Card
```tsx
<Card variant="elevated">
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <CardTitle className="text-sm font-medium text-slate-600">
        Label
      </CardTitle>
      <Icon className="w-5 h-5 text-green-600" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-slate-900">142</div>
    <p className="text-sm text-slate-500 mt-1">Subtitle</p>
  </CardContent>
</Card>
```

### Progress Bar
```tsx
<div>
  <div className="flex items-center justify-between mb-2">
    <span className="text-sm font-medium text-slate-700">Label</span>
    <span className="text-sm font-semibold text-green-700">76%</span>
  </div>
  <div className="w-full bg-slate-200 rounded-full h-3">
    <div
      className="bg-green-700 h-3 rounded-full transition-all"
      style={{ width: "76%" }}
    />
  </div>
</div>
```

### Icon + Text Button
```tsx
<Button>
  <Icon className="w-4 h-4 mr-2" />
  Button Text
</Button>
```

### Gradient Card
```tsx
<Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
  <CardContent className="p-6">
    {/* Content */}
  </CardContent>
</Card>
```

### Alert Card (with colored border)
```tsx
<Card variant="elevated" className="border-l-4 border-l-emerald-500">
  <CardHeader>
    <div className="flex items-center space-x-2">
      <Icon className="w-5 h-5 text-emerald-600" />
      <CardTitle>Title</CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
</Card>
```

---

## Icon Usage (Lucide React)

**Import:**
```tsx
import {
  BookOpen,
  CheckCircle,
  XCircle,
  Sparkles,
  // ... etc
} from "lucide-react";
```

**Common Icons:**
- `BookOpen` - Practice, reading
- `Target` - Goals, accuracy
- `TrendingUp` - Growth, improvement
- `CheckCircle` - Success, correct
- `XCircle` - Error, incorrect
- `Sparkles` - AI, special features
- `Calendar` - Dates, scheduling
- `BarChart3` - Analytics
- `Settings` - Configuration
- `User` - Profile
- `Menu` - Mobile menu
- `X` - Close
- `ArrowRight` / `ArrowLeft` - Navigation

---

## Styling Conventions

### Spacing Scale
- `space-y-2` - 0.5rem (8px) - Tight spacing
- `space-y-4` - 1rem (16px) - Normal spacing
- `space-y-6` - 1.5rem (24px) - Comfortable spacing
- `space-y-8` - 2rem (32px) - Section spacing

### Text Sizes
- `text-xs` - 0.75rem - Labels, captions
- `text-sm` - 0.875rem - Body small, metadata
- `text-base` - 1rem - Default body
- `text-lg` - 1.125rem - Large body, subtitles
- `text-xl` - 1.25rem - Card titles
- `text-2xl` - 1.5rem - Section headings
- `text-3xl` - 1.875rem - Page titles
- `text-4xl` - 2.25rem - Hero headings

### Shadows
- `shadow-sm` - Subtle shadow for cards
- `shadow-md` - Medium shadow for elevation
- `shadow-lg` - Strong shadow for modals/popovers

### Rounded Corners
- `rounded-md` - 0.375rem - Small elements
- `rounded-lg` - 0.5rem - Cards, buttons
- `rounded-full` - 9999px - Pills, badges, avatars

---

**Quick Reference Complete! Use this guide while building new features.**
