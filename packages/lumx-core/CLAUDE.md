# @lumx/core — Package Knowledge Base

Foundation layer for LumX. Provides framework-agnostic component definitions, design tokens, SCSS, shared types and utilities consumed by `@lumx/react` and `@lumx/vue`.

## STRUCTURE

```
packages/lumx-core/src/
├── js/
│   ├── components/      # Framework-agnostic JSX component defs (PascalCase dirs)
│   ├── constants/       # Enums, keycodes, BEM class constants
│   ├── types/           # Shared TypeScript interfaces (30+ files)
│   └── utils/           # Shared utilities (classNames, focus, events, portal…)
├── scss/
│   ├── components/      # Per-component SCSS (54 components, each with _index.scss)
│   └── core/            # Base styles: color, typography, spacing, elevation, state, size
├── css/                 # Pre-compiled CSS (design-tokens.css, material.css)
└── stories/ / testing/  # Storybook and test utilities for downstream packages
style-dictionary/
├── properties/          # Token source JSON (core/ + components/)
└── config/              # Style Dictionary runners (SCSS, CSS, TS output)
```

## COMPONENT DEFINITION PATTERN

Core components are **plain JSX functions** (not React). They define the shape that React/Vue wrappers consume.

```typescript
// src/js/components/MyComponent/MyComponent.tsx
export const COMPONENT_NAME = 'MyComponent';
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-my-component';
export interface MyComponentProps { ... }
export const DEFAULT_PROPS: Partial<MyComponentProps> = { ... };

export const MyComponent = (props: MyComponentProps) => { ... };
MyComponent.displayName = COMPONENT_NAME;
MyComponent.className = CLASSNAME;
MyComponent.defaultProps = DEFAULT_PROPS;
```

Each component directory also has `Stories.tsx` (Storybook meta/args) and `Tests.ts` (shared test assertions) that React/Vue import and extend — avoids duplication.

## DESIGN TOKEN PIPELINE

```
style-dictionary/properties/*.json   →  yarn generate:design-tokens
  → src/scss/_design-tokens.scss     (SCSS variables)
  → src/css/design-tokens.css        (CSS custom properties --lumx-*)
  → src/js/constants/_internal/design-tokens.ts  (TS DESIGN_TOKENS object)
```

-   Token files: `properties/core/color.json`, `spacing.json`, `typography.json`, `size.json`, `border-radius.json`
-   Component tokens: `properties/components/button.json`, `chip.json`, etc.
-   **Never hand-edit generated files** (`_design-tokens.scss`, `design-tokens.css`, `design-tokens.ts`)

## SCSS CONVENTIONS

-   BEM: `lumx-<component>[__element][--modifier]`
-   Design token SCSS vars: `$lumx-button-height`, `$lumx-color-primary-N`, etc.
-   Main entry: `src/scss/lumx.scss` imports `_design-tokens.scss` → `_core.scss` → `_components.scss`
-   Each component has exactly one `_index.scss` in `src/scss/components/<name>/`

## TYPES

All shared interfaces live in `src/js/types/`. Key ones:

-   `GenericProps` — base props for all components (className, id, style, ref, data-\*)
-   `HasTheme` / `HasDisabled` / `HasClassName` — mixin interfaces
-   `HasPolymorphicAs` — for polymorphic `as` prop
-   `LumxClassName<T>` — branded type for component class names

## TESTING

-   `commonTestsSuiteTL` in `src/testing/` — base test assertions (class name, theme, props)
-   Imported by `@lumx/react`'s `commonTestsSuiteRTL` and `@lumx/vue`'s equivalent
-   Test runner: Vitest, `yarn test:core`

## NOTES

-   No React/Vue imports allowed in this package — keep it framework-agnostic
-   JSX in this package uses a custom transform (`JSXElement` type, not `React.ReactElement`)
-   SCSS compilation happens as part of the Rollup build; don't import SCSS from JS
