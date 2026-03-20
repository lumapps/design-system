# @lumx/icons — Package Knowledge Base

Icon library built on Material Design Icons v5 with LumApps custom overrides and aliases. Provides SVG path strings for programmatic use.

## STRUCTURE

```
packages/lumx-icons/
├── index.ts             # Source: imports from dist (generated)
├── build.cjs            # Generates JS (ESM/CJS) from JSON icon library
├── font.scss            # Font-icon SCSS (deprecated path)
├── override/
│   ├── override-icons/  # Custom SVG files + config.json (unicode/replacement mappings)
│   ├── alias-icons.js   # Icon aliases for backward compat and brand renaming
│   └── generate/        # Generation scripts (run-all.cjs orchestrates everything)
└── dist/                # Generated output (never hand-edit)
    ├── esm/
    ├── cjs/
    └── override/
```

## HOW ICONS WORK

**Consumers import SVG path strings**, not SVG files:

```typescript
import { mdiCheck, mdiClose } from '@lumx/icons';
// mdiCheck === 'M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.57L21,7Z'
```

**Generation pipeline** (run via `yarn generate:icons`):

1. Fetch MDI v5 icon set (SVG → path extraction)
2. Merge with `override/override-icons/` custom SVGs
3. Apply `alias-icons.js` mappings (renames for backward compat + brand icons)
4. Output to `dist/` as ESM + CJS modules

## ADDING/MODIFYING ICONS

**New custom icon:** Add SVG to `override/override-icons/` and add entry in `config.json`

**Alias (backward compat):** Add to `override/alias-icons.js`

**After any change:** Run `yarn generate:icons` in this package

## NOTES

-   Font-based icons (`.mdi` CSS class) are **deprecated** — always use SVG path approach
-   MDI icons are named `mdi<PascalCaseName>` (e.g. `mdiAccountCircle`)
-   Custom/brand icons follow same naming convention
-   `postinstall` in root runs `yarn build:icons` automatically — consumers always get fresh build
-   Rollup plugin `rollup-plugin-optimize-imports-lumx-icons` (in dev-packages) tree-shakes icon imports in consumers
