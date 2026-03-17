# LaveDocs – Collaborative Document Editor

> Live demo: *(add after deployment)*

A production-quality collaborative document editor built with Next.js 14, Prisma, and TipTap.

## Features

- Simulated multi-user collaboration — switch accounts to demo shared access
- Document sharing via email — any added collaborator appears in the user switcher automatically
- Rich-text editing (bold, italic, underline, headings, lists, blockquote, code)
- Auto-save with debounce (1.5 s idle) + manual save button
- "My Documents" / "Shared With Me" dashboard tabs
- File attachments — upload `.txt` files with progress indicator
- Skeleton loading states, empty states, toast notifications
- Owner-only controls (rename, delete, add collaborators)
- Fully responsive down to 375 px

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js 14 (App Router)             |
| Language   | TypeScript                          |
| Styling    | Tailwind CSS + tailwindcss-animate  |
| Editor     | TipTap (ProseMirror)                |
| Database   | Prisma ORM + SQLite                 |
| Toasts     | react-hot-toast                     |
| Animation  | Framer Motion                       |
| Testing    | Jest + ts-jest                      |

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create the database and run migrations
npx prisma migrate dev --name init

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`.

---

## Running Tests

```bash
npm test
```

Three unit tests cover the document-filtering utility functions (`filterByOwner`, `filterShared`).

---

## Project Structure

```
app/
  api/
    documents/          GET list, POST create
    documents/[id]/     GET, PUT, DELETE single doc
    share/              POST add collaborator
    upload/             POST file upload
  dashboard/page.tsx    Dashboard route (server shell)
  editor/[id]/page.tsx  Editor route (server shell)
  layout.tsx            Root layout + Toaster
  globals.css           Tailwind base + CSS vars

components/
  Dashboard/
    DashboardClient.tsx  Full dashboard UI (client)
  Editor/
    EditorClient.tsx     Editor shell + auto-save
    Tiptap.tsx           TipTap editor wrapper
    MenuBar.tsx          Formatting toolbar
    Sidebar.tsx          Collaborators + attachments

lib/
  prisma.ts             Prisma singleton
  api.ts                Typed fetch wrappers
  types.ts              Shared TypeScript types
  utils.test.ts         Unit tests

prisma/
  schema.prisma         Document, Collaborator, File models
  dev.db                SQLite database (git-ignored in production)
```

---

## Assumptions

- Authentication is out of scope. The current user defaults to `lave@owner.com`. The user-switcher dropdown in the dashboard header is **dynamic** — every owner and collaborator email found in the database automatically appears as a switchable account. No hardcoded user list.
- File uploads are stored under `public/uploads/` and served statically by Next.js.
- SQLite is used for simplicity; swapping to PostgreSQL requires only a one-line change in `prisma/schema.prisma`.

---

## What's Complete

- [x] Next.js 14 App Router migration
- [x] Prisma + SQLite persistence (no localStorage)
- [x] All CRUD API routes
- [x] Sharing logic with collaborator deduplication
- [x] File upload (`.txt`) with progress indicator
- [x] Dashboard with "My Documents" / "Shared With Me" tabs
- [x] Rich-text editor with auto-save
- [x] Loading skeletons, empty states, error toasts
- [x] Mobile-responsive layout (375 px+)
- [x] Unit tests

## What's Incomplete / Future Work

- [ ] Real authentication (NextAuth.js / Clerk)
- [ ] Real-time collaborative editing (Yjs + WebSockets)
- [ ] PostgreSQL for production deployments
- [ ] Image / PDF file attachments
- [ ] Document versioning / history
- [ ] Search across documents
- [ ] Role-based permissions (viewer vs editor)
