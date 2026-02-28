# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server on port 4000 (client + server unified)
pnpm build        # Full production build (client → dist/spa/, server → dist/server/)
pnpm start        # Start production server
pnpm typecheck    # TypeScript validation
pnpm test         # Run Vitest tests
pnpm format.fix   # Format code with Prettier
```

## Architecture

Full-stack TypeScript app with three co-located directories:

- `client/` — React 18 SPA (Vite + React Router 6 + TailwindCSS 3 + Radix UI)
- `server/` — Express 5 API backend
- `shared/` — TypeScript interfaces shared by both (import via `@shared/*`)

**Dev setup:** Vite dev server runs on port 4000 with Express mounted as a Vite middleware plugin (`expressPlugin()`). No CORS issues in dev; client and server share the same origin.

**Production:** `pnpm build` outputs client to `dist/spa/` and server (ESM) to `dist/server/`. Express serves the client static files in production.

**Path aliases:** `@/*` maps to `client/`, `@shared/*` maps to `shared/`.

## Key Patterns

### API Fetching
Direct `fetch()` calls (no abstraction layer). `API_BASE` from `import.meta.env.VITE_API_BASE` defaults to `http://localhost:4000`. All API routes are prefixed `/api/`.

```typescript
const response = await fetch(`${API_BASE}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

### Authentication
JWT Bearer tokens stored in `localStorage` under the key `token`. Authenticated requests pass `Authorization: Bearer <token>`. Tokens expire after 7 days.

### State Management
No Redux or Zustand. State persisted via:
- `localStorage`: `token`, `user`, `healthProfileData` (questionnaire answers)
- `@tanstack/react-query` for server state and caching
- React `useState` for local component state

### Routing
All routes defined in `client/App.tsx`. Pages live in `client/pages/`. New routes must be added above the `<Route path="*" element={<NotFound />} />` catch-all.

### New API Route
1. Add shared types in `shared/api.ts` if needed
2. Create handler in `server/routes/<name>.ts`
3. Register in `server/index.ts`
4. Only create server endpoints when logic must stay server-side (private keys, DB operations)

### Styling
TailwindCSS 3 utility classes. Theme tokens in `client/global.css`. Pre-built Radix UI components in `client/components/ui/`. Use `cn()` (clsx + tailwind-merge) for conditional classes.

## Important Notes

- **Package manager:** Use `pnpm` — this project uses pnpm workspaces and lockfile.
- **TypeScript:** `strict: false` in `tsconfig.json` — type checking is relaxed.
- **Data storage:** Server uses in-memory `Map` — data is lost on restart. No database is wired up yet.
- **Passwords:** Stored in plain text in current implementation (no bcrypt).
- **Meal plans:** `server/routes/meal-plans.ts` returns mock/placeholder data.
- **Dark mode:** Class-based via Tailwind (`dark:` prefix), toggled on the `html` element.
