## Why

Resources currently store operating hours as two free-text fields (`openDays` and `openHours`), which leads to inconsistent formatting and makes it impossible to show whether a resource is currently open. Replacing these with a structured per-day schedule enables consistent display (e.g., "Mon–Sat: 8:00 AM – 10:00 PM") and lays the groundwork for future "open now" indicators.

## What Changes

- **BREAKING**: Replace `openDays: string` and `openHours: string` on the `Resource` type with a new `operatingHours` field containing a structured weekly schedule
- Add a new `OperatingHoursInput` component that lets volunteers set open/close times per day (or group of days), with support for "Closed" days
- Update `ResourceForm` to use the new structured input instead of two text fields
- Update `ResourceCard`, `ResourceDetail`, and `PrintResourceCard` to render the schedule in a human-readable format (e.g., "Mon–Sat: 8:00 AM – 10:00 PM")
- Migrate existing Firestore data: convert free-text values to the new structure where possible, preserve the original text as a fallback

## Capabilities

### New Capabilities

- `operating-hours`: Structured weekly schedule data model, input component, and display formatting

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- **Types**: `Resource` type in `src/shared/types/index.ts` — field replacement
- **Components**: `ResourceForm`, `ResourceCard`, `ResourceDetail`, `PrintResourceCard` — updated to use new field
- **New component**: `OperatingHoursInput` in `src/shared/components/`
- **New utility**: Schedule formatting helpers in `src/shared/lib/`
- **Firestore**: Existing `resources` documents need migration (old text fields → new structure)
- **Firestore rules**: No changes needed (same collection, same auth gates)
