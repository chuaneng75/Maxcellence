# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static marketing website for MAXcellence, a Singapore finance advisory firm. Plain HTML/CSS/JS — no framework, no build tool, no package manager, no test suite. Deployed via GitHub Pages with a custom domain (`CNAME` = `maxcellence.com.sg`).

## Commands

There is no build/lint/test tooling. To preview locally, serve the directory root with any static file server, e.g.:

```
python -m http.server 8000
```

Then open `http://localhost:8000/index.html`. Since GitHub Pages serves this repo's root directly, that's the accurate way to check a change before it goes live — opening the `.html` files directly via `file://` will also mostly work but skips server-relative-path edge cases.

## Structure

```
/
├── index.html, about.html, contact.html, industries.html, insights.html, services.html
├── css/styles.css
├── js/script.js
├── img/            (photos + processed logo assets)
├── CNAME           (GitHub Pages custom domain — must stay at repo root)
```

The six HTML pages must stay at the repo root: their filenames are live public URLs on the custom domain (e.g. `/about.html`), so renaming or relocating them breaks bookmarks/SEO. CSS/JS/images were deliberately factored into `css/`, `js/`, `img/` since those paths aren't public-facing.

## Architecture

**No templating — nav/footer are duplicated in every page.** Each of the 6 HTML files repeats the same `<nav class="site-nav">` and `<footer class="site-footer">` markup verbatim (including the `<head>` favicon/OG meta block). There is no includes/partials mechanism. **Any change to navigation links, footer content, the logo, or shared `<head>` meta must be manually replicated across all 6 files** — this is the most common source of inconsistency bugs in this repo. Active-page state is marked with `class="active"` on the corresponding nav link per file.

**Design system lives in `css/styles.css`**, defined as CSS custom properties on `:root`:
- Color palette: `--ink` (deep navy, primary text/dark sections), `--paper`/`--paper-alt` (platinum backgrounds), `--brass`/`--brass-dim` (steel-blue accent, dividers/highlights), `--red`/`--red-dim` (single accent color — reserved for primary CTAs only, not decorative use), `--slate` (muted/secondary text), `--line`/`--line-dark` (borders).
- Typography: `--display` (EB Garamond, headings), `--body` (Lato, body text), `--mono` (IBM Plex Mono, labels/eyebrows/buttons/nav). Loaded via a single Google Fonts `@import` at the top of the file.
- Layout tokens: `--max` (1180px content width), `--pad` (responsive side padding via `clamp()`).

**Reusable component classes** (defined once in `styles.css`, used across all pages):
- `.wrap` — max-width content container
- `.grid-2` / `.grid-3` / `.grid-4` — responsive grid layouts with their own breakpoints
- `.btn` + modifiers `.primary` / `.cta-red` / `.on-dark` / `.outline-on-dark`
- `.dash-list` (+ `.accent-red` modifier) — "—"-prefixed bullet lists
- `.eyebrow` (+ `.on-dark` modifier) — small uppercase mono label
- `.ledger` (+ `.on-dark` modifier) — decorative ruled-line section divider
- `.section-alt` / `.section-dark` — background variants for `<section>`
- `.reveal` — scroll-reveal animation hook; toggled to `.reveal.in` by an `IntersectionObserver` in `script.js`
- `.profile-grid` — fixed-width photo column + text column, used for the founder/director bio blocks on `about.html`
- `.portrait-photo` / `.portrait-placeholder` — team photo frame (4:5 aspect ratio) vs. a monogram placeholder for team members without a photo yet

One-off spacing/color tweaks are commonly done with inline `style=""` attributes directly in the HTML rather than new CSS classes — this is the established convention in this codebase; only patterns repeated 3+ times have been extracted into a shared class (e.g. `.dash-list`, `.form-field`).

**`js/script.js`** is a single vanilla-JS file, loaded on every page, handling three independent behaviors that each guard on the presence of their target element (safe to include site-wide even though not every page has every feature):
1. Mobile nav toggle (`.nav-toggle` button ↔ `.site-nav.open`)
2. Scroll-reveal via `IntersectionObserver` on all `.reveal` elements
3. Homepage hero slideshow (`#hero`) — crossfade timer, dot navigation, play/pause toggle, and `prefers-reduced-motion` handling

**Images**: some are hotlinked from Unsplash (stock photography on service/pillar cards); local team/brand assets live in `img/`. Note `img/logo.png` and `img/logo-on-dark.png` are processed derivatives of `img/logo.jpeg` (the original has a tagline and an opaque light-gray background, unsuitable to use directly) — cropped to just the wordmark with a transparent background, in a regular and a light-monochrome variant for use on dark sections (e.g. the footer).

Favicons are inline SVG data URIs in each page's `<head>` (no separate favicon file).
