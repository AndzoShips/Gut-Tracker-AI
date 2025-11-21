# Frosted-UI Migration Guide

This document outlines the migration from custom Tailwind components to Whop's Frosted-UI components for dark mode support and app store compliance.

## ✅ Completed Migrations

### Core Configuration
- ✅ `app/layout.tsx` - Added TooltipProvider and Toaster
- ✅ `tailwind.config.ts` - Updated to use Frosted-UI preset
- ✅ `app/globals.css` - Updated to import Frosted-UI styles
- ✅ `components/HomeHeader.tsx` - Migrated to Frosted-UI
- ✅ `components/MealScanModal.tsx` - Migrated to Frosted-UI Dialog
- ✅ `components/TodayFocusCard.tsx` - Migrated to Frosted-UI Card
- ✅ `components/StreakTracker.tsx` - Migrated to Frosted-UI Card
- ✅ `app/dashboard/page.tsx` - Removed custom background gradients

## 🔄 Migration Patterns

### 1. Replace Custom Buttons
**Before:**
```tsx
<button className="bg-secondary hover:bg-green-600 text-white rounded-2xl">
  Click Me
</button>
```

**After:**
```tsx
import { Button } from "@whop/frosted-ui";

<Button variant="solid" size="4">
  Click Me
</Button>
```

### 2. Replace Custom Cards
**Before:**
```tsx
<div className="rounded-2xl p-4 bg-white border border-gray-200 shadow-md">
  Content
</div>
```

**After:**
```tsx
import { Card } from "@whop/frosted-ui";

<Card>
  Content
</Card>
```

### 3. Replace Typography
**Before:**
```tsx
<h1 className="text-2xl font-bold text-gray-900">Title</h1>
<p className="text-sm text-gray-600">Description</p>
```

**After:**
```tsx
import { Text } from "@whop/frosted-ui";

<Text size="6" weight="bold">Title</Text>
<Text size="2">Description</Text>
```

### 4. Replace Layout Components
**Before:**
```tsx
<div className="flex items-center justify-between gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**After:**
```tsx
import { Flex } from "@whop/frosted-ui";

<Flex align="center" justify="between" gap="4">
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>
```

### 5. Remove Custom Colors
**Remove all:**
- `bg-white`, `bg-black`, `bg-gray-*`
- `text-black`, `text-white`, `text-gray-*`
- `dark:*` classes
- Inline `style` props with gradients
- Custom color classes like `bg-secondary`, `text-secondary`

### 6. Replace Modals
**Before:**
```tsx
<div className="fixed inset-0 bg-black/50 z-50">
  <div className="bg-white rounded-2xl p-6">
    Content
  </div>
</div>
```

**After:**
```tsx
import { Dialog, DialogContent, DialogTitle } from "@whop/frosted-ui";

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogTitle>Title</DialogTitle>
    Content
  </DialogContent>
</Dialog>
```

## 📋 Remaining Files to Migrate

### High Priority
- [ ] `components/WellnessProgressCard.tsx`
- [ ] `components/MetricCard.tsx`
- [ ] `components/DailyBriefing.tsx`
- [ ] `components/MealsList.tsx`
- [ ] `components/MealAnalysisModal.tsx`
- [ ] `components/StatCard.tsx`
- [ ] `components/MealInsightCard.tsx`

### Medium Priority
- [ ] `components/onboarding/WelcomeScreen.tsx`
- [ ] `components/onboarding/GoalScreen.tsx`
- [ ] `components/onboarding/FeelingScreen.tsx`
- [ ] `components/onboarding/CommitmentScreen.tsx`
- [ ] `components/onboarding/SummaryScreen.tsx`
- [ ] `app/onboarding/page.tsx`

### Lower Priority
- [ ] `app/meals/page.tsx`
- [ ] `app/meals/[id]/page.tsx`
- [ ] `app/login/page.tsx`
- [ ] `app/admin/users/page.tsx`
- [ ] `app/analyze/page.tsx`

## 🎨 Frosted-UI Component Reference

### Layout Components
- `Flex` - Flexbox container
- `Stack` - Vertical stack with gap
- `Box` - Generic container
- `Card` - Card container with proper theming

### Form Components
- `Button` - Button with variants (solid, soft, ghost, outline)
- `Input` - Text input
- `Select` - Dropdown select
- `IconButton` - Icon-only button

### Typography
- `Text` - Text component with size and weight props
  - `size`: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  - `weight`: "light" | "regular" | "medium" | "semibold" | "bold"

### Overlays
- `Dialog` - Modal dialog
- `DialogContent` - Dialog content wrapper
- `DialogTitle` - Dialog title
- `Toaster` - Toast notifications

## ✅ Dark Mode Checklist

After migration, verify:
- [ ] All components render correctly in light mode
- [ ] All components render correctly in dark mode
- [ ] No custom color classes remain
- [ ] No inline style gradients remain
- [ ] Text is readable in both modes
- [ ] Buttons are visible in both modes
- [ ] Cards have proper contrast in both modes
- [ ] Modals work correctly in both modes

## 🧪 Testing Theme Switching

1. The app should automatically respect system theme
2. To test manually, check browser/system dark mode settings
3. All UI should adapt seamlessly without any visual glitches

## 📝 Notes

- Keep `framer-motion` animations - they work fine with Frosted-UI
- Remove all custom gradient backgrounds
- Use Frosted-UI's semantic color system instead of custom colors
- The `secondary` color from Tailwind config should be removed - use Frosted-UI's color system instead

