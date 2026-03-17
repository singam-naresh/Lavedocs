# Submission

## What's Included

| Path | Description |
|---|---|
| `app/` | Next.js 14 App Router pages and API routes |
| `components/` | Dashboard, Editor, Sidebar, MenuBar, TipTap wrapper |
| `lib/` | API wrappers, Prisma client, types, user store, unit tests |
| `prisma/` | Schema, migrations |
| `public/uploads/` | File upload directory (.gitkeep included) |
| `README.md` | Setup and feature overview |
| `ARCHITECTURE.md` | System design and decisions |
| `AI_USAGE.md` | AI tool usage and manual corrections |
| `SUBMISSION.md` | This file |

---

## How to Run Locally

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000 — redirects to /dashboard.

---

## Test Users

| Email | Role |
|---|---|
| lave@owner.com | Default owner — creates and manages documents |
| inareshofficial@gmail.com | Collaborator — receives shared documents |

To test sharing:
1. Default user is lave@owner.com
2. Create a document and open it
3. In the Sidebar, add inareshofficial@gmail.com as a collaborator
4. Go back to dashboard, click Switch Account, select inareshofficial@gmail.com
5. Shared With Me tab shows the document

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

## What's Fully Working

- Document creation, editing, renaming, deletion
- Rich text formatting (bold, italic, underline, headings, lists, code)
- Auto-save with debounce
- Collaborator sharing — add by email, appears in Shared With Me
- Dynamic user switcher — built from DB records, not hardcoded
- File upload (.txt) with attachment list in sidebar
- Owner-only permissions (rename, delete, add collaborators)
- Persistent storage (Prisma + SQLite locally, PostgreSQL on Vercel via Neon)

## What's Partial

- File uploads on Vercel — public/uploads/ is ephemeral on serverless; files don't persist between deployments (would need S3)

## What Would Be Improved With More Time

- Real authentication (NextAuth or Clerk)
- Real-time collaboration via WebSockets
- Document version history
- S3 for file storage
- Email notifications when a document is shared

---

## Demo Video

https://drive.google.com/file/d/1CKxfnEyGNcB9kFmz3aGcGEoXz13CNeg6/view?usp=drivesdk
