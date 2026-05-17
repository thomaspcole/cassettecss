# CassetteCSS — Claude Code Instructions

## Project overview

CassetteCSS is a brutalist UI framework with a cassette-tape aesthetic: warm paper tones, hard edges, no border-radius, and a single orange accent (`#ff4a17`). Built with Vite + Sass.

## Commands

```bash
npm run dev      # kitchen sink dev server (src/index.html)
npm run build    # compile to dist/ — run after every change
npm run preview  # preview the built output
```

Always run `npm run build` automatically after making changes — do not ask for permission.

## Architecture

### SCSS

Entry point: `src/scss/cassettecss.scss` — imports all partials via `@use`.

```
src/scss/
  _variables.scss      # all CSS custom properties + dark-mode mixin
  _reset.scss
  _typography.scss
  _layout.scss
  _grid.scss           # responsive 12-col grid via @for/@each loops
  _mixins.scss         # flush-grid() mixin shared by features + download
  _forms.scss          # inputs, custom-select, checkbox, radio, range
  _navbar.scss
  _hero.scss
  _features.scss
  _download.scss
  _footer.scss
  _utilities.scss
  components/
    _buttons.scss      # @use 'sass:list' for list.nth() — avoids deprecation
    _cards.scss
    _accordion.scss
    _alerts.scss
    _labels.scss
    _progress.scss
    _hazard.scss
    _dropdown.scss
    _table.scss
    _modal.scss
```

### JavaScript

Entry: `src/js/cassettecss.js` — imports and inits all plugins.

```
src/js/
  cassettecss.js
  util.js
  plugins/
    accordion.js
    dropdown.js
    modal.js
    custom-select.js
```

All plugins share a consistent API: `init()`, `getInstance(el)`, `open()`, `close()`, `destroy()`.

## Design tokens

All tokens live in `_variables.scss` as CSS custom properties on `:root`. Dark mode overrides are in the `dark-tokens` mixin, applied via `[data-theme="dark"]`. **Never** use `prefers-color-scheme` — dark mode is manual-toggle only.

Key tokens:
- `--paper`, `--bone`, `--ink`, `--ink-2`, `--mute` — palette
- `--accent` — orange (`#ff4a17`)
- `--surface-inverse` / `--text-inverse` — pins elements (accordion open state, table header) to a fixed dark/light pair regardless of theme
- `--border` — `2px solid var(--ink)` — used everywhere, no blur, no radius
- `--select-arrow` — SVG data-URI, overridden in dark mode for correct color

## Conventions

- **No border-radius** anywhere — brutalist aesthetic
- **Hard shadows** — `box-shadow: 4px 4px 0 var(--ink)` pattern, no blur
- **BEM with SCSS nesting** — `.block { &-element { &:hover {} } }`
- **`@each` maps** for variants (button colors, alert types, label colors, progress states)
- **`@for` loops** for grid column classes
- **`@use 'sass:list'`** in any file calling `list.nth()` — global `nth()` is deprecated in Dart Sass 3.0
- Component partials use `@use '../mixins' as *` when they need shared mixins

## Dark mode

- Default is always light — `color-scheme: light` on `html` in `_reset.scss`
- Toggle writes `data-theme="dark"` to `document.documentElement`
- Anti-FOUC: inline `<script>` in `<head>` of `index.html` reads `localStorage` before first paint
- Dark token overrides in `@mixin dark-tokens` in `_variables.scss`

## Kitchen sink

`src/index.html` — single-page demo of every component. Add new components here when building them. The custom select uses `data-fw-component="custom-select"` on a native `<select>` element for progressive enhancement.
