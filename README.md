# Canopy

**Visual sitemap editor** — plan site structure, content sections, and SEO fields in one place. Runs in the browser with local persistence; no account required.

Next.js
TypeScript
License

---

## Why Canopy?

- **Diagram-first IA** — Build and rearrange pages as a graph ([React Flow](https://reactflow.dev/)), with optional auto-layout ([Dagre](https://github.com/dagrejs/dagre)).
- **Sections per page** — Outline blocks and notes for each node; see a compact preview on the canvas.
- **SEO workspace** — Title, meta description, slug, H1, keyword, and page intent per selected page.
- **Projects** — Multiple maps stored locally via [Dexie](https://dexie.org/) (IndexedDB).
- **Export** — Download the map as **JSON** (round-trip) or **Markdown** (briefs, handoff).
- **Bilingual UI** — **English** and **Polish** ([next-intl](https://next-intl.dev/)); default locale is Polish with unprefixed URLs (`/`, `/app`), English at `/en` and `/en/app`.

---

## Tech stack


| Area        | Choice                                       |
| ----------- | -------------------------------------------- |
| Framework   | Next.js 16 (App Router), React 19            |
| Styling     | Tailwind CSS 4, shadcn-style UI (Radix)      |
| Canvas      | `@xyflow/react`                              |
| State       | Zustand                                      |
| Persistence | Dexie (IndexedDB)                            |
| i18n        | next-intl                                    |
| Tooling     | TypeScript, ESLint, Prettier, Bun-compatible |


---

## Getting started

**Requirements:** Node 20+ or [Bun](https://bun.sh/).

```bash
# install dependencies
bun install
# or: npm install

# development (Turbopack)
bun run dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — landing page. Editor: [http://localhost:3000/app](http://localhost:3000/app) (PL) or [http://localhost:3000/en/app](http://localhost:3000/en/app) (EN).

### Scripts


| Command             | Description             |
| ------------------- | ----------------------- |
| `bun run dev`       | Dev server + Turbopack  |
| `bun run build`     | Production build        |
| `bun run start`     | Start production server |
| `bun run lint`      | ESLint                  |
| `bun run typecheck` | `tsc --noEmit`          |
| `bun run format`    | Prettier (TS/TSX)       |


---

## Environment


| Variable               | Purpose                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for SEO/sitemap (no trailing slash). Defaults to `http://localhost:3000` in development. |


---

## Editor shortcuts


| Shortcut        | Action                                |
| --------------- | ------------------------------------- |
| `⌘K` / `Ctrl+K` | Focus search                          |
| `⌘D` / `Ctrl+D` | Duplicate selected page (not subtree) |
| `Del`           | Delete selection                      |
| `d`             | Toggle theme (via app chrome)         |


Double-click a node title to rename. Select a page to open the **sections / SEO** side panel.

---

## Project layout (high level)

```
app/
  [locale]/           # Localized routes (pl default, en under /en)
    page.tsx          # Landing
    app/page.tsx      # Editor
  layout.tsx          # Root (global CSS only)
components/           # UI + canvas (e.g. sitemap-canvas, sitemap-node)
hooks/store.ts        # Zustand store for graph + UI state
lib/                  # DB helpers, layout, site config
messages/             # en.json, pl.json (next-intl)
i18n/                 # routing, request config, navigation helpers
```

---

## shadcn / UI components

Add or update primitives with the shadcn CLI, for example:

```bash
npx shadcn@latest add button
```

Imports typically look like:

```tsx
import { Button } from "@/components/ui/button";
```

---

## Privacy

Map data stays in **your browser** (IndexedDB) unless you export a file. There is no built-in cloud sync.

---

## Name

**Canopy** — product name used in the UI and metadata. Repository package name: `visualsitemaps`.