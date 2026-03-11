---
name: visual-diffs
description: >
    Debug visual differences in LumX design system Storybook screenshots. Covers both
    cross-framework diffs (React vs Vue pixel mismatches) and intra-framework diffs
    (baseline regressions within React or Vue). Use when visual-diffs report shows
    differences, when `yarn visual-diffs` produces diff images, when migrating components
    to Vue and need visual parity, or when Storybook screenshots change unexpectedly.
---

# Debugging Visual Diffs

## Quick Start

```bash
yarn visual-diffs                    # Generate full report (runs storybook tests first)
yarn workspace @lumx/react test:storybook:visual   # React screenshots only
yarn workspace @lumx/vue test:storybook:visual     # Vue screenshots only
```

Output lands in `visual-diffs/` at repo root. Inspect diff images in:

-   `visual-diffs/cross-framework/` — React vs Vue comparison
-   `visual-diffs/react/` or `visual-diffs/vue/` — intra-framework baseline diffs

Each diff directory contains `react.png`, `vue.png`, and `diff.png` (or `baseline.png`, `current.png`, `diff.png` for intra-framework).

## Debugging Workflow

### Step 1: Read the diff images

Open the diff PNG (red/yellow pixels = mismatches). Compare `react.png` vs `vue.png` side-by-side. Classify the issue:

| Observation                                  | Likely Cause                        |
| -------------------------------------------- | ----------------------------------- |
| Content missing entirely (blank vs rendered) | Slot/children mapping broken        |
| Text present but shifted                     | Layout/spacing CSS difference       |
| Colors/backgrounds differ                    | Theme or state class mismatch       |
| Elements present but wrong size              | Missing prop (size, emphasis)       |
| Structural differences (extra/missing DOM)   | Component implementation divergence |

### Step 2: Compare story definitions

Stories are defined in a three-layer architecture:

```
@lumx/core/js/components/<Name>/<Name>Stories.tsx   ← shared args, render, decorators
  ↓ imported by
@lumx/react/src/components/<name>/<Name>.stories.tsx ← React-specific wiring
@lumx/vue/src/components/<name>/<Name>.stories.tsx   ← Vue-specific wiring (slot mapping)
```

Check the Vue story file for a custom `render` function that maps props to slots.

### Step 3: Fix and verify

After fixing, re-run visual diffs. **Important**: Nx caches results aggressively. Bypass with:

```bash
NX_SKIP_NX_CACHE=true yarn visual-diffs
```

Or invalidate only the changed package:

```bash
yarn workspace @lumx/vue test:storybook:visual   # re-run Vue screenshots
yarn visual-diffs                                  # regenerate report
```

### Screenshot pipeline

```
Storybook stories (.stories.tsx)
  → Vitest browser mode (Playwright/Chromium, headless)
    → storybook-addon-vis captures screenshots
      → __vis__/local/__results__/   (current run)
      → __vis__/local/__baselines__/ (accepted baselines)
      → __vis__/local/__diffs__/     (pixel diffs vs baseline)

yarn visual-diffs
  → cross-framework-diff.js (pixelmatch: threshold=0.1, min 30px + 0.01%)
    → visual-diffs/cross-framework/  (react.png, vue.png, diff.png)
  → generate-report.js
    → visual-diffs/Visual-Reports-PR-N.md
```

### Nx caching

The `visual-diffs` target depends on `test:storybook:visual` for both `@lumx/react` and `@lumx/vue`. Nx caches based on `storybookFiles` input set (source files + `.storybook/` config). Changes to core story files (`@lumx/core`) may not invalidate the cache automatically — use `NX_SKIP_NX_CACHE=true` when in doubt.
