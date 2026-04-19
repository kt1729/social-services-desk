## Context

Resources currently hold a single set of contact fields (address, phone, email, website, operatingHours). The new `branches` array stores per-location overrides of those same fields. The parent resource keeps all shared content (name, description, category, tags, linkedDocuments). This keeps the Firestore document count flat — one document per umbrella, no new collection.

## Goals / Non-Goals

**Goals:**
- Allow a resource to have zero or more named branches, each with its own address, phone, email, and hours
- Manage branches inline on the resource form (add / edit / remove)
- Display branches clearly in volunteer and public views
- Remain backward-compatible: existing resources without branches are unaffected

**Non-Goals:**
- Branch-level tags, documents, or feedback (branches share the parent's)
- More than one level of nesting (no sub-branches)
- Branch reordering (insertion order is sufficient)

## Decisions

### 1. Branch stored as `Branch[]` on the parent Resource document

Each `Branch` has:
```ts
interface Branch {
  id: string;          // crypto.randomUUID() — stable client-side ID
  label: string;       // e.g. "Downtown", "Eastside"
  address?: string;
  phone?: string;
  email?: string;
  operatingHours?: OperatingHours;
}
```

The array lives on the parent Firestore document. At typical branch counts (2–10) this is well within the 1 MB document limit.

### 2. Branch IDs generated with `crypto.randomUUID()`

No Firestore sub-collection needed. IDs are stable across edits (used as React keys and for future deep-linking).

### 3. Form UI: inline expandable branch cards

The "Branches" section of the form appears in the English-only contact block (alongside address/phone/email/website). Each branch is shown as an expandable card with its own label, address, phone, email, and hours inputs. An "+ Add Branch" button appends a new blank branch. Each card has a "Remove" button.

### 4. Display: parent contact info first, then branches accordion/list

In detail views, the parent's contact block (address, phone, email, website, hours) is shown first (as today). If `branches` is non-empty, a "Locations" section follows, listing each branch with its label and contact details. On cards, a small "N locations" badge is shown.

### 5. Public portal mirrors volunteer detail

`PublicResourceDetail` shows the same "Locations" section beneath the main contact block.

## Risks / Trade-offs

- **Firestore write size**: Each branch adds ~200 bytes. 50 branches ≈ 10 KB — no concern for this app.
- **Operating hours editor per branch**: `OperatingHoursInput` is already a standalone component, so reuse is straightforward.
- **Branch label required**: Enforced in the form to avoid unnamed branches that confuse volunteers.
