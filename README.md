<div align="center">

# Canopy

**Plan site structure, content blocks, and SEO metadata on one living diagram** — in the browser, offline-friendly, no account.

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-compatible-000000?logo=bun&logoColor=white)](https://bun.sh/)

<br />

<a href="https://github.com/devmilek/canopy">
  <img
    src="https://github.com/devmilek/canopy/raw/main/public/EN.png"
    alt="Canopy — visual sitemap with sections and SEO panel"
    width="920"
  />
</a>

*Open Graph preview · [PNG on `main`](https://github.com/devmilek/canopy/blob/main/public/EN.png?raw=true)*

<br />

[**Repository**](https://github.com/devmilek/canopy) · [**Issues & ideas**](https://github.com/devmilek/canopy/issues)

</div>

---

## What you get

| Capability | Details |
|------------|---------|
| **Visual IA** | Drag nodes, connect parent → child, **auto-layout** (Dagre) so the tree stays readable. Double-click a label to rename. |
| **Per-page sections** | Add ordered blocks with name + notes; **compact preview** on each card on the canvas. |
| **SEO tab** | `<title>`, meta description, slug, H1, primary keyword, **page intent** — scoped to the selected node. Optional **sync slug → path segment** on the map. |
| **Projects** | Several sitemaps in one browser; **rename, duplicate, delete** projects from the toolbar. |
| **Persistence** | **Dexie / IndexedDB** — data stays on device until you export or clear storage. |
| **Export** | **JSON** for full round-trip / backup; **Markdown** for briefs, Notion, or handoff to devs & copy. |
| **Import** | Restore from a previously exported JSON file. |
| **Search** | `⌘K` / `Ctrl+K` jumps to **page search**; pick a match and the view **fits** that node. |
| **Duplicate page** | `⌘D` / `Ctrl+D` clones the **selected page** (not its children). |
| **i18n** | **Polish** (default, URLs `/` and `/app`) and **English** (`/en`, `/en/app`) via [next-intl](https://next-intl.dev/). |
| **Responsive** | Editor toolbar and **page plan panel** adapt on small screens (bottom sheet + overlay on mobile). |

---

## Under the hood

**Next.js 16** (App Router) · **React 19** · **[@xyflow/react](https://reactflow.dev/)** for the canvas · **Zustand** for graph + UI state · **Tailwind CSS 4** + Radix-style UI · **next-intl** for translations.

---

## Privacy

Your maps live in **IndexedDB in your browser**. Nothing is sent to a Canopy server for storage. Export only shares what **you** download.

---

## Development

```bash
bun install && bun run dev
```

Editor: `/app` (PL) · `/en/app` (EN). For correct canonical URLs and Open Graph in production, set `NEXT_PUBLIC_SITE_URL` (HTTPS, no trailing slash).

```bash
bun run build   # production
bun run lint    # eslint
bun run typecheck
```

---

## Name

**Canopy** is the product name in the UI. The npm package in this repo is `visualsitemaps`.
