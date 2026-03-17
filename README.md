# LaveDocs

A collaborative document editor built with Next.js 14, TipTap, and Prisma. Supports rich text editing, document sharing via email, file attachments, and persistent storage — no authentication required.

Live demo: https://lavedocs.vercel.app

---

## Features

- Create, rename, and delete documents
- Rich text editor (bold, italic, underline, headings, lists, code blocks)
- Share documents with other users by email
- "My Documents" and "Shared With Me" views
- Upload `.txt` files and attach them to documents
- Auto-save with debounce (1.5s)
- User switcher — switch between owner and collaborator accounts
- Persistent storage via Prisma + PostgreSQL (Neon on Vercel, SQLite locally)

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | Next.js 14 App Router, TypeScript |
| Styling  | TailwindCSS                       |
| Editor   | TipTap                            |
| Backend  | Next.js API Routes                |
| ORM      | Prisma                            |
| Database | SQLite (local) / PostgreSQL (prod)|

---

## Project Structure

```
app/
  api/documents/     → CRUD API for documents
  api/share/         → Add collaborators
  api/upload/        → File upload handler
  dashboard/         → Dashboard page
  editor/[id]/       → Editor page
components/
  Dashboard/         → DashboardClient
  Editor/            → EditorClient, Tiptap, MenuBar, Sidebar
lib/
  api.ts             → Typed fetch wrappers
  prisma.ts          → Prisma singleton
  types.ts           → Shared TypeScript types
  user.ts            → localStorage-backed current user
prisma/
  schema.prisma      → DB schema
  migrations/        → Migration history
public/uploads/      → Uploaded files (local dev)
```

---

## Setup

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

App runs at `http://localhost:3000`.

---

## Testing the Sharing Flow

1. Open the app — default user is `lave@owner.com`
2. Create a document
3. Open the editor → Sidebar → add collaborator: `inareshofficial@gmail.com`
4. Click "Switch Account" on the dashboard → select `inareshofficial@gmail.com`
5. The shared document appears under "Shared With Me"

---

## Limitations

- No real authentication — user identity is stored in `localStorage`
- File uploads are stored in `public/uploads/` (not suitable for multi-instance production)
- No real-time collaboration — changes from one user are not pushed to another live
- Collaborator list is built from existing DB records, not a user registry
