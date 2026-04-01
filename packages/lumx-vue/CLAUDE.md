# @lumx/vue — Package Knowledge Base

Vue 3 component library wrapping `@lumx/core` definitions. 27 components, written in **TSX** (not `.vue` SFCs).

## STRUCTURE

```
packages/lumx-vue/src/
├── components/          # 27 components in kebab-case dirs (TSX files)
├── composables/         # 14 Vue composables (useTheme, useDisableStateProps, useFocus…)
├── utils/               # Vue-specific utilities
│   ├── VueToJSX.ts      # VueToJSXProps<T> type converter
│   ├── Portal/          # Vue teleport wrapper
│   ├── ClickAway/       # Click-outside composable
│   └── theme/           # ResetTheme, theme utilities
├── stories/demos-generated/ # Auto-generated — never hand-edit
├── testing/             # commonTestsSuiteTL for Vue
├── shims-tsx.d.ts       # JSX type shims for TSX in Vue
├── shims-vue.d.ts       # Vue module shims
└── index.ts             # Barrel — all public exports
```

## COMPONENT PATTERN

**Critical:** Vue components use `.tsx` extension with `defineComponent`, **NOT** `.vue` SFCs.

Look into `migrate-component` skill for more details.

Each component directory follows this structure:

```
<component-name>/
├── ComponentName.tsx              # Vue component (TSX)
├── ComponentName.test.ts          # Unit tests
├── ComponentName.stories.ts       # Storybook stories
├── ComponentName.test.stories.ts  # (optional) Storybook test stories (playwright)
└── index.ts                       # Public re-exports only
```

Multi-component families (Button, Chip, List, Tabs…) add siblings in the same dir: `ButtonGroup.tsx`, `IconButton.tsx`, etc.

## COMPOSABLES

`src/composables/` — the Vue equivalent of lumx-react hooks (theme, disabled state, focus, keyboard, slots, etc.), each with a co-located `.test.ts`.

### `useClassName` — merging `class` prop with `className` attr

Core JSX components pass `className` (React convention) when rendering Vue sub-components. Since `className` is not a declared Vue prop, it lands in `$attrs`. The `useClassName` composable merges `props.class` and `attrs.className` using `classNames.join()`.

**Rules:**

-   **All Vue components that forward `class` to a core UI** must use `useClassName`
-   **Always pass a getter** `() => props.class` — not `props.class` directly. `props.class` dereferences to a plain string at setup time, losing reactivity. The getter defers access into the composable's internal `computed()`.

### `useAttrFallback` — falling back to `$attrs` for React-named props

When a core JSX component renders a Vue sub-component, it passes props using React naming conventions (e.g. `className`, `tabIndex`). Since these are not declared Vue props, they land in `$attrs`. `useAttrFallback` reads the fallback attr and merges it with the corresponding Vue prop using `??` (or a custom merge function). Returns a `ComputedRef`.

`useClassName` is built on top of `useAttrFallback`. Use `useAttrFallback` directly for other React-named attrs like `tabIndex`.

## TESTING

Two suites, both powered by Vitest:

### Unit tests (`.test.ts`)

Always call `commonTestsSuiteTL` (from `@lumx/core/testing/`) — covers class name, theme, and prop forwarding. Add component-specific assertions after.

-   Framework: Vitest + `@testing-library/vue`
-   `yarn test:vue` — run all Vue unit tests

### Storybook tests (`.stories.ts`)

Run via **Vitest browser mode inside Playwright** — not a separate test runner:

-   Stories can include `play` functions for interaction testing
-   Screenshots are optionally taken per-story and diffed against baselines in `__vis__/`
-   Baselines are committed; local results land in `__vis__/local/` (not committed)
-   `yarn test:storybook:vue` — run all Storybook tests for this package
-   `demos-generated/` auto-generated — **never edit manually**

## STORYBOOK

-   Port **9001**, Vite-based — `yarn storybook:vue`

## NOTES

-   TSX in Vue requires `shims-tsx.d.ts` — already configured, don't change
-   Build tool: Vite (not Rollup)
-   `VueToJSXProps<T>` converts core prop types to Vue-compatible equivalents
-   `keysOf<Props>()` helper generates Vue `props` array from TypeScript type
-   Default export is the component; named exports are `CLASSNAME`, `COMPONENT_NAME`, etc.
