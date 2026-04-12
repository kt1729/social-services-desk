# Social Service Desk — Volunteer Resource Management System

## Complete Architecture Plan

---

## 1. System Overview

A **Firebase-powered web application** that enables 3-5 volunteers across multiple service desks to simultaneously manage community resources, guest profiles, and documents/flyers in real-time. The system supports **multi-language content** (English, Spanish, Mandarin, Haitian Creole) for guest-facing materials while keeping the volunteer UI in English.

### Key Principles

- **Zero budget** — uses only free-tier services
- **Real-time sync** — all desks see changes instantly via Firebase
- **Multi-language** — resource info and print cards in guest's language
- **Print-first** — everything a guest receives is print-friendly
- **Privacy-aware** — PIN/email gated access to protect guest data

---

## 2. Tech Stack

| Layer        | Technology                   | Cost      | Notes                                      |
| ------------ | ---------------------------- | --------- | ------------------------------------------ |
| Frontend     | React (Single Page App)      | Free      | Component-based, fast                      |
| Database     | Firebase Firestore           | Free tier | 50K reads/day, 20K writes/day, 1GB storage |
| File Storage | Supabase Storage             | Free tier | Public/anon access via bucket policies     |
| Auth         | Firebase Authentication      | Free tier | Email/password for volunteers              |
| Hosting      | Firebase Hosting             | Free tier | HTTPS included                             |
| Print        | CSS `@media print`           | Free      | Native browser print                       |
| QR Codes     | `qrcode.react` (client-side) | Free      | No API needed                              |
| Chinese Font | Google Fonts (Noto Sans SC)  | Free      | CJK character support                      |

**Total cost: $0**

---

## 3. Supported Languages

| Code | Language         | Script Direction | Font                        |
| ---- | ---------------- | ---------------- | --------------------------- |
| `en` | English          | LTR              | Default system font         |
| `es` | Spanish          | LTR              | Default (supports: é, ñ, ü) |
| `zh` | Mandarin Chinese | LTR (horizontal) | Noto Sans SC (Google Fonts) |
| `ht` | Haitian Creole   | LTR              | Default (supports: è, ò)    |

### Translation Strategy

- **UI stays in English** — volunteers operate the interface in English
- **Resource content is translatable** — name, description, notes
- **Documents have per-language versions** — separate PDF/flyer per language
- **Print cards render in the guest's language** — volunteer selects language before printing
- **Volunteers manually enter translations** — no auto-translate API dependency

---

## 4. Resource Categories (Pre-translated)

| Key              | English               | Spanish                     | Mandarin     | Haitian Creole        |
| ---------------- | --------------------- | --------------------------- | ------------ | --------------------- |
| `housing`        | Housing & Shelter     | Vivienda y Refugio          | 住房与庇护   | Lojman ak Abri        |
| `food`           | Food & Meals          | Alimentos y Comidas         | 食物与餐食   | Manje ak Repa         |
| `medical`        | Medical & Health      | Médico y Salud              | 医疗与健康   | Medikal ak Sante      |
| `mental_health`  | Mental Health         | Salud Mental                | 心理健康     | Sante Mantal          |
| `legal`          | Legal                 | Legal                       | 法律         | Legal                 |
| `employment`     | Employment            | Empleo                      | 就业         | Travay                |
| `financial`      | Financial Assistance  | Asistencia Financiera       | 经济援助     | Asistans Finansye     |
| `transportation` | Transportation        | Transporte                  | 交通         | Transpò               |
| `clothing`       | Clothing & Essentials | Ropa y Artículos Esenciales | 服装与必需品 | Rad ak Bagay Esansyèl |
| `other`          | Other                 | Otro                        | 其他         | Lòt                   |

These are **static** — stored in application code, not in Firestore.

---

## 5. Firestore Database Schema

### 5.1 `resources/` — Community Resource Listings

