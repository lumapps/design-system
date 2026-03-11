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

# Build
yarn build:libs                # Build @lumx/icons + @lumx/core + @lumx/react + @lumx/vue
yarn build:react / :vue / :core / :icons

# Test
yarn test                      # All unit tests (Nx + vitest)
yarn test:storybook            # All storybook tests (Nx + vitest storybook)
yarn type-check                # TypeScript checking
```

## SKILLS (Claude)

| Skill               | When                                                     |
| ------------------- | -------------------------------------------------------- |
| `react-component`   | Scaffold new React component                             |
| `vue-docs`          | Add Vue demos + PropTable to docs                        |
| `migrate-component` | Move React-only → core/React/Vue architecture            |
| `visual-diffs`      | Debug visual diffs in Storybook screenshots              |

## NOTES

-   `postinstall` auto-builds `@lumx/icons` after `yarn install`
-   `storybook-static/` and `__vis__/` dirs are generated artifacts — never edit
-   Vue package uses **TSX** (not `.vue` SFCs) — `shims-tsx.d.ts` + `shims-vue.d.ts` handle typings
-   `site-demo` is private (not published); consuming docs live at design.lumapps.com
-   All packages share the same version (4.6.0) — bumped together on release
-   PR workflow: branch → PR → CI (lint + test + visual) → "need: review-frontend" label → approve → "need: test" → merge
