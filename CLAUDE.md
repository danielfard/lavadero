# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lavadero** is a car wash management system built with SvelteKit 2 + Svelte 5 and TypeScript. It manages washing services, customers, employees, and vehicles. The backend is Supabase (PostgreSQL + Auth).

## Commands

```bash
npm run dev          # Dev server with hot reload
npm run build        # Production build
npm run check        # Type-check with svelte-check
npm run lint         # Check formatting (Prettier)
npm run format       # Auto-format code
npm test             # Run all unit tests (single run)
npm run test:unit    # Run unit tests in watch mode
```

## Architecture

### Routing & Data Flow

SvelteKit file-based routing under `src/routes/`. Each route pair:
- `+page.server.ts` — Supabase queries, form actions, auth guards
- `+page.svelte` — UI using data loaded from server

Key routes:
- `/login` — Email/password auth via Supabase
- `/menu` — Dashboard showing service counts (today, in-progress, completed)
- `/washing` — List/create washing services and clients
- `/washing/[id]` — Individual service detail

### Auth Middleware

`src/hooks.server.ts` runs on every request. It validates the Supabase session and redirects unauthenticated users to `/login`. Public routes that bypass auth: `/`, `/login`, `/register`, `/reset-password`.

### Forms

All forms use **Superforms** (sveltekit-superforms) with **Zod** schemas. Schemas live in `src/lib/schemas/`. Server actions validate with `superValidate`, client components use `superForm()` for reactive state and progressive enhancement.

### Database

Supabase tables: `washing`, `customers`, `employees`, `vehicles`. Queries are written inline in `+page.server.ts` files using the Supabase JS client (`@supabase/supabase-js`). The SSR client is created per-request via `@supabase/ssr`.

### Path Aliases

`@/*` resolves to `src/*` (configured in tsconfig.json and svelte.config.js).

## Code Style

- **Formatter**: Prettier with tabs, single quotes, 100-char print width, Svelte plugin
- **Styling**: TailwindCSS 4 + DaisyUI 5 utility classes — no custom CSS unless necessary
- **Language**: Spanish for UI text and variable names related to business domain; English for code structure/technical names
