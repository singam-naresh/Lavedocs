# AI Usage

## Tools Used

- **Kiro (Claude-based AI IDE)** — primary tool used throughout the project for scaffolding, debugging, and refactoring
- **ChatGPT** — used occasionally for quick lookups and alternative approaches

---

## Where AI Helped

### Migration from Vite to Next.js 14
The original project was a Vite/React SPA. Kiro handled the full migration to Next.js 14 App Router — restructuring routes, converting React Router links to Next.js `<Link>`, replacing `react-toastify` with `react-hot-toast`, and swapping `lodash-es` for `lodash` (CJS-compatible for ts-jest).

### Prisma Setup
Kiro generated the initial `schema.prisma` with `Document`, `Collaborator`, and `File` models, set up the Prisma singleton in `lib/prisma.ts`, and scaffolded all five API routes with validation and error handling.

### Component Scaffolding
- `DashboardClient` — document list, tabs, create/delete/rename flow
- `EditorClient` — auto-save with debounce, title editing, collaborator management
- `Sidebar` — file upload with progress indicator, collaborator list
- `MenuBar` — TipTap toolbar with Lucide icons

### Vercel Deployment Fixes
Multiple build errors were debugged with AI assistance:
- TipTap version conflicts (`canInsertNode` not exported) — fixed by upgrading all TipTap packages to `2.27.2`
- `migration_lock.toml` provider mismatch (sqlite → postgresql)
- PostgreSQL migration SQL rewritten from SQLite syntax

### Documentation
All four documentation files were drafted with AI assistance based on the actual project structure and decisions made during development.

---

## What Was Manually Corrected

- **Debounce + stale closure bug** — the `useCallback` + `debounce` pattern had a stale `docId` reference. Fixed manually using a `useRef` to always capture the latest document ID.
- **User switcher logic** — the initial implementation used a hardcoded user list. Manually reworked to query all unique emails from the DB (owners + collaborators) so new collaborators automatically appear in the switcher.
- **Email case sensitivity** — comparisons like `doc.owner === currentUser` were manually updated to `.toLowerCase().trim()` throughout to prevent mismatches.
- **Owner-only permissions** — rename, delete, and add-collaborator actions are gated to the document owner. This logic was manually reviewed and tightened.
- **Dashboard re-fetch on focus** — added `window.addEventListener('focus', loadDocs)` manually so the dashboard picks up collaborators added in another tab.

---

## How Correctness Was Verified

- TypeScript diagnostics run after every file change — zero type errors across all files
- `npx jest` — 3 passing unit tests covering `filterByOwner` and `filterShared` logic
- Manual end-to-end testing: create doc → add collaborator → switch user → verify "Shared With Me" shows the doc
- Vercel build logs reviewed after each push to confirm clean compilation
