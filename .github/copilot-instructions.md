# GitHub Copilot Workspace Instructions

This repository is a Next.js App Router dashboard starter built with TypeScript, Tailwind CSS, and Ant Design.

## What this file is for

These instructions help Copilot and workspace automation understand the project’s architecture, conventions, and priorities. Keep content short, actionable, and focused on how to make safe, compatible edits.

## Key facts

- Root: `my-app`
- Package manager: `pnpm`
- Framework: `next` App Router
- Language: `TypeScript`
- Styling: `tailwindcss` + `antd`
- Path alias: `@/*` is configured in `tsconfig.json`
- Data / API routes: `app/query/route.ts`, `app/seed/route.ts`
- Shared UI components and page layout live under `app/ui`

## Primary commands

- `pnpm dev` — start development server
- `pnpm build` — build production assets
- `pnpm start` — run production server

> No workspace-specific test runner is configured in `package.json`.

## Architecture overview

- `app/layout.tsx` — root layout and global styles
- `app/page.tsx` — homepage entry
- `app/dashboard/layout.tsx` and `app/dashboard/page.tsx` — dashboard route
- `app/dashboard/analytics/page.tsx`, `app/dashboard/invoices/page.tsx`, `app/dashboard/leaderboard/page.tsx` — nested dashboard pages
- `app/ui` — shared UI components and reusable UI patterns
- `app/lib` — data helpers, domain definitions, placeholder content, utility functions
- `app/query/route.ts` and `app/seed/route.ts` — server API routes for data access and seeding
- `public/` — static assets and image files

## Conventions for Copilot

- Prefer Next.js App Router conventions: server components by default, add `use client` only when browser-only behavior or hooks are required.
- Honor the existing route segment hierarchy and nested layout behavior.
- Reuse existing shared UI components and dashboard patterns in `app/ui` instead of inventing new component families.
- Use the `@/*` path alias when it matches existing project style.
- Keep changes small and isolated: update one page, route, or component at a time rather than refactoring unrelated areas.

## When editing code

- Review current data access helpers in `app/lib/*` before introducing new utilities.
- Match the project’s spacing and styling conventions in `app/ui` and `app/dashboard/*`.
- Follow existing folder structure for new pages and layouts under `app/`.
- Prefer page-level or layout-level changes rather than broad restructuring unless the feature requires it.

## Notes

- The repository is a starter app for a course-style dashboard, so avoid adding unnecessary features or complexity.
- Use the README only as a lightweight reference; it is not a full architecture document.
- Keep workspace instruction updates minimal and relevant to this repository’s current shape.
