## Context

Firebase Authentication user creation requires the Admin SDK (server-side only). The client Firebase SDK cannot create Auth users. The app has no backend. Therefore volunteer management is scoped to the Firestore `volunteers` collection: admins manage records there, and new users sign in with credentials created separately in the Firebase Console (or via a future invite flow). The Firestore `volunteers` document is what grants role-based access in this app.

## Goals / Non-Goals

**Goals:**
- List all volunteer records with name, email, role
- Add a new volunteer record (admin pastes the Auth UID)
- Change any volunteer's role inline
- Delete a volunteer record (Firestore only)
- Guard the page to admins; redirect non-admins

**Non-Goals:**
- Creating Firebase Auth users from the UI (requires Admin SDK)
- Password reset / invite emails (future feature)
- Editing volunteer name or email after creation (low priority for v1)

## Decisions

### 1. Page pattern: matches TagsPage

`VolunteersPage` follows the same structure as `TagsPage`: header with `h1` + action button, list of rows, `Modal` for the add form, `ConfirmDialog` for delete. Consistent with the rest of the app.

### 2. Add volunteer form fields

- **Name** (text, required)
- **Email** (email type, required — informational only, not used to look up Auth)
- **Role** (select: volunteer / admin)
- **Firebase UID** (text, required) — admin copies this from Firebase Console → Authentication → Users

A visible helper note explains: _"Find the UID in Firebase Console → Authentication → Users."_

### 3. Role change: inline select dropdown

Each row shows the role as a `<select>` (volunteer / admin). On change, immediately calls `updateDoc` on the volunteer's Firestore document. No separate save button — keeps the UI tight.

### 4. Delete: Firestore doc only

Clicking delete on a volunteer opens `ConfirmDialog`. On confirm, `deleteDoc` removes the Firestore document. The Firebase Auth account remains active — the user can still log in but will fall back to the default `volunteer` role (as per `AuthContext` fallback).

### 5. Route guard

The `/volunteers` route renders `<VolunteersPage />` only when `isAdmin` is true. If a non-admin navigates there, redirect to `/`.

### 6. Firestore rules

No change needed. `volunteers` collection: `allow read: if isAuth()` and `allow write: if isAdmin()` — already correct.

## Risks / Trade-offs

- **UID copy-paste UX**: Admins must leave the app to get a UID. Acceptable for a small team (3–5 volunteers). A future invite-by-email flow using Firebase Functions can replace this.
- **No auth user deletion**: Volunteer record deletion leaves a stale Auth account. Acceptable — the stale user can't do anything harmful since their Firestore doc (and thus role) is gone.
