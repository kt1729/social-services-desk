## 1. Types & Data Model

- [x] 1.1 Add `DayOfWeek` type, `DaySchedule` interface, and `OperatingHours` type to `src/shared/types/index.ts`
- [x] 1.2 Replace `openDays: string` and `openHours: string` with `operatingHours: OperatingHours` on the `Resource` interface
- [x] 1.3 Add `DAYS_OF_WEEK` constant array with day codes and labels to `src/shared/lib/operatingHours.ts`
- [x] 1.4 Add `createEmptySchedule()` helper that returns 7 `DaySchedule` entries all set to closed

## 2. Formatting Utilities

- [x] 2.1 Add `formatTime(time: string): string` — converts "08:00" to "8:00 AM"
- [x] 2.2 Add `formatOperatingHours(hours: OperatingHours): string[]` — groups consecutive days with same times and returns formatted lines (e.g., "Mon–Sat: 8:00 AM – 10:00 PM")
- [x] 2.3 Add unit tests for formatting utilities (all scenarios from spec: all same, weekday/weekend split, closed days, all closed)

## 3. Input Component

- [x] 3.1 Create `OperatingHoursInput` component in `src/shared/components/OperatingHoursInput.tsx` with per-day rows: day label, open/closed toggle, time pickers
- [x] 3.2 Add "Copy to all" button that copies the current row's hours to all other days
- [x] 3.3 Add unit tests for `OperatingHoursInput` (toggle open/closed, set times, copy to all)

## 4. Resource Form Integration

- [x] 4.1 Update `ResourceForm` to use `OperatingHoursInput` instead of `openDays`/`openHours` text inputs
- [x] 4.2 Save `operatingHours` array to Firestore on create and update (remove `openDays`/`openHours` from save payload)

## 5. Display Components

- [x] 5.1 Update `ResourceCard` to render formatted operating hours using `formatOperatingHours`
- [x] 5.2 Update `ResourceDetail` to render formatted operating hours
- [x] 5.3 Update `PrintResourceCard` to render formatted operating hours

## 6. Verification

- [x] 6.1 Run full test suite and fix any failures
- [x] 6.2 Verify build passes with no TypeScript errors
