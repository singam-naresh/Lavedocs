# Architecture

## Overview

LaveDocs is a monolithic full-stack app using Next.js 14 App Router. The frontend and backend live in the same repo. API routes handle all data operations; the frontend communicates with them via typed `fetch` wrappers.

```
Browser
  │
  ├── /dashboard          → DashboardClient (client component)
  │     └── GET /api/documents
  │
  └── /editor/[id]        → EditorClient (client component)
        ├── GET  /api/documents/[id]
        ├── PUT  /api/documents/[id]    ← debounced auto-save
        ├── DELETE /api/documents/[id]
        ├── POST /api/share
        └── POST /api/upload

Next.js API Routes (Node.js runtime)
  └── Prisma ORM
        └── SQLite (local) / PostgreSQL (Neon on Vercel)
```

---

## App Router Usage

Page shells (`app/dashboard/page.tsx`, `app/editor/[id]/page.tsx`) are Server Components — they render the HTML frame and hand off to Client Components for interactivity. This keeps the initial JS bundle small.

All data fetching happens client-side on mount via `useEffect` + the `lib/api.ts` wrappers. No `getServerSideProps` or `loader` functions — kept intentionally simple.

---

## API Routes

| Route | Methods | Purpose |
|---|---|---|
| `/api/documents` | GET, POST | List all docs (with collaborators + files), create new doc |
| `/api/documents/[id]` | GET, PUT, DELETE | Fetch, update content/title, delete |
| `/api/share` | POST | Add a collaborator email to a document |
| `/api/upload` | POST | Accept a `.txt` file, write to `public/uploads/`, record in DB |

All routes return JSON. Errors return `{ error: string }` with an appropriate HTTP status.

---

## Database Design

Three models in `prisma/schema.prisma`:

- `Document` — id, title, content, owner (email string), createdAt, updatedAt
- `Collaborator` — id, email, documentId (FK → Document, cascade delete)
- `File` — id, name, path, documentId (FK → Document, cascade delete)

No `User` model — identity is just an email string. This keeps the schema minimal and avoids auth complexity.

---

## Sharing Logic

1. Owner opens editor → types an email in the Sidebar → hits "Add"
2. `POST /api/share` creates a `Collaborator` record linking that email to the document
3. On the dashboard, `GET /api/documents` returns all documents with their `collaborators` array
4. The frontend filters: "My Documents" = `doc.owner === currentUser`, "Shared With Me" = `doc.collaborators.some(c => c.email === currentUser)`
5. The user switcher reads all unique emails from the DB (owners + collaborators) and lets you switch identity via `localStorage`

---

## File Upload Flow

1. User selects a `.txt` file in the Sidebar
2. `POST /api/upload` receives the file via `FormData`, writes it to `public/uploads/<timestamp>-<filename>`, and creates a `File` record in the DB
3. The file is served by Next.js's static file handler at `/uploads/<filename>`
4. The Sidebar lists all attached files as download links

For production, `public/uploads/` would be replaced with S3 or similar — the API route would just change where it writes the file.

---

## Tradeoffs

| Decision | Reason |
|---|---|
| No authentication | Keeps scope tight; user = email string in localStorage |
| SQLite locally, PostgreSQL on Vercel | SQLite needs zero setup for local dev; Neon Postgres for serverless |
| Client-side data fetching | Simpler than SSR for this use case; skeleton loaders handle the loading state |
| Debounced auto-save (1.5s) | Avoids hammering the API on every keystroke |
| `public/uploads/` for files | No extra infra needed; acceptable for a demo |
| No real-time sync | WebSockets/polling would add significant complexity for marginal demo value |

---

## What Was Intentionally Left Out

- Real authentication (NextAuth, Clerk) — would obscure the core features for evaluators
- Real-time collaboration (WebSockets, CRDTs) — out of scope for the time available
- Role-based permissions beyond owner/collaborator — not needed for the demo
- Email notifications — no SMTP setup required
