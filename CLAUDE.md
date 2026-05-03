# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev            # Start dev server on port 4000 (client + server unified)
pnpm build          # Full production build (client → dist/spa/, server → dist/server/)
pnpm build:client   # Client build only
pnpm build:server   # Server build only (vite.config.server.ts)
pnpm start          # Start production server (node dist/server/node-build.mjs)
pnpm typecheck      # TypeScript validation
pnpm test           # Run Vitest tests (only test file: client/lib/utils.spec.ts)
pnpm format.fix     # Format code with Prettier
```

## Architecture

Full-stack TypeScript app with three co-located directories:

- `client/` — React 18 SPA (Vite + React Router 6 + TailwindCSS 3 + Radix UI)
- `server/` — Express 5 API backend
- `shared/` — TypeScript interfaces shared by both (import via `@shared/*`)

**Dev setup:** Vite dev server runs on port 4000 with Express mounted as a Vite middleware plugin (`expressPlugin()`). No CORS issues in dev; client and server share the same origin.

**Production:** `pnpm build` outputs client to `dist/spa/` and server (ESM) to `dist/server/`. Express serves the client static files in production.

**Path aliases:** `@/*` maps to `client/`, `@shared/*` maps to `shared/`.

## Server Routes

All routes registered in `server/index.ts`. Route files in `server/routes/`:

- `auth.ts` — `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/profile`, `POST /api/auth/logout`
- `health-profile.ts` — `POST/GET/DELETE /api/health-profile` (user questionnaire data)
- `meal-plans.ts` — `POST /api/meal-plans/generate`, `GET /api/meal-plans/latest`, `GET /api/meal-plans` (paginated), `DELETE /api/meal-plans/:id`
- `demo.ts` — `GET /api/demo` (health check)

**JWT auth:** Each route file has its own `verifyToken()` or `extractUserIdFromToken()` helper — there is no shared auth middleware. JWT secret from `process.env.JWT_SECRET` (hardcoded fallback `'supersecret_change_me'`).

## Core User Flow

`/create-plan` (multi-step questionnaire, 15+ questions) → saves answers to `localStorage` as `healthProfileData` → POSTs to `/api/health-profile` → navigates to `/analyzing` (loading state) → `/results` (displays generated meal plan).

`/change-password` exists as a page but is **not yet wired to a backend endpoint**.

## Key Patterns

### API Fetching
Direct `fetch()` calls (no abstraction layer). `API_BASE` exported from `@shared/api` (`import.meta.env.VITE_API_BASE`, defaults to `http://localhost:4000`). All API routes are prefixed `/api/`.

```typescript
import { API_BASE } from "@shared/api";

const response = await fetch(`${API_BASE}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
```

### Authentication
JWT Bearer tokens stored in `localStorage` under the key `token`. Authenticated requests pass `Authorization: Bearer <token>`. Tokens expire after 7 days. User object stored in `localStorage` under `user` (JSON-serialized).

### Validation
Zod is used for request validation on the server (route handlers) and form validation on the client (via `@hookform/resolvers/zod`). Shared types in `shared/api.ts`.

### State Management
No Redux or Zustand. State persisted via:
- `localStorage`: `token`, `user`, `healthProfileData` (questionnaire answers)
- `@tanstack/react-query` v5 for server state and caching (available but minimally used)
- React `useState` for local component state

### Routing
All routes defined in `client/App.tsx`. Pages live in `client/pages/`. New routes must be added above the `<Route path="*" element={<NotFound />} />` catch-all.

### New API Route
1. Add shared types in `shared/api.ts` if needed
2. Create handler in `server/routes/<name>.ts`
3. Register in `server/index.ts`
4. Only create server endpoints when logic must stay server-side (private keys, DB operations)

### Styling
TailwindCSS 3 utility classes. Theme tokens in `client/global.css` (HSL CSS variables: `--brand-blue`, `--brand-purple`, `--page-bg`). Custom Tailwind colors: `brand.blue`, `brand.purple`, `page-bg`. Pre-built Radix UI components in `client/components/ui/`. Use `cn()` from `@/lib/utils` (clsx + tailwind-merge) for conditional classes.

### Animation & 3D
Framer Motion 12 and Three.js (`@react-three/fiber` + `@react-three/drei`) are installed. Recharts 2 is available for data visualization.

## Environment Variables

```
VITE_API_BASE=http://localhost:4000   # Client-side API base URL
JWT_SECRET=<secret>                   # Server JWT signing key (no default in prod)
PORT=3000                             # Production server port
```

## Important Notes

- **Package manager:** Use `pnpm` — this project uses pnpm workspaces and lockfile.
- **TypeScript:** `strict: false` in `tsconfig.json` — type checking is relaxed.
- **Data storage:** Server uses in-memory `Map` — data is lost on restart. No database is wired up yet.
- **Passwords:** Stored in plain text in current implementation (no bcrypt).
- **Meal plans:** `server/routes/meal-plans.ts` returns mock/placeholder data.
- **Dark mode:** Class-based via Tailwind (`dark:` prefix), toggled on the `html` element.
