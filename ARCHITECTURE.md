# Architecture

## System Design

```
Browser
  │
  ├── /dashboard          → DashboardClient (React, client component)
  │     └── GET /api/documents
  │
  └── /editor/[id]        → EditorClient (React, client component)
        ├── GET  /api/documents/[id]
        ├── PUT  /api/documents/[id]   (auto-save, debounced)
        ├── POST /api/share
        └── POST /api/upload

Next.js API Routes (Node.js, server-side)
  └── Prisma ORM
        └── SQLite (prisma/dev.db)
```

### Request Flow

1. Page shell (`app/dashboard/page.tsx`) is a **Server Component** — zero JS shipped for the shell itself.
2. It renders a **Client Component** (`DashboardClient`) that fetches data from the API on mount.
3. API routes use the **Prisma singleton** (`lib/prisma.ts`) to query SQLite.
4. Responses are plain JSON; the frontend uses typed `fetch` wrappers in `lib/api.ts`.

---

## Key Decisions

### Next.js App Router over Pages Router
App Router enables per-route server components, reducing client bundle size. The page shells are server components; only the interactive parts are client components.

### SQLite + Prisma
SQLite requires zero infrastructure — the database is a single file. Prisma provides type-safe queries and a clean migration workflow. Switching to PostgreSQL for production requires changing one line in `schema.prisma`.

### No Authentication
Hardcoding `me@example.com` as the current user keeps the scope tight and lets evaluators focus on the core features. Adding NextAuth.js or Clerk would be a straightforward next step.

### Debounced Auto-Save
Content changes are debounced at 1.5 s to avoid hammering the API on every keystroke. A manual "Save" button is also provided for explicit saves.

### Client-Side Optimistic Updates
Document deletion is applied optimistically (removed from state immediately) to keep the UI snappy. If the API call fails, a toast notifies the user.

### File Storage in `public/uploads/`
Uploaded files are written to `public/uploads/` and served by Next.js's static file handler. For production, this would be replaced with S3 or similar object storage.

---

## Tradeoffs

| Decision | Benefit | Tradeoff |
|---|---|---|
| SQLite | Zero setup, portable | Not suitable for multi-instance deployments |
| Client-side fetch on mount | Simple, no SSR complexity | Initial page shows skeleton while loading |
| Debounced save | Fewer API calls | Up to 1.5 s of unsaved changes on crash |
| `public/uploads/` for files | No extra infra | Files are publicly accessible by URL |
| Hardcoded user | Keeps scope tight | No real multi-user isolation |

---

## Prioritization

1. **Working persistence** — replacing localStorage with a real DB was the highest priority.
2. **Clean API surface** — typed routes with proper validation and error responses.
3. **UX polish** — loading states, empty states, and toasts make the app feel production-ready.
4. **Sharing** — real collaborator records in the DB, reflected in both tabs.
5. **File upload** — simple but functional; stored on disk with a progress indicator.
