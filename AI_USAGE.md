# AI Usage

## Tools Used

- **Kiro (Claude-based AI IDE)** — primary tool for scaffolding, code generation, and refactoring throughout the project.

---

## Where AI Helped

### Scaffolding
- Generated the initial Next.js 14 App Router project structure from the Vite/React SPA.
- Created all Prisma schema models (`Document`, `Collaborator`, `File`) and the migration setup.
- Scaffolded all five API routes with proper validation and error handling.

### Component Migration
- Converted React Router `<Link>` / `useNavigate` to Next.js `<Link>` / `useRouter`.
- Replaced `react-toastify` with `react-hot-toast` (better Next.js compatibility).
- Replaced `lodash-es` (ESM-only) with `lodash` (CJS, compatible with ts-jest).

### UX Improvements
- Generated skeleton loader components, empty state UI, and the save-status indicator.
- Added the TipTap `Placeholder` extension with the correct CSS hook.
- Implemented the upload progress bar (simulated with `setInterval`).

### Documentation
- Drafted all four documentation files (`README.md`, `ARCHITECTURE.md`, `AI_USAGE.md`, `SUBMISSION.md`).

---

## What Was Modified Manually

- **Debounce dependency array** — the `useCallback` + `debounce` pattern required careful manual review to avoid stale closures. The `docIdRef` pattern was added manually to ensure the debounced save always uses the correct document ID.
- **Sidebar responsiveness** — the sidebar is hidden on mobile (`hidden lg:flex`) to keep the editor usable on small screens; this was a deliberate manual decision.
- **Optimistic deletion** — switching from `loadDocs()` after delete to `setDocs(prev => prev.filter(...))` was a manual improvement for perceived performance.
- **Jest config** — `testMatch` was scoped to `lib/**/*.test.ts` to exclude the legacy `src/lib/utils.test.ts` file that has no `describe` blocks.

---

## How Correctness Was Verified

1. **TypeScript** — `getDiagnostics` was run after every file change; zero type errors across all files.
2. **Unit tests** — `npx jest` confirmed 3 passing tests covering the document-filtering logic.
3. **Manual review** — each API route was read and checked for correct Prisma queries, HTTP status codes, and error handling.
4. **Prisma migration** — `npx prisma migrate dev` was run successfully, confirming the schema is valid and the SQLite database was created.
