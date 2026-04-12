## public-portal

### Public Routes

- Public pages MUST be accessible without authentication at `/public`, `/public/resources/:id`, `/public/documents/:id`
- Public pages MUST NOT expose edit, delete, print, notes, or feedback functionality
- Public pages MUST support all 4 languages (en, es, zh, ht) via a language selector

### Public Layout

- The public layout MUST display the organization logo (webp format)
- The public layout MUST include a language selector to switch display language
- The public layout MUST include navigation between resources and documents
- The public layout MUST be responsive (mobile-first, since guests use phones)
- The public layout SHOULD include a "Volunteer Login" link to `/login`

### Public Home

- The public home page MUST display both resources and documents in a combined view
- The public home page MUST include category filter tabs
- The public home page MUST display a QR code linking to itself (`/public`)
- The QR code URL MUST be permanent (just a route path, no expiry)
- The QR code SHOULD be printable

### Public Resource Detail

- MUST display: translated name, category badge, description, address, phone, operating hours
- MUST NOT display: edit/delete buttons, notes, feedback buttons, document attachment picker
- SHOULD display linked documents as clickable links to `/public/documents/:id`

### Public Document Detail

- MUST display: translated title, category badge, description, type icon, language availability
- MUST display PDF/image previews via Supabase signed URLs
- MUST NOT display: edit/delete buttons, notes, print button
- SHOULD display linked resources as clickable links to `/public/resources/:id`
