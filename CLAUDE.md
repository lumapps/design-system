# LumX Design System — Project Knowledge Base

## OVERVIEW

LumX is LumApps' design system: a dual-framework (React + Vue 3) component library built on a shared framework-agnostic core. Published as `@lumx/core`, `@lumx/react`, `@lumx/vue`, `@lumx/icons`.

## STRUCTURE

```
design-system/
├── packages/
│   ├── lumx-core/       # @lumx/core — design tokens, SCSS, shared types/utils, JSX component defs
│   ├── lumx-react/      # @lumx/react — React wrappers over core (57 components)
│   ├── lumx-vue/        # @lumx/vue — Vue 3 wrappers over core (27 components, TSX syntax)
│   ├── lumx-icons/      # @lumx/icons — icon library (Material Design Icons + custom overrides)
│   └── site-demo/       # Documentation site (Gatsby + MDX, NOT published to npm)
├── dev-packages/        # Internal tools: eslint configs, rollup plugins, storybook/visual testing
├── configs/             # Shared build configs (postcss, terser)
└── .github/workflows/   # 8 CI/CD workflows
```

## WHERE TO LOOK

| Task                         | Location                                          |
| ---------------------------- | ------------------------------------------------- |
| Add/modify component (React) | `packages/lumx-react/src/components/<name>/`      |
| Add/modify component (Vue)   | `packages/lumx-vue/src/components/<name>/`        |
| Shared component logic       | `packages/lumx-core/src/js/components/<Name>/`    |
| Design tokens (source)       | `packages/lumx-core/style-dictionary/properties/` |
| SCSS component styles        | `packages/lumx-core/src/scss/components/<name>/`  |
| Shared types                 | `packages/lumx-core/src/js/types/`                |
| Shared utilities             | `packages/lumx-core/src/js/utils/`                |
| React hooks                  | `packages/lumx-react/src/hooks/`                  |
| Vue composables              | `packages/lumx-vue/src/composables/`              |
| Icons                        | `packages/lumx-icons/`                            |
| Docs/demo pages              | `packages/site-demo/content/product/`             |

## CORE ARCHITECTURE

**Three-layer pattern** — ALL components follow this:

1. **Core** (`@lumx/core/js/components/<Name>/`): Framework-agnostic JSX component definition, props interface, `COMPONENT_NAME`, `CLASSNAME`, `DEFAULT_PROPS`
2. **React** (`@lumx/react/src/components/<name>/`): Wraps core with React-specific bindings (`forwardRef`, theme context, `useDisableStateProps`, event handlers)
3. **Vue** (`@lumx/vue/src/components/<name>/`): Wraps core using `defineComponent` (TSX, NOT `.vue` files), composables, `emitSchema`

New components: **always implement in core first**, then add React/Vue wrappers. Use `migrate-component` skill for guidance.

## CONVENTIONS

**TypeScript:**

-   Strict mode enabled. No `as any`, no `@ts-ignore`.
-   Path aliases: `@lumx/react/*` → `packages/lumx-react/src/*`, etc.
-   `GenericProps` is the base for all component props

**Formatting:** 4-space indent, 120-char line width, single quotes, trailing commas (enforced by Prettier + ESLint)

**CSS/BEM:** Class format `lumx-<component>[__element][--modifier]` — validated by stylelint BEM pattern

## TESTING

Two suites, both powered by Vitest:

**Unit tests** (`*.test.tsx` / `*.test.ts`) — co-located with components, never in `__tests__/`:

-   Runner: Vitest 4.x, jsdom environment
-   Library: `@testing-library/react` (React) or `@testing-library/vue` (Vue)
-   Always use `commonTestsSuiteRTL` (React) / `commonTestsSuiteTL` (core/Vue) for standard prop-forwarding, class, and theme assertions
-   Setup file stubs `IntersectionObserver`

**Storybook tests** (`*.stories.tsx` / `*.stories.ts`) — Vitest browser mode running inside Playwright:

-   Stories can define `play` functions for interaction testing
-   Screenshots are optionally taken and diffed against baselines stored in `__vis__/`
-   `yarn test:storybook` — runs all Storybook tests across React and Vue

## COMMANDS

```bash
# Dev
yarn storybook:react           # Storybook React on :9000
yarn storybook:vue             # Storybook Vue on :9001
yarn start                     # Demo site on :4000

# Code checks
yarn lint                      # Lint
yarn type-check                # TypeScript checking

# Build
yarn build:libs                # Build @lumx/icons + @lumx/core + @lumx/react + @lumx/vue
yarn build:react / :vue / :core / :icons

# Test
yarn test                      # All unit tests (Nx + vitest)
yarn test:storybook            # All storybook tests (Nx + vitest storybook)
yarn test:all                  # All unit tests + storybook tests

# Per-package test commands
yarn test:react / :vue / :core
yarn test:storybook:react / :storybook:vue

# Filtering tests — all test commands accept vitest args after `--`:
#   File pattern (positional arg): matches test file names
#   Test name pattern (--testNamePattern): filters by test name (regex)
# Example:
yarn test -- Button.test.tsx                           # unit tests in files matching Button.test.tsx
yarn test:react -- Button.test.tsx --testNamePattern="hasBackground"  # single-word name
yarn test:react -- Button.test.tsx --testNamePattern="should.render"  # multi-word: use regex dots (spaces break through nx)
yarn test:storybook -- Button.stories.tsx --testNamePattern="Default"
# NOTE: -t is consumed by nx (alias for --targets) — always use --testNamePattern instead

# Nx caching and test filtering:
# - Every unique arg combination (file pattern + testNamePattern) gets its own cache entry
# - Filtered runs never warm the full-suite cache and vice versa — no interference
# - Use --skipNxCache when debugging to always get a fresh run and avoid stale cached output
yarn test:react --skipNxCache -- Button.test.tsx --testNamePattern="hasBackground"
# - To fully clear local cache: yarn nx reset --only-cache
```

## SKILLS (Claude)

| Skill               | When                                          |
| ------------------- | --------------------------------------------- |
| `react-component`   | Scaffold new React component                  |
| `vue-docs`          | Add Vue demos + PropTable to docs             |
| `migrate-component` | Move React-only → core/React/Vue architecture |
| `visual-diffs`      | Debug visual diffs in Storybook screenshots   |

## NOTES

-   `postinstall` auto-builds `@lumx/icons` after `yarn install`
-   `storybook-static/` and `__vis__/` dirs are generated artifacts — never edit
-   Vue package uses **TSX** (not `.vue` SFCs) — `shims-tsx.d.ts` + `shims-vue.d.ts` handle typings
-   `site-demo` is private (not published); consuming docs live at design.lumapps.com
-   All packages share the same version (4.6.0) — bumped together on release
-   PR workflow: branch → PR → CI (lint + test + visual) → "need: review-frontend" label → approve → "need: test" → merge

## PACKAGE DETAILS

Load the relevant file when working in a specific package:

-   `packages/lumx-core/CLAUDE.md`
-   `packages/lumx-react/CLAUDE.md`
-   `packages/lumx-vue/CLAUDE.md`
-   `packages/lumx-icons/CLAUDE.md`
-   `packages/site-demo/CLAUDE.md`
-   `dev-packages/CLAUDE.md`
