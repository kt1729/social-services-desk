# Social Service Desk

A lightweight, self-hostable resource and document portal for social service organizations. Built with React, Firebase (Auth + Firestore), and Supabase Storage.

## Features

- Resource and document management with multilingual support (en/es/zh/ht)
- Public portal at `/public` with search and QR access
- Document previews (PDF/image/link/internal)
- Print-friendly views

## Getting Started

### Prerequisites

- Node.js 20+
- Firebase project (Auth + Firestore)
- Supabase project (Storage)

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file from the example:

```bash
cp .env.example .env
```

3. Fill in environment variables:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SUPABASE_BUCKET=
VITE_PUBLIC_LOGO_URL=
VITE_LOCAL_MODE=false
```

### Local Mode (No Cloud Setup)

To run the UI without Firebase/Supabase:

```
VITE_LOCAL_MODE=true
```

This enables mock auth and mock data so contributors can work on the UI without cloud credentials.

### GitHub Actions Secrets

If you deploy with GitHub Actions, set the same values as repository secrets:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_BUCKET`
- `VITE_PUBLIC_LOGO_URL`

4. Run the app:

```bash
npm run dev
```

### Scripts

- `npm run dev` – local dev server
- `npm run lint` – ESLint
- `npm test` – Vitest
- `npm run build` – production build
- `npm run preview` – preview production build

## Security Notes (Before Going Public)

- **Never commit `.env`**. It is already ignored in `.gitignore`.
- **Public reads** are enabled for `resources` and `documents` in Firestore. Do not store PII there.
- Supabase anon keys are public by design. Ensure storage policies only allow intended read access.
- Review `firestore.rules` before deployment.

## Hosting

This repo includes Firebase hosting config. You can deploy using your own Firebase project and hosting setup.

## License

MIT (see `LICENSE`).
