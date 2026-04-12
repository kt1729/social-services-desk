## Context

Resources currently store operating hours as two plain strings — `openDays` ("Mon–Fri") and `openHours` ("9AM – 5PM"). This works for simple cases but can't express different hours per day (e.g., shorter Sunday hours) and produces inconsistent formatting across resources.

The dataset is small (3–5 volunteers, dozens of resources) and runs entirely client-side on Firebase free tier.

**Affected files:**

- `src/shared/types/index.ts` — `Resource` interface
- `src/features/resources/ResourceForm.tsx` — form input
- `src/features/resources/ResourceCard.tsx` — card display
- `src/features/resources/ResourceDetail.tsx` — detail display
- `src/features/print/PrintResourceCard.tsx` — print display
- New: `src/shared/components/OperatingHoursInput.tsx` — schedule editor
- New: `src/shared/lib/operatingHours.ts` — formatting utilities

## Goals / Non-Goals

**Goals:**

- Replace free-text hours with a structured per-day schedule
- Allow grouping days with identical hours (e.g., "Mon–Sat: 8:00 AM – 10:00 PM")
- Provide a clean, easy-to-use input component for volunteers
- Format schedules consistently across card, detail, and print views
- Handle backward compatibility with existing Firestore documents that have old string fields

**Non-Goals:**

- "Open now" real-time indicator (future enhancement, this change lays groundwork)
- Timezone handling (all times are local to the resource's location)
- Multiple time ranges per day (e.g., "9AM–12PM, 2PM–5PM" lunch break splits)
- Holiday/special hours scheduling

## Decisions

### 1. Data model: Array of `DaySchedule` objects

```ts
interface DaySchedule {
  day: DayOfWeek; // 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
  open: string | null; // "08:00" (24h format) or null if closed
  close: string | null; // "22:00" (24h format) or null if closed
}

type OperatingHours = DaySchedule[];
```

**Why array of objects over a `Record<DayOfWeek, ...>`?**

- Firestore handles arrays well, and iteration order is guaranteed
- Easier to map over in React components
- 7 fixed entries (one per day), always present

**Why 24h strings over Date/Timestamp?**

- Hours are time-of-day only, not tied to a specific date
- Strings like "08:00" are simple, sortable, and play well with `<input type="time">`
- No timezone conversion issues

### 2. Input component: Per-day rows with time pickers

Each day gets a row with:

- Day label (Mon, Tue, etc.)
- Toggle for open/closed
- Open time picker (`<input type="time">`)
- Close time picker (`<input type="time">`)
- "Copy to all" button on first row to quickly set uniform hours

**Why not a "group days" UI?**

- Grouping is a display concern, not an input concern. It's simpler for volunteers to fill 7 rows (with copy-to-all) than to manage day-range groups. The display formatter handles grouping automatically.

### 3. Display formatting: Auto-group consecutive days with same hours

The formatter groups consecutive days sharing identical open/close times:

- `Mon–Sat: 8:00 AM – 10:00 PM`
- `Sun: 8:00 AM – 8:00 PM`

If all 7 days have the same hours: `Every day: 8:00 AM – 10:00 PM`
If a day is closed: `Sun: Closed`

Times displayed in 12-hour format with AM/PM.

### 4. No migration needed

There is no existing data in Firestore, so we cleanly replace `openDays`/`openHours` with `operatingHours` — no backward compatibility or migration logic required.

## Risks / Trade-offs

- **[Risk] `<input type="time">` browser support** → Mitigation: All modern browsers support it. The app targets volunteer desktop/tablet use with modern Chrome/Firefox/Safari.
- **[Trade-off] No multiple ranges per day** → Keeps the UI simple. Can be added later if needed. Single open-close range covers 95%+ of real-world cases.