```
resources/{resourceId}
├── name: {
│     en: "City Shelter Downtown",
│     es: "Refugio del Centro",
│     zh: "市中心收容所",
│     ht: "Abri Santral Vil la"
│   }
├── description: {
│     en: "Emergency overnight shelter for individuals and families...",
│     es: "Refugio de emergencia nocturno para individuos y familias...",
│     zh: "为个人和家庭提供的紧急过夜庇护所...",
│     ht: "Abri ijans pou lannwit pou moun ak fanmi..."
│   }
├── category: string                  ← internal key: "housing", "food", etc.
├── address: string                   ← NOT translated (universal)
├── phone: string                     ← NOT translated
├── website: string                   ← NOT translated
├── operatingHours: [                 ← structured weekly hours
│     { day: "mon", open: "08:00", close: "17:00" },
│     { day: "tue", open: "08:00", close: "17:00" },
│     { day: "wed", open: "08:00", close: "17:00" },
│     { day: "thu", open: "08:00", close: "17:00" },
│     { day: "fri", open: "08:00", close: "17:00" },
│     { day: "sat", open: null, close: null },
│     { day: "sun", open: null, close: null }
│   ]
├── tags: string[]                    ← flexible tagging for search
├── notes: [
│     {
│       text: {
│         en: "Bring photo ID",
│         es: "Traiga identificación con foto",
│         zh: "请携带带照片的身份证件",
│         ht: "Pote yon ID ak foto"
│       },
│       volunteerId: string,
│       timestamp: timestamp
│     }
│   ]
├── feedbackSummary: {
│     upvotes: number,
│     downvotes: number
│   }
├── linkedDocuments: string[]         ← document IDs related to this resource
├── translationStatus: {
│     es: "complete" | "partial" | "missing",
│     zh: "complete" | "partial" | "missing",
│     ht: "complete" | "partial" | "missing"
│   }
├── createdBy: string                 ← volunteer ID
├── createdAt: timestamp
└── updatedAt: timestamp
```

**Translation rules for resources:**
| Field | Translated? | Reason |
|---|---|---|
| `name` | ✅ Yes | Guests need to recognize the place |
| `description` | ✅ Yes | Core info guests need to understand |
| `notes` (guest-facing) | ✅ Yes | Instructions like "bring ID" |
| `address` | ❌ No | Addresses don't change by language |
| `phone` | ❌ No | Numbers are universal |
| `website` | ❌ No | URLs are universal |
| `operatingHours` | ❌ No | Structured hours, formatted for display/print |
| `tags` | ❌ No | Internal volunteer use |
| `feedback` | ❌ No | Volunteer-to-volunteer only |

---

### 5.2 `guests/` — Guest Profiles (SENSITIVE)

```
guests/{guestId}
├── firstName: string
├── lastInitial: string               ← privacy: "John D." not "John Doe"
├── preferredLanguage: string         ← "en" | "es" | "zh" | "ht"
├── needs: string[]                   ← ["housing", "food", "legal"]
├── quickNotes: [
│     { text: string, volunteerId: string, timestamp: timestamp }
│   ]
├── visitLog: [
│     {
│       date: timestamp,
│       purpose: string,
│       volunteerId: string,
│       notes: string,
│       resourcesReferred: string[],  ← resource IDs
│       documentsGiven: string[]      ← document IDs
│     }
│   ]
├── createdBy: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

---

### 5.3 `documents/` — Flyers, PDFs, Links, Internal Docs

```
documents/{documentId}
├── title: {
│     en: "SNAP Benefits Application Guide",
│     es: "Guía de Solicitud de Beneficios SNAP",
│     zh: "SNAP福利申请指南",
│     ht: "Gid pou Aplike pou Benefis SNAP"
│   }
├── description: {
│     en: "Step-by-step guide to applying for food stamps...",
│     es: "Guía paso a paso para solicitar cupones de alimentos...",
│     zh: "逐步申请食品券指南...",
│     ht: "Gid etap pa etap pou aplike pou koupon manje..."
│   }
├── type: "pdf" | "link" | "internal" | "image"
├── source: {
│     url: string | null,                     ← for links
│     storagePath: string | null,             ← for uploads (Supabase Storage path)
│     internalContent: {                      ← for volunteer-written docs
│       en: "Full text content...",
│       es: "Contenido completo...",
│       zh: "完整内容...",
│       ht: "Kontni konplè..."
│     } | null
│   }
├── category: string                          ← same categories as resources
├── tags: string[]                            ← search tags
├── linkedResources: string[]                 ← resource IDs this doc relates to
├── languages: {
│     en: { available: true, storagePath: "documents/{id}/en/file.pdf" },
│     es: { available: true, storagePath: "documents/{id}/es/file.pdf" },
│     zh: { available: false, storagePath: null },
│     ht: { available: true, storagePath: "documents/{id}/ht/file.pdf" }
│   }
├── translationStatus: {
│     es: "complete" | "partial" | "missing",
│     zh: "complete" | "partial" | "missing",
│     ht: "complete" | "partial" | "missing"
│   }
├── printSettings: {
│     paperSize: "letter" | "half" | "quarter",
│     orientation: "portrait" | "landscape",
│     showQRCode: boolean                     ← auto-generate QR for links
│   }
├── createdBy: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

