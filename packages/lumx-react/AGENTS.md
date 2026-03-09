# @lumx/react — Package Knowledge Base

React component library wrapping `@lumx/core` definitions. 57 components, exported from a single barrel `src/index.ts`.

## STRUCTURE

```
packages/lumx-react/src/
├── components/          # 57 components in kebab-case dirs
├── hooks/               # 30+ React hooks (co-located tests)
├── utils/               # React-specific utilities
│   ├── react/           # forwardRef, displayName helpers
│   ├── theme/           # ThemeContext, useTheme, ThemeProvider
│   ├── disabled/        # useDisableStateProps
│   ├── moving-focus/    # Focus management
│   ├── date/            # Date utilities
│   └── Portal/          # React Portal
├── stories/             # Storybook decorators, story utils
│   └── demos-generated/ # Auto-generated from site-demo MDX (never hand-edit)
├── testing/utils/       # commonTestsSuiteRTL, ThemeSentinel
└── index.ts             # Barrel — all public exports
```

## COMPONENT PATTERN

Each component directory follows this structure:

```
<component-name>/
├── ComponentName.tsx              # React component
├── ComponentName.test.tsx         # Unit tests
├── ComponentName.stories.tsx      # Storybook stories
├── ComponentName.test.stories.tsx # (optional) Storybook test stories (playwright)
└── index.ts                       # Public re-exports only
```

Multi-component families (Button, Chip, List, Tabs…) add siblings in the same dir: `ButtonGroup.tsx`, `IconButton.tsx`, etc.

## HOOKS

`src/hooks/` — 30+ standalone hooks (focus, keyboard navigation, boolean state, scroll, etc.), each with a co-located `.test.tsx`.

## TESTING

Two suites, both powered by Vitest:

### Unit tests (`*.test.tsx`)

Always call `commonTestsSuiteRTL` (from `@lumx/react/testing/utils`) — covers class forwarding, ref forwarding, prop forwarding, and theme (via prop + context). Add component-specific assertions after.

-   Env: jsdom, `IntersectionObserver` stubbed in `vitest.setup.ts`
-   `yarn test:react` — run all React unit tests

### Storybook tests (`*.stories.tsx`)

Run via **Vitest browser mode inside Playwright** — not a separate test runner:

-   Stories can include `play` functions for interaction testing
-   Screenshots are optionally taken per-story and diffed against baselines in `__vis__/`
-   Baselines are committed; local results land in `__vis__/local/` (not committed)
-   `yarn test:storybook:react` — run all Storybook tests for this package
-   Stories import meta/args from `@lumx/core/js/components/<Name>/Stories`
-   `demos-generated/` is auto-generated from site-demo — **never edit manually**

## STORYBOOK

-   Port **9000**, Vite-based — `yarn storybook:react`

## EXPORTS

`src/index.ts` and `src/utils/index.ts` are the **only** public surfaces. Every new component must be added here.
Also exports `@lumx/core/js/constants` and `@lumx/core/js/types` for consumer convenience.

## NOTES

-   `ReactToJSX<T>` utility type converts core prop types to React-compatible equivalents
-   `forwardRef` is a local wrapper (not React's) — use it from `@lumx/react/utils/react/forwardRef`
-   Update `CHANGELOG.md` and `src/index.ts` on every new component
