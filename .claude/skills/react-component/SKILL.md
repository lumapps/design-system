---
name: react-component
description: >
    Scaffolding rules and conventions for React components in the @lumx/react package. Use when creating
    a new component, adding a sub-component to an existing family, or needing guidance on component file
    structure, naming, testing, and export conventions in the design system.
---

# React Component Scaffolding & Conventions

Rules and patterns for creating and organizing React components in `@lumx/react`.

For full code templates, see [CHEATSHEET.md](CHEATSHEET.md).

## Directory Structure

Components live in `packages/lumx-react/src/components/<component-name>/` (kebab-case).

Minimal structure for a standalone component:

```
packages/lumx-react/src/components/<component-name>/
├── <ComponentName>.tsx
├── <ComponentName>.test.tsx
├── <ComponentName>.stories.tsx
└── index.ts
```

### Component Families

Related components should be grouped in a single directory rather than having separate folders. For example, `Button`, `IconButton`, `ButtonRoot`, and `ButtonGroup` all live under `button/`.

When components in a family share constants or types, extract them into dedicated files:

-   **`constants.ts`** -- shared `COMPONENT_NAME`, `CLASSNAME`, domain enums, or configuration values (e.g., `date-picker/constants.ts`, `popover/constants.ts`, `slideshow/constants.ts`)
-   **`types.ts`** -- shared prop interfaces consumed by multiple variants (e.g., `date-picker/types.ts`, `image-lightbox/types.ts`)

Example family structure (`date-picker/`):

```
packages/lumx-react/src/components/date-picker/
├── constants.ts              # Shared COMPONENT_NAME, CLASSNAME
├── types.ts                  # Shared DatePickerProps interface
├── DatePicker.tsx
├── DatePickerControlled.tsx
├── DatePickerField.tsx
├── index.ts
└── *.test.tsx, *.stories.tsx
```

The barrel `index.ts` can selectively export -- internal building blocks (like `ButtonRoot`) may only export their types. See CHEATSHEET.md for barrel export examples.

## Component Implementation

Create `<ComponentName>.tsx` following this structure:

-   **Props interface**: Export `<ComponentName>Props` extending `GenericProps`
-   **Constants**: `COMPONENT_NAME` (PascalCase), `CLASSNAME` typed as `LumxClassName<typeof COMPONENT_NAME>` (format: `'lumx-<component-name>'`), BEM helpers via `classNames.bem(CLASSNAME)`
-   **DEFAULT_PROPS**: `Partial<<ComponentName>Props>` with default values
-   **Component**: Use `forwardRef<<ComponentName>Props, HTMLDivElement>`. Destructure `className` and merge with BEM via `classNames.join(className, block(...))`. Spread `{...forwardedProps}` and forward `ref` to root element.
-   **Static properties**: Set `.displayName`, `.className`, `.defaultProps`
-   Use `useTheme()` hook if the component supports theming; `useDisableStateProps(props)` if it supports disabled state

See CHEATSHEET.md for the full component template.

## Exports

Export the component and props type in a `<component-name>/index.ts` and then in `lumx-react/src/index.ts`.
Beware of what is exported in `src/index.ts` as it is what is exposed to NPM.

## SCSS Styles

Create `packages/lumx-core/src/scss/components/<component-name>/_index.scss` using BEM classes matching `CLASSNAME`. Import it in the main SCSS entry point if needed. See CHEATSHEET.md for the SCSS template.

## Tests

Create `<ComponentName>.test.tsx` using `@testing-library/react`.

### `commonTestsSuiteRTL`

Use this helper to run standard checks all components should pass: base class name, className forwarding, attribute forwarding, ref forwarding, and theme support (via prop, via context, prop overrides context).

The `setup` function must return an object where each key maps to a named DOM element (e.g., `{ myComponent: HTMLElement }`). The string values in the options refer to keys in that returned object. Add component-specific tests for props, behavior, and edge cases.

See CHEATSHEET.md for the full test template.

## Stories

Create `<ComponentName>.stories.tsx` with at least a default story and key variants. See CHEATSHEET.md for the template.

## Site Demo Documentation (Optional)

Add a documentation page at `packages/site-demo/content/product/components/<component-name>/index.mdx` with React demo files in a `react/` subdirectory. Add the page to `content/menu.yml` for navigation.

See `packages/site-demo/README.md` for full conventions and CHEATSHEET.md for templates.

## CHANGELOG

When adding or modifying components, add an entry under "Unreleased" in `/CHANGELOG.md` (either in "Added", "Changed" or "Fixed" depending on the change).

```md
## [Unreleased]

### Added

-   `@lumx/react`:
    -   Create the `<ComponentName>` component
```

## Verification

1. **Run tests:** `yarn test packages/lumx-react/src/components/<component-name>`
2. **Build:** `yarn build:react`
3. **Storybook:** Verify stories render correctly

## Files Checklist

-   [ ] `packages/lumx-react/src/components/<component-name>/<ComponentName>.tsx`
-   [ ] `packages/lumx-react/src/components/<component-name>/<ComponentName>.test.tsx`
-   [ ] `packages/lumx-react/src/components/<component-name>/<ComponentName>.stories.tsx`
-   [ ] `packages/lumx-react/src/components/<component-name>/index.ts`
-   [ ] `packages/lumx-react/src/components/<component-name>/constants.ts` (if shared constants needed)
-   [ ] `packages/lumx-react/src/components/<component-name>/types.ts` (if shared types needed)
-   [ ] `packages/lumx-react/src/index.ts` (add export)
-   [ ] `packages/lumx-core/src/scss/components/<component-name>/_index.scss`
-   [ ] `packages/site-demo/content/product/components/<component-name>/index.mdx` (optional)
-   [ ] `packages/site-demo/content/product/components/<component-name>/react/demo*.tsx` (optional)
-   [ ] `CHANGELOG.md`