---

### 5.4 `feedback/` — Resource Feedback from Volunteers

```
feedback/{feedbackId}
├── resourceId: string                ← links to resource
├── rating: "up" | "down"
├── comment: string
├── volunteerId: string
└── createdAt: timestamp
```

---

### 5.5 `notes/` — Standalone Quick Notes

```
notes/{noteId}
├── parentType: "resource" | "guest" | "document" | "general"
├── parentId: string | null
├── text: string
├── volunteerId: string
└── createdAt: timestamp
```

---

### 5.6 `volunteers/` — Volunteer Accounts

```
volunteers/{volunteerId}
├── name: string
├── email: string
├── role: "volunteer" | "admin"
└── createdAt: timestamp
```

---

## 6. Supabase Storage Structure

```
supabase-storage/
└── <bucket>/
    └── <category>/
        └── <lang>/
            └── {documentId}/
                └── filename.ext
```

**Free tier limits:** Depends on Supabase plan; enforce limits via bucket policies and application rules.

---

## 7. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {

    // Default: deny all
    match /{document=**} {
      allow read, write: if false;
    }

    // Resources: public read, auth create/update, admin-only delete
    match /resources/{resId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if get(/databases/$(db)/documents/volunteers/$(request.auth.uid)).data.role == "admin";
    }

    // Guests: sensitive data, only authenticated volunteers
    match /guests/{guestId} {
      allow read, write: if request.auth != null;
    }

    // Documents: public read, auth create/update, admin-only delete
    match /documents/{docId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if get(/databases/$(db)/documents/volunteers/$(request.auth.uid)).data.role == "admin";
    }

    // Feedback: any authenticated volunteer
    match /feedback/{fbId} {
      allow read, write: if request.auth != null;
    }

    // Notes: any authenticated volunteer
    match /notes/{noteId} {
      allow read, write: if request.auth != null;
    }

    // Volunteers: can read all, can only write own profile (or admin writes any)
    match /volunteers/{volId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == volId
                   || get(/databases/$(db)/documents/volunteers/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

---

## 8. Supabase Storage Policies (Summary)

- Public read access only for files intended to be guest-facing.
- Auth-required write access for uploads.
- Size limits enforced on upload (10MB max per file).
- Bucket policies should scope access to the single document storage bucket.

---

## 9. Application Modules

### 9.1 Module Map

```
┌─────────────────────────────────────────────────────────┐
│                   APPLICATION MODULES                    │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │   AUTH    │  │ RESOURCE │  │  GUEST   │  │DOCUMENT │ │
│  │   GATE   │  │   MGMT   │  │ PROFILE  │  │ LIBRARY │ │
│  │          │  │          │  │          │  │         │ │
│  │ PIN/Email│  │  CRUD    │  │  CRUD    │  │ Upload  │ │
│  │ Firebase │  │  Search  │  │  Notes   │  │ Link    │ │
│  │  Auth    │  │  Filter  │  │  Visits  │  │ Preview │ │
│  │          │  │  i18n    │  │  Needs   │  │ QR Gen  │ │
│  │          │  │  Print   │  │  Print   │  │ i18n    │ │
│  │          │  │  Feedback│  │          │  │ Print   │ │
│  │          │  │  ◄─LINKS──┼──────────►│  │ Storage │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │  SEARCH  │  │  NOTES   │  │ TRANSLATE│               │
│  │  ENGINE  │  │  SYSTEM  │  │ DASHBOARD│               │
│  │          │  │          │  │          │               │
│  │ Cross-   │  │ Quick    │  │ Status   │               │
│  │collection│  │ notes on │  │ tracker  │               │
│  │ search   │  │ anything │  │ per lang │               │
│  └──────────┘  └──────────┘  └──────────┘               │
└─────────────────────────────────────────────────────────┘
```

### 9.2 Feature → Module Mapping

| Feature                       | Module                               | How it works                                                                                           |
| ----------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Search**                    | Global search bar                    | Queries Firestore across `name`, `category`, `description`, `tags` in resources, documents, and guests |
| **CRUD**                      | Resource / Guest / Document forms    | Create/Edit modal forms, inline delete with confirmation                                               |
| **Categorization**            | Sidebar filter + category field      | 10 preset categories + custom tags                                                                     |
| **Links/Address/Phone/Hours** | Resource schema fields               | Dedicated fields per resource, rendered as clickable links                                             |
| **Document Management**       | Document Library tab                 | Upload PDFs/images, add website links, write internal docs                                             |
| **Print + Quick Note**        | Print view component                 | `@media print` CSS hides UI chrome, shows clean card + blank notes lines                               |
| **Guest Profiling**           | Guests tab                           | Separate collection, visit log timeline, needs tracking, preferred language                            |
| **Quick Notes**               | Notes sub-collection                 | Timestamped notes attached to any resource, guest, or document                                         |
| **Feedback**                  | Thumbs up/down + comment             | Per-resource feedback, aggregated summary on card                                                      |
| **Print Friendly**            | CSS print styles + language selector | Every card has a 🖨️ button → pick language → clean print view                                          |
| **Translation Tracking**      | Translation Dashboard                | Shows completion status per resource/document per language                                             |
| **QR Codes**                  | Document print view                  | Auto-generated client-side for website links                                                           |

---

## 10. UI Layout

### 10.1 Main Application Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                        LOGIN SCREEN                             │
│              Email + Password  (Firebase Auth)                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │ authenticated
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│  HEADER:  App Title │ Search Bar │ + New │ Export │ [Logout]    │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                      │
│ SIDEBAR  │   MAIN CONTENT AREA                                  │
│          │                                                      │
│ ┌──────┐ │   Tabs: [Resources | Guests | Documents | Notes]    │
│ │Views │ │                                                      │
│ │------│ │   Content varies by active tab (see below)           │
│ │All   │ │                                                      │
│ │Recent│ │                                                      │
│ └──────┘ │                                                      │
│          │                                                      │
│ ┌──────┐ │                                                      │
│ │Filter│ │                                                      │
│ │------│ │                                                      │
│ │Housing│ │                                                      │
│ │Food  │ │                                                      │
│ │Medical│ │                                                      │
│ │Legal │ │                                                      │
│ │Jobs  │ │                                                      │
│ │Finance│ │                                                      │
│ │Other │ │                                                      │
│ └──────┘ │                                                      │
│          │                                                      │
│ ┌──────┐ │                                                      │
│ │Transl│ │                                                      │
│ │Status│ │                                                      │
│ └──────┘ │                                                      │
├──────────┴──────────────────────────────────────────────────────┤
│  FOOTER:  Connected: ✅  │  5 volunteers online  │  Last sync  │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Resource Card

```
┌─────────────────────────────────────────────────────┐
│  🏠 City Shelter Downtown                           │
│  Category: Housing & Shelter                         │
│  📍 1200 Main St  📞 (555) 234-5678                 │
│  🕐 Mon–Fri, 5PM – 8AM                              │
│                                                      │
│  Emergency overnight shelter for individuals...      │
│                                                      │
│  👍 12  👎 2  │ 📝 Note │ 🖨️ Print Card             │
│                                                      │
│  ── 📎 Related Documents ────────────────────────── │
│  📄 Shelter Intake Checklist     [🇪🇸🇨🇳🇭🇹] [🖨️]  │
│  🔗 Online Pre-Registration      [QR]       [🖨️]  │
│  📄 Emergency Housing Guide      [🇪🇸  🇭🇹] [🖨️]  │
│                                                      │
│  [ + Attach Document ]                               │
└─────────────────────────────────────────────────────┘
```

### 10.3 Guest Profile Card

```
┌─────────────────────────────────────────────────────┐
│  👤 Maria G.                                         │
│  Preferred Language: 🇪🇸 Spanish                     │
│  Needs: Housing, Food                                │
│  Visits: 4 │ Last: Jan 15, 2026                      │
│                                                      │
│  Recent Notes:                                       │
│  "Referred to shelter program" — Vol. Sarah, Jan 15  │
│  "Needs SNAP application help" — Vol. Mike, Jan 10   │
│                                                      │
│  Documents Given:                                    │
│  📄 SNAP Guide (ES) — Jan 10                         │
│  📄 Shelter Checklist (ES) — Jan 15                   │
│                                                      │
│  [ 📝 Add Note ] [ 📋 Log Visit ] [ 🖨️ Print ]      │
└─────────────────────────────────────────────────────┘
```

### 10.4 Document Library

```
┌──────────────────────────────────────────────────────────┐
│  📄 Document Library                    [ + Add Document ]│
│──────────────────────────────────────────────────────────│
│  🔍 [Search documents...                              ]  │
│  Filter: [All Types ▼] [All Categories ▼] [Language ▼]   │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ 📄 PDF                                              │ │
│  │ SNAP Benefits Application Guide                     │ │
│  │ Category: Food & Meals                              │ │
│  │ Languages: 🇺🇸 🇪🇸 🇭🇹  (🇨🇳 missing)               │ │
│  │ Linked to: Community Food Bank, City Social Services│ │
│  │                                                     │ │
│  │ [ 👁️ Preview ] [ 🖨️ Print ] [ ✏️ Edit ] [ 🔗 Link ]│ │
│  └─────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ 🔗 LINK                                             │ │
│  │ Medicaid Online Application                         │ │
│  │ Category: Medical & Health                          │ │
│  │ URL: healthcare.gov/medicaid                        │ │
│  │                                                     │ │
│  │ [ 🔗 Open Link ] [ 🖨️ Print w/ QR ] [ ✏️ Edit ]   │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### 10.5 Translation Status Dashboard

```
┌──────────────────────────────────────────────────────┐
│  📊 Translation Status                               │
│──────────────────────────────────────────────────────│
│                                                      │
│  RESOURCES              🇪🇸 ES   🇨🇳 ZH   🇭🇹 HT    │
│  ─────────────────────  ──────  ──────  ──────      │
│  City Shelter Downtown   ✅      ✅      ✅          │
│  Community Food Bank     ✅      ⚠️      ❌          │
│  Free Health Clinic      ✅      ❌      ❌          │
│                                                      │
│  DOCUMENTS              🇪🇸 ES   🇨🇳 ZH   🇭🇹 HT    │
│  ─────────────────────  ──────  ──────  ──────      │
│  SNAP Application Guide  ✅      ❌      ✅          │
│  Medicaid Flyer          ✅      ✅      ⚠️          │
│                                                      │
│  Overall: ES 80% │ ZH 40% │ HT 55%                  │
│                                                      │
│  [ Filter: Missing translations only ]               │
└──────────────────────────────────────────────────────┘

✅ = Complete    ⚠️ = Partial (some fields)    ❌ = Missing
```

---

## 11. Resource Edit Form (with Translation Tabs)

```
┌───────────────────────────────────────────────────────┐
│  Edit Resource                                         │
│───────────────────────────────────────────────────────│
│                                                        │
│  Name (EN):   [City Shelter Downtown           ]       │
│  Category:    [Housing & Shelter            ▼]         │
│  Address:     [1200 Main St                ]           │
│  Phone:       [(555) 234-5678              ]           │
│  Website:     [https://cityshelter.org     ]           │
│  Open Days:   [Mon–Fri                     ]           │
│  Open Hours:  [5PM – 8AM                   ]           │
│  Tags:        [shelter, emergency, overnight   ]       │
│                                                        │
│  Description (EN):                                     │
│  [Emergency overnight shelter for individuals...]      │
│                                                        │
│  ── Translations ──────────────────────────────────── │
│  [ 🇪🇸 Spanish | 🇨🇳 Mandarin | 🇭🇹 Haitian Creole ]  │
│                                                        │
│  ┌─ 🇪🇸 Spanish ─────────────────────────────────┐    │
│  │ Name: [Refugio del Centro                   ] │    │
│  │ Description:                                  │    │
│  │ [Refugio de emergencia nocturno para...]      │    │
│  │ Status: ✅ Complete                            │    │
│  └───────────────────────────────────────────────┘    │
│                                                        │
│           [ Cancel ]  [ Save Resource ]                │
└───────────────────────────────────────────────────────┘
```

---

## 12. Add Document Form

```
┌───────────────────────────────────────────────────────┐
│  Add Document                                          │
│───────────────────────────────────────────────────────│
│                                                        │
│  Document Type:  ( ) PDF Upload                        │
│                  ( ) Website Link                       │
│                  ( ) Internal Document                  │
│                  ( ) Image / Flyer Upload               │
│                                                        │
│  Title (EN):  [SNAP Benefits Application Guide     ]   │
│  Description: [Step-by-step guide to applying...   ]   │
│  Category:    [Food & Meals                     ▼]     │
│  Tags:        [snap, food stamps, benefits         ]   │
│                                                        │
│  ── Source ────────────────────────────────────────── │
│  📎 Upload English version:  [ Choose File ]           │
│                                                        │
│  ── Language Versions ─────────────────────────────── │
│  🇪🇸 Spanish:   📎 [ Upload Spanish PDF ]              │
│  🇨🇳 Mandarin:  📎 [ Upload Mandarin PDF ]             │
│  🇭🇹 Ht Creole: 📎 [ Upload Creole PDF ]               │
│                                                        │
│  ── Link to Resources ─────────────────────────────── │
│  [ 🔍 Search and link resources...                  ]  │
│  ✅ Community Food Bank                                │
│  ✅ City Social Services                               │
│                                                        │
│  ── Print Settings ────────────────────────────────── │
│  Paper Size:   [Letter ▼]                              │
│  Orientation:  [Portrait ▼]                            │
│  Show QR Code: [✅] (auto-generates for links)         │
│                                                        │
│           [ Cancel ]  [ Save Document ]                │
└───────────────────────────────────────────────────────┘
```

---

## 13. Print Layouts

### 13.1 Resource Card Print (Guest Language)

```
┌──────────────────────────────────────┐
│  SERVICIO SOCIAL                     │
│  Tarjeta de Información              │
│──────────────────────────────────────│
│                                      │
│  Refugio del Centro                  │
│  Categoría: Vivienda y Refugio       │
│                                      │
│  📍 1200 Main St, Suite 100          │
│  📞 (555) 234-5678                   │
│  🌐 cityshelter.org                  │
│  🕐 Mon–Fri, 5PM – 8AM              │
│                                      │
│  Refugio de emergencia nocturno      │
│  para individuos y familias.         │
│                                      │
│  Notas:                              │
│  ________________________________    │
│  ________________________________    │
│  ________________________________    │
│                                      │
│  Fecha: 07/02/2026                   │
└──────────────────────────────────────┘
```

### 13.2 Website Link Print (with QR Code)

```
┌──────────────────────────────────────┐
│  SÈVIS SOSYAL                        │
│  Kat Enfòmasyon Resous               │
│──────────────────────────────────────│
│                                      │
│  Aplikasyon Medicaid                 │
│  Kategori: Medikal ak Sante         │
│                                      │
│  Vizite sit entènèt sa a:           │
│  healthcare.gov/medicaid             │
│                                      │
│  Eskane pou ouvri:                   │
│       ┌──────────┐                   │
│       │ ██ ██ ██ │                   │
│       │ ██    ██ │                   │
│       │ ██ ██ ██ │                   │
│       └──────────┘                   │
│                                      │
│  Nòt:                                │
│  ________________________________    │
│  ________________________________    │
│                                      │
│  Dat: 07/02/2026                     │
└──────────────────────────────────────┘
```

### 13.3 Print Header Translations (Static in code)

```javascript
PRINT_HEADERS = {
  en: {
    title: 'SOCIAL SERVICE DESK',
    subtitle: 'Resource Information Card',
    notes: 'Notes:',
    date: 'Date:',
    scan: 'Scan to open:',
    visit: 'Visit this website:',
  },
  es: {
    title: 'SERVICIO SOCIAL',
    subtitle: 'Tarjeta de Información',
    notes: 'Notas:',
    date: 'Fecha:',
    scan: 'Escanee para abrir:',
    visit: 'Visite este sitio web:',
  },
  zh: {
    title: '社会服务台',
    subtitle: '资源信息卡',
    notes: '备注：',
    date: '日期：',
    scan: '扫描打开：',
    visit: '访问此网站：',
  },
  ht: {
    title: 'SÈVIS SOSYAL',
    subtitle: 'Kat Enfòmasyon Resous',
    notes: 'Nòt:',
    date: 'Dat:',
    scan: 'Eskane pou ouvri:',
    visit: 'Vizite sit entènèt sa a:',
  },
};
```

---

## 14. Real-Time Sync Architecture

```
Volunteer A (Desk 1)          Firebase Firestore         Volunteer B (Desk 2)
      │                              │                          │
      │── adds new resource ────────▶│                          │
      │                              │──── real-time push ─────▶│
      │                              │                          │ sees it instantly
      │                              │                          │
      │                              │◀── updates guest note ──│
      │◀──── real-time push ─────────│                          │
      │ sees it instantly            │                          │
      │                              │                          │
      │                              │◀── uploads document ────│
      │◀──── real-time push ─────────│                          │
      │ sees new doc in library      │                          │
```

Using Firestore's `onSnapshot()` listeners — every desk sees changes within 1-2 seconds.

---

## 15. Global Search Behavior

Search queries all three collections simultaneously:

```
🔍 "food"

Results:
── Resources ──────────────────────────
  🏠 Community Food Bank
  🏠 City Meals on Wheels

── Documents ──────────────────────────
  📄 SNAP Benefits Application Guide
  🔗 Food Bank Locator (website)
  🖼️ Free Lunch Program Flyer

── Guests ─────────────────────────────
  👤 Maria G. (needs: food, housing)
```

Search fields per collection:

- **Resources**: name (all languages), description (all languages), category, tags, address
- **Documents**: title (all languages), description (all languages), category, tags
- **Guests**: firstName, lastInitial, needs, quickNotes

---

## 16. Relationship Model

```
┌─────────────────────┐         ┌─────────────────────┐
│  RESOURCE            │◄───────►│  DOCUMENT            │
│  "Community Food     │  linked  │  "SNAP Application   │
│   Bank"              │         │   Guide" (PDF)       │
└────────┬────────────┘         └─────────┬───────────┘
         │                                │
         │ referred to                    │ given to
         ▼                                ▼
┌─────────────────────────────────────────────────────┐
│  GUEST                                               │
│  "Maria G."                                          │
│  visitLog: [                                         │
│    { resourcesReferred: [...], documentsGiven: [...] }│
│  ]                                                   │
└─────────────────────────────────────────────────────┘
```

---

## 17. Firebase + Supabase Setup Steps

```
Step 1:  Go to console.firebase.google.com
Step 2:  Create new project → select free Spark plan
Step 3:  Enable Firestore Database (start in test mode, then apply rules)
Step 4:  Enable Authentication → Email/Password provider
Step 5:  Create Supabase project and storage bucket for documents
Step 6:  Configure Supabase storage policies (public read for guest-facing files, auth write)
Step 7:  Copy Firebase config + Supabase URL/anon key/bucket into app env
Step 8:  Deploy Firestore security rules (Section 7)
Step 9:  Create first admin volunteer account
Step 10: Deploy app via Firebase Hosting: `firebase deploy`
```

---

## 18. Volunteer Workflow Examples

### Example 1: Guest Needs Food Help (Speaks Spanish)

```
1. Guest walks up speaking Spanish
2. Volunteer searches "food" → sees Community Food Bank
3. Opens resource → sees related documents:
   - 📄 SNAP Application Guide (🇪🇸 available)
   - 🔗 Food Bank Locator (🖨️ with QR code)
4. Clicks 🖨️ on resource card → selects "🇪🇸 Spanish" → prints
5. Clicks 🖨️ on SNAP guide → prints Spanish PDF version
6. Clicks 🖨️ on Food Bank link → prints card with QR code
7. Logs visit on guest profile with notes
8. Guest leaves with printed materials in their language
```

### Example 2: New Resource Added

```
1. Volunteer A finds a new free clinic in the area
2. Creates resource with English info
3. Uploads the clinic's flyer as a document
4. Links the document to the resource
5. Volunteer B (at another desk) sees it appear in real-time
6. Volunteer B adds Spanish translation when they have time
7. Translation dashboard updates from ❌ to ✅ for Spanish
```

### Example 3: Returning Guest

```
1. Guest returns — volunteer searches by name
2. Sees past visit log: previously referred to shelter
3. Adds quick note: "Following up on housing application"
4. Prints updated resource card with new documents
5. Logs today's visit with details
```

---

## 19. Font Strategy

```css
/* Default fonts for the application */
body {
  font-family: 'Your-Chosen-Font', system-ui, sans-serif;
}

/* Load Google Font for Chinese character support */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap');

/* Applied when printing or displaying in Chinese */
.print-card[data-lang='zh'],
.content-zh {
  font-family: 'Noto Sans SC', sans-serif;
}
```

---

## 20. Future Enhancements (Phase 2)

| Feature                | Description                                                   |
| ---------------------- | ------------------------------------------------------------- |
| Referral tracking      | Log which resources a guest was referred to and follow up     |
| Resource verification  | Flag outdated info, mark "last confirmed" date                |
| Analytics dashboard    | Most searched categories, busiest days, common needs          |
| Offline mode           | Firestore offline persistence as fallback when internet drops |
| CSV export             | Export data for reporting to the organization                 |
| Auto-translate toggle  | Optional Google Translate API for draft translations          |
| Additional languages   | Add more languages as community needs grow                    |
| Volunteer shift log    | Track which volunteers were on duty when                      |
| Guest consent tracking | Record consent for data storage per guest                     |
| Duplicate detection    | Flag potential duplicate guest profiles                       |

---

## 21. Free Tier Limits Summary

| Service           | Free Tier Limit      | Expected Usage            | Headroom |
| ----------------- | -------------------- | ------------------------- | -------- |
| Firestore reads   | 50,000/day           | ~5,000/day (5 volunteers) | 10x      |
| Firestore writes  | 20,000/day           | ~500/day                  | 40x      |
| Firestore storage | 1 GB                 | ~50 MB (text data)        | 20x      |
| Supabase Storage  | Varies by plan       | ~1 GB (PDFs/flyers)       | TBD      |
| Storage downloads | Varies by plan       | ~100 MB/day               | TBD      |
| Firebase Auth     | 10,000 users/month   | 5-10 volunteers           | 1000x    |
| Firebase Hosting  | 10 GB transfer/month | ~1 GB/month               | 10x      |

The free tier is more than sufficient for this use case.

---

_Document Version: 1.0_
_Last Updated: February 8, 2026_
_System: Social Service Desk — Volunteer Resource Management System_
