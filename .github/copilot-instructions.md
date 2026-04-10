# GitHub Copilot Workspace Instructions

This workspace is a Next.js App Router dashboard starter built with TypeScript, Tailwind CSS, and Ant Design.

## Key facts

- Root: `my-app`
- Package manager: `pnpm`
- Framework: `next` App Router
- Language: `TypeScript`
- Styling: `tailwindcss` + Ant Design
- Data / API routes: `app/query/route.ts`, `app/seed/route.ts`
- UI components and page layout live under `app/ui` and `app/dashboard`

## Primary commands

- `pnpm dev` — start development server
- `pnpm build` — build production assets
- `pnpm start` — run production server

## Architecture overview

- `app/layout.tsx` — root layout and global styles
- `app/page.tsx` — homepage entry
- `app/dashboard/layout.tsx` and `app/dashboard/page.tsx` — dashboard route
- `app/dashboard/invoices/page.tsx` — invoices route
- `app/ui` — shared UI components and styles
- `app/lib` — data helpers, definitions, placeholder content, utilities
- `public/` — static assets

## Conventions for Copilot

- Prefer Next.js App Router conventions: server components by default, `use client` only where required.
- Preserve route segment hierarchy and nested layout behavior.
- Use existing UI component patterns in `app/ui`.
- Use the path alias `@/*` when adding imports if it matches the existing project style.
- Keep changes focused: update a single route, component, or utility at a time rather than rewriting unrelated sections.

## When editing code

- Check existing data access patterns in `app/lib/*` before adding new utilities.
- Match styles and spacing conventions already present in `app/ui` and `app/dashboard/*`.
- For new pages or features, follow the existing folder structure under `app/`.

## Notes

- There is no workspace-specific test runner configured in `package.json`.
- The README is minimal; use it as a lightweight reference only.
- Do not add new instructions files unless the change supports a new agent or workspace area.
