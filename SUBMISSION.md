# Submission

## Deliverables

| File / Folder | Description |
|---|---|
| `app/` | Next.js 14 App Router pages and API routes |
| `components/` | React client components (Dashboard, Editor, Sidebar) |
| `lib/` | Prisma client, API wrappers, types, unit tests |
| `prisma/` | Schema, migrations, SQLite database |
| `public/uploads/` | Uploaded file storage (created at runtime) |
| `README.md` | Project overview, setup, and feature list |
| `ARCHITECTURE.md` | System design, decisions, and tradeoffs |
| `AI_USAGE.md` | AI tool usage and manual modifications |
| `SUBMISSION.md` | This file |

---

## How to Run

```bash
# 1. Install all dependencies
npm install

# 2. Create the SQLite database and apply migrations
npx prisma migrate dev --name init

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to `/dashboard`.

---

## Running Tests

```bash
npm test
```

Expected output:
```
PASS  lib/utils.test.ts
  filterByOwner
    ✓ returns only docs owned by the given email
    ✓ returns empty array when no match
  filterShared
    ✓ returns docs where user is a collaborator

Tests: 3 passed, 3 total
```

---

## Key Features to Evaluate

1. **Dashboard** — create documents, switch between "My Documents" and "Shared With Me"
2. **Editor** — rich-text editing with auto-save; title is editable inline
3. **Sharing** — add a collaborator email in the sidebar; the document appears in their "Shared With Me" tab
4. **File upload** — upload a `.txt` file from the sidebar; it appears as a downloadable link
5. **Persistence** — restart the dev server; all documents, collaborators, and files persist

---

## Video Walkthrough

_[Video link placeholder — replace with Loom / YouTube URL]_

---

## Notes

- Current user is hardcoded as `me@example.com`. To simulate a second user viewing shared documents, change `CURRENT_USER` in `lib/types.ts`.
- The SQLite database file (`prisma/dev.db`) is included for convenience so the app works immediately after `npm install` + `npm run dev` without needing to run migrations.
