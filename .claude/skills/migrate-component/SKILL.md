---
name: migrate-component
description: Migrate a React-only component to the shared core/React/Vue architecture
argument-hint: component-name
---

# Migrate Component to Core Architecture

Migrate a React-only component to the core/React/Vue architecture pattern.

## Usage

```
/migrate-component <ComponentName>
```

**Example:**

```
/migrate-component Switch
/migrate-component Table
```

## Description

This skill migrates a component (or component family) from React-only implementation to a shared core architecture where:

-   **Core package** (`@lumx/core`): Contains framework-agnostic UI logic, tests (plain data only, no JSX), and stories (JSX renders using injected framework components)
-   **React package** (`@lumx/react`): Thin wrapper that delegates to core
-   **Vue package** (`@lumx/vue`): Thin wrapper that delegates to core

**Component Families:**

-   A component name may refer to a **family of components** (e.g., "Table" includes Table, TableRow, TableCell, TableBody, TableHeader)
-   When migrating a component family, the skill will:
    1. **Discover all components** in the family by scanning the React folder
    2. **Analyze dependencies** between components and external dependencies
    3. **Determine migration order** based on dependencies
    4. **Migrate each component** in the correct order through all phases

**Component Organization:**

-   **Sub-components go in the same folder as their parent component**
-   Example: `Badge` and `BadgeWrapper` both live in the `badge/` folder
    -   Core: `/packages/lumx-core/src/js/components/Badge/` contains both `Badge` and `BadgeWrapper`
    -   React: `/packages/lumx-react/src/components/badge/` contains both `Badge.tsx` and `BadgeWrapper.tsx`
    -   Vue: `/packages/lumx-vue/src/components/badge/` contains both `Badge.tsx` and `BadgeWrapper.tsx`
-   Example: `Table` family in the `table/` folder
    -   Core: `/packages/lumx-core/src/js/components/Table/` contains `index.tsx` (Table), `TableRow.tsx`, `TableCell.tsx`, etc.
    -   React: `/packages/lumx-react/src/components/table/` contains `Table.tsx`, `TableRow.tsx`, `TableCell.tsx`, etc.
    -   Vue: `/packages/lumx-vue/src/components/table/` contains `Table.tsx`, `TableRow.tsx`, `TableCell.tsx`, etc.
-   The folder name uses lowercase-with-dashes (e.g., `badge/`, `table/`), while the component names use PascalCase (e.g., `Badge`, `BadgeWrapper`, `Table`, `TableRow`)

## Prerequisites

Before running this skill, ensure:

1. The component exists in `@lumx/react` and is fully functional
2. The component has existing tests and stories
3. A reference component (like Checkbox) has already been migrated and can serve as a pattern

## Phase 0: Discovery & Dependency Analysis

**Goal:** Discover all components in the family and determine the correct migration order.

**IMPORTANT:** This phase MUST be completed before starting any migration work.

1. **Check for existing core implementation:**

    - **BEFORE starting migration**, check if the component already exists in `@lumx/core`
    - Read `/packages/lumx-core/src/js/components/<ComponentName>/` to see if any files exist
    - Check for existing artifacts:
        - **UI files**: `index.tsx`, `<SubComponent>.tsx`, `constants.ts`
        - **Stories**: `Stories.tsx` (or `Stories.ts`)
        - **Tests**: `Tests.ts`
    - Document what already exists:
        - If core UI implementation exists → Plan to reuse and skip Phase 1 (UI extraction)
        - If core Stories exist → Plan to reuse and skip Phase 2 Step 1 (Core stories creation)
        - If core Tests exist → Plan to reuse and skip Phase 3 Step 2 (Core tests creation)
    - **If ANY existing core code is found:**
        - Review the existing code to understand its structure
        - **USE AskUserQuestion tool** to inform the developer about what exists
        - Ask if any changes to the existing core implementation are needed
        - If changes are needed, document them and get approval before proceeding
    - If no core implementation exists, proceed with full migration

2. **Discover component family:**

    - Read `/packages/lumx-react/src/components/<component-name>/index.ts` to find all exported components
    - List all `.tsx` files in the component folder
    - Identify which component is the parent and which are sub-components

3. **Analyze dependencies:**

    - For each component, check if it imports:
        - Constants from a shared `constants.ts` file (dependency on parent)
        - Other components from the same folder (dependency on siblings)
        - Components from `@lumx/react` or `@lumx/core` (external dependencies)
    - Verify external component dependencies are available in `@lumx/core`
    - Document any blocking dependencies (components not yet migrated to core)

4. **Determine migration order:**

    - **If there's a `constants.ts` file**, migrate the parent component first (it will create the constants in core)
    - **If sub-components import the parent component**, migrate the parent first
    - **Otherwise**, components can be migrated in any order
    - Create a numbered list of components in migration order

5. **Present migration plan to developer:**
    - Show whether core implementation already exists
    - Show discovered components
    - Show dependency analysis
    - Show proposed migration order
    - List any blocking dependencies
    - If core exists, list any proposed changes to core implementation
    - Ask for confirmation before proceeding

**Example for Table family:**

```
Discovered components:
1. Table (parent - defines constants.ts)
2. TableBody (imports TABLE_CLASSNAME from constants)
3. TableCell (imports TABLE_CLASSNAME from constants, uses Icon)
4. TableHeader (imports TABLE_CLASSNAME from constants)
5. TableRow (imports TABLE_CLASSNAME from constants)

Dependencies:
- All sub-components depend on constants.ts (created by Table)
- TableCell uses Icon (already available in core ✓)

Migration order:
1. Table (parent, creates constants)
2. TableBody
3. TableCell
4. TableHeader
5. TableRow
```

**Validation Checkpoint 0:**

-   Developer is informed about any existing core implementation (UI, Stories, Tests)
-   Developer reviews and approves the migration plan
-   Developer confirms all external dependencies are available or acceptable to skip
-   If changes to existing core code are proposed, developer approves those changes

## 🛑 IMPORTANT: Validation Checkpoints

**This skill has MANDATORY validation checkpoints where you MUST stop and wait for user approval:**

-   **Checkpoint 1**: After Phase 1 (UI Implementation) - Verify React/Vue components work
-   **Checkpoint 2a**: After stories migration - Verify React stories in Storybook
-   **Checkpoint 2b**: After Vue stories - Verify Vue stories in Storybook
-   **Checkpoint 3**: After tests migration - Verify all tests pass

**At each checkpoint:**

1. **STOP immediately** - Do not continue to the next phase
2. **USE the AskUserQuestion tool** to present results and ask for approval
3. **WAIT for user response** - Only proceed when user explicitly approves
4. **DO NOT skip or rush through checkpoints** - Each validation is critical

## Migration Steps

**IMPORTANT:** After Phase 0 approval, migrate each component in the determined order by going through Phases 1-6 for each component before moving to the next.

### Phase 1: UI Extraction & Implementation

**Goal:** Extract the core UI logic and create thin wrappers for React and Vue.

**IMPORTANT - Check for Existing Core Implementation:**

-   If Phase 0 discovered that core UI implementation already exists, **skip steps 1-2** and proceed directly to step 3 (Update React wrapper)
-   If any modifications to the existing core implementation are needed:
    -   **ALWAYS use AskUserQuestion tool BEFORE making any changes to core code**
    -   Present the proposed changes clearly with rationale
    -   Wait for user approval before modifying any core files
-   If no core implementation exists, proceed with steps 1-2 to create it

1. **Create core component files:**

    - **If migrating the parent component first** (has constants.ts in React):
        ```
        packages/lumx-core/src/js/components/<ComponentName>/
        ├── constants.ts (migrate from React)
        └── index.tsx (parent component)
        ```
    - For standalone components:
        ```
        packages/lumx-core/src/js/components/<ComponentName>/
        └── index.tsx
        ```
    - For sub-components being migrated after parent (e.g., `TableRow` after `Table`):
        ```
        packages/lumx-core/src/js/components/<ParentComponentName>/
        ├── index.tsx (parent component)
        └── <SubComponentName>.tsx (e.g., BadgeWrapper.tsx)
        ```
    - Sub-components use separate files (e.g., `BadgeWrapper.tsx`), not `index.tsx`

2. **Extract UI logic:**

    - **For parent components with constants.ts:**
        - First migrate `constants.ts` to core (keep exact same structure)
        - Update React imports to use `@lumx/core/js/components/<Component>/constants`
    - **For sub-components:**
        - Update imports: `import { CLASSNAME as PARENT_CLASSNAME } from './constants'` → `import { CLASSNAME as PARENT_CLASSNAME } from '@lumx/core/js/components/<Parent>/constants'`
    - **For all components:**
        - Change `children` prop to `label: JSXElement` (framework-agnostic)
        - Add required `inputId: string` prop if needed (generated by wrappers)
        - Use functional JSX calls: `InputLabel({ ... })` instead of `<InputLabel ... />`
        - Remove React-specific code (Children.count, etc.)
        - **Check for new callback props** (e.g., `onCustomEvent`, `onSpecialAction`) defined in core UI
        - **If new callbacks are introduced**, update `PropsToOverride` in `/packages/lumx-core/src/js/types/jsx/PropsToOverride.ts` to include them
        - Export: `Component`, `ComponentProps`, `COMPONENT_NAME`, `CLASSNAME`, `DEFAULT_PROPS` (or import from constants if applicable)

3. **Update React wrapper:**

    - Import UI component from core
    - Import `ReactToJSX` type utility from `@lumx/react/utils/type/ReactToJSX`
    - Define props interface using `ReactToJSX<UIProps, 'additionalPropsToOmit'>` instead of manual `Omit`
    - Transform into thin wrapper using `forwardRef`
    - Use hooks: `useId`, `useTheme`, `useDisableStateProps`, `useMergeRefs`
    - Map `children` → `label` for core component
    - Call `UI({ ... })` instead of rendering JSX
    - Maintain backward compatibility

4. **Create Vue wrapper:**

    - For standalone components, create directory structure:
        ```
        packages/lumx-vue/src/components/<component-name>/
        ├── <Component>.tsx
        └── index.ts
        ```
    - For sub-components (e.g., `BadgeWrapper` alongside `Badge`), add to existing parent folder:
        ```
        packages/lumx-vue/src/components/<parent-component-name>/
        ├── <ParentComponent>.tsx
        ├── <SubComponent>.tsx (e.g., BadgeWrapper.tsx)
        └── index.ts (update to export both components)
        ```
    - Use `defineComponent` with render function
    - Use composables: `useTheme`, `useId`, `useDisableStateProps`
    - Support both `label` prop and default slot
    - Emit events instead of onChange callbacks
    - **Use JSX rendering**: `return (<ComponentUI ... />)`
    - **Add stop propagation**: `event.stopImmediatePropagation()`
    - Define props using `keysOf<ComponentProps>()`
    - Set `name: 'Lumx<Component>'`
    - Set `inheritAttrs: false`
    - **Create `index.ts` with exports for components and types only:**
        - Read the React component's `index.ts` file for reference
        - Export components and types (props, enums, utilities)
        - **Do NOT export `CLASSNAME`, `COMPONENT_NAME`, or `DEFAULT_PROPS`** — these are internal constants
        - Vue uses default export for the component: `export { default as Component }`
        - React uses named export: `export { Component }`

5. **Update Vue package index:**
    ```typescript
    export * from './components/<component-name>';
    ```

**🛑 MANDATORY Validation Checkpoint 1 - STOP HERE:**

-   Run `yarn test` to ensure no regressions
-   Run `yarn type-check` to verify TypeScript compilation
-   **STOP AND USE AskUserQuestion tool** to ask developer for validation:
    -   Present test and type-check results
    -   Ask: "Phase 1 complete. Please verify React components work correctly and Vue components render basic UI. Should I proceed to Phase 2 (Stories Migration)?"
    -   Options: "Yes, proceed" / "No, fix issues first"
-   **DO NOT PROCEED** to Phase 2 until developer selects "Yes, proceed"
-   If developer selects "No", fix issues and ask again

### Phase 2: Stories Migration

**Goal:** Create shared core stories with JSX renders and thin framework-specific wrappers.

**KEY ARCHITECTURE:**

-   **Core stories use JSX** (`.tsx` file) with framework components injected via a `components` parameter
-   **Both React and Vue story files** are thin wrappers that pass `components` and `decorators` to core, then re-export stories
-   **No `.vue` template files** for stories — all rendering is done via JSX in core
-   **No `withRender` utility** — replaced by JSX render functions defined in core
-   **Keep the same stories** — Don't add or remove stories; migrate existing ones only

**HOW IT WORKS:**

-   Core `.tsx` files use `"jsx": "preserve"` — the JSX is NOT compiled by core
-   When React's build imports the core `.tsx` file, React's toolchain compiles JSX to `React.createElement`
-   When Vue's build imports it, Vue's toolchain compiles JSX to `h()` calls
-   This means the **same JSX code works for both frameworks**, as long as it uses injected components (not hardcoded imports from `@lumx/react` or `@lumx/vue`)

#### Step 1: Analyze and Create Core Stories

**IMPORTANT - Check for Existing Core Stories:**

-   If Phase 0 discovered that `Stories.ts` or `Stories.tsx` already exists in core, review it and plan changes
-   If any modifications to existing core stories are needed:
    -   **ALWAYS use AskUserQuestion tool BEFORE making any changes**
    -   Present proposed changes with clear rationale
    -   Wait for user approval before modifying core Stories

1.  **Read and analyze existing React stories:**

    -   Identify all components used in the stories (Icon, Text, FlexBox, etc.)
    -   These components will be passed via the `components` parameter
    -   Identify framework-only stories (e.g., React-only stories using `GenericBlock`) — these stay in the framework file

2.  **Create core stories (`packages/lumx-core/src/js/components/<ComponentName>/Stories.tsx`):**

    -   **File extension is `.tsx`** — JSX is used for render functions
    -   Export `setup()` function that takes `{ component, components, render, decorators }` and returns story configurations
    -   **The `components` parameter** receives framework-specific component implementations (e.g., `{ Badge, Icon }`)
    -   **Use `overrides`** only when a story needs completely different structure per framework (rare)

    **KEY RULES for core stories:**

    -   **NEVER put JSX in `args`** — all JSX must live in `render` functions. This includes `args.children`, `args.before`, `args.after`, `args.badge`, and any other prop. JSX in `args` causes errors in Vue storybook tests (vitest). Only serializable data (strings, numbers, booleans, enums, objects) should be in `args`.
    -   **NEVER put JSX in `withCombinations` rows/sections/cols** — combination values are merged into `args` at runtime, so they have the same restriction. Use `render` functions to produce JSX for different variants instead.
    -   **Define each story and `meta` as individual `const` variables** — this enables stories to reference each other (e.g., `WithIcon.render` reused by `AllTypography`). Return them as a flat object: `return { meta, StoryA, StoryB, ... }`.
    -   **Stories that need JSX content get their own `render` function** — the render function receives args (serializable data) and returns JSX using the injected framework components.
    -   **Stories can reuse other stories' `render`** — e.g., `AllTypography` can set `render: WithIcon.render` to reuse the same rendering.
    -   **Composite stories can call other renders** — e.g., `AllColors` can compose `{WithText.render(args)}`, `{WithIcon.render(args)}` together.
    -   **ALWAYS destructure `children` out of args in render functions** — when a render function provides its own inline JSX children, it must destructure `children` from the args to prevent the inherited `children` value (from `meta.args`) from leaking via `{...args}` onto the component. In Vue, spreading `children` as a prop on a DOM element causes a `"Failed setting prop children"` warning because `children` is a read-only DOM property. Use `({ children, ...args }: any) =>` instead of `(args: any) =>`.

    Pattern:

        ```tsx
        import type { SetupStoriesOptions } from '@lumx/core/stories/types';
        import { colorArgType } from '@lumx/core/stories/controls/color';
        import { withUndefined } from '@lumx/core/stories/controls/withUndefined';
        import { mdiHeart } from '@lumx/icons';
        import { ColorPalette } from '../../constants';
        import { DEFAULT_PROPS } from '.';

        export function setup({
            component: Badge,
            components: { Icon, Thumbnail, FlexBox },
            decorators: { withCombinations },
        }: SetupStoriesOptions<{
            decorators: 'withCombinations';
            components: { Icon: any; Thumbnail: any; FlexBox: any };
        }>) {
            // Define meta and each story as individual consts
            const meta = {
                component: Badge,
                render: (args: any) => <Badge {...args} />,
                argTypes: {
                    color: colorArgType,
                },
                args: DEFAULT_PROPS,
            };

            /** Using badge with text children */
            const WithText = {
                // JSX in render, NOT in args
                render: (args: any) => (
                    <Badge {...args}>
                        <span>30</span>
                    </Badge>
                ),
            };

            /** With icon child — uses Icon from injected components */
            const WithIcon = {
                render: (args: any) => (
                    <Badge {...args}>
                        <Icon icon={mdiHeart} />
                    </Badge>
                ),
            };

            /** All color combinations — composes other stories' renders */
            const AllColors = {
                render: (args: any) => (
                    <FlexBox orientation="vertical" gap="regular">
                        {WithText.render(args)}
                        {WithIcon.render(args)}
                    </FlexBox>
                ),
                argTypes: { color: { control: false } },
                decorators: [
                    withCombinations({
                        combinations: {
                            // Only serializable data in combinations — NO JSX
                            cols: { key: 'color', options: withUndefined(ColorPalette) },
                        },
                    }),
                ],
            };

            // Return flat object with all consts
            return { meta, WithText, WithIcon, AllColors };
        }
        ```

    **More examples of the pattern:**

    When a story just needs different args (no JSX), it doesn't need a custom render:

        ```tsx
        /** Story with only serializable args — inherits meta render */
        const Disabled = {
            args: { isDisabled: true },
        };
        ```

    When multiple stories share the same render:

        ```tsx
        /** Text with inline icons — destructure children to prevent leaking from meta.args */
        const WithIcon = {
            render: ({ children, ...args }: any) => (
                <Text {...args}>
                    Some text <Icon icon={mdiHeart} /> with icons <Icon icon={mdiEarth} />
                </Text>
            ),
        };

        /** All typographies — reuses WithIcon's render */
        const AllTypography = {
            render: WithIcon.render,
            argTypes: { typography: { control: false } },
            decorators: [
                withCombinations({
                    combinations: {
                        rows: { key: 'typography', options: withUndefined(ALL_TYPOGRAPHY) },
                    },
                }),
            ],
        };
        ```

    When a component has slot-like props (before, after, badge), put the JSX in render, not args:

        ```tsx
        const DefaultRender = render || ((args: any) => <Toolbar {...args} />);

        /** Toolbar with all content areas */
        const WithAll = {
            render: () => (
                <DefaultRender
                    before={<Icon icon={mdiMenu} />}
                    after={<Icon icon={mdiMagnify} />}
                    label="Page title"
                />
            ),
        };
        ```

#### Step 2: Implement React Stories

3. **Update React stories to use core setup:**

    - Import `setup` from core stories
    - Pass framework components via `components` and decorators via `decorators`
    - Export each story as a thin re-export: `export const StoryName = { ...stories.StoryName };`
    - Add framework-only stories (using components not available in core) as separate exports
    - Pattern:

        ```tsx
        import { Badge, Icon } from '@lumx/react';
        import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
        import { setup } from '@lumx/core/js/components/Badge/Stories';

        const { meta, ...stories } = setup({
            component: Badge,
            components: { Icon },
            decorators: { withCombinations },
        });

        export default {
            title: 'LumX components/badge/Badge',
            ...meta,
        };

        export const WithText = { ...stories.WithText };
        export const WithIcon = { ...stories.WithIcon };
        export const AllColors = { ...stories.AllColors };

        // Framework-only story (uses components not in core setup)
        export const WithThumbnail = {
            args: {
                children: <Thumbnail ... />,
            },
        };
        ```

**🛑 MANDATORY Validation Checkpoint 2a - STOP HERE:**

-   Run `yarn type-check` to verify TypeScript compilation
-   **STOP AND USE AskUserQuestion tool** to ask developer for validation:
    -   Present type-check status
    -   Ask: "React stories migrated. Please verify ALL React stories render correctly in Storybook. Should I proceed to create Vue stories?"
    -   Options: "Yes, proceed to Vue stories" / "No, fix issues first"
-   **DO NOT PROCEED** to Vue stories until developer selects "Yes, proceed to Vue stories"
-   If developer selects "No", fix issues and ask again

#### Step 3: Implement Vue Stories

4.  **Create Vue stories as thin wrapper (`.tsx` file):**

    -   Import `setup` from core stories
    -   Pass Vue framework components via `components` and Vue decorators via `decorators`
    -   Export each story as a thin re-export — **identical structure to React**
    -   **No `.vue` template files needed** — all rendering handled by JSX in core
    -   **IMPORTANT: Provide a `render` override when the Vue component uses slots instead of props.** Since core stories now put JSX in render functions (not args), the render override maps slot-like props to Vue slots when the core `render` passes them as JSX props/children.

    **Pattern A — Default slot only** (e.g., `children` or `label` prop → default slot):

        ```tsx
        import { Flag } from '@lumx/vue';
        import { setup } from '@lumx/core/js/components/Flag/Stories';

        const { meta, ...stories } = setup({
            component: Flag,
            // Destructure `label` out of args and pass it as default slot (JSX children)
            render: ({ label, ...args }: any) => <Flag {...args}>{label}</Flag>,
            decorators: { /* ... */ },
        });
        ```

    **Pattern B — Named slots** (e.g., `before`, `after`, `label` → named slots):

        ```tsx
        import { Toolbar, Icon } from '@lumx/vue';
        import { setup } from '@lumx/core/js/components/Toolbar/Stories';

        const { meta, ...stories } = setup({
            component: Toolbar,
            components: { Icon },
            // Map props to Vue named slots using Vue JSX slot object syntax
            render: ({ label, before, after, ...args }: any) => (
                <Toolbar {...args}>
                    {{
                        default: label ? () => label : undefined,
                        before: before ? () => before : undefined,
                        after: after ? () => after : undefined,
                    }}
                </Toolbar>
            ),
        });
        ```

    **Pattern C — No slot mapping needed** (core render handles everything):

    When the core stories already handle all JSX in their own `render` functions (the new default pattern), and the Vue component doesn't need slot mapping because the core render directly renders the component with children via JSX, no `render` override is needed:

        ```tsx
        import { Badge, FlexBox, Icon, Thumbnail } from '@lumx/vue';
        import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
        import { setup } from '@lumx/core/js/components/Badge/Stories';

        const { meta, ...stories } = setup({
            component: Badge,
            components: { Icon, Thumbnail, FlexBox },
            decorators: { withCombinations },
            // No render override needed — core stories already define render per story
        });
        ```

    **How to decide which pattern to use:**

    1. Check the core `Stories.tsx` — if stories define their own `render` functions that directly render the component with JSX children (the new pattern), Vue usually doesn't need a render override (Pattern C)
    2. If the core stories use a shared `meta.render` that receives slot-like content via args (e.g., `label`, `before`, `after`), the Vue side needs to map those to slots (Pattern A or B)
    3. Read the Vue component's `.tsx` file and check if it accesses `slots` (e.g., `slots.default?.()`, `slots.before?.()`)
    4. If it uses `slots.default?.()` only → use **Pattern A**
    5. If it uses named slots (e.g., `slots.before?.()`, `slots.after?.()`) → use **Pattern B**
    6. If core stories already handle rendering inline (each story has its own render) → use **Pattern C**

    Full example with re-exports:

        ```tsx
        import { Badge, FlexBox, Icon, Thumbnail } from '@lumx/vue';
        import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
        import { setup } from '@lumx/core/js/components/Badge/Stories';

        const { meta, ...stories } = setup({
            component: Badge,
            components: { Icon, Thumbnail, FlexBox },
            decorators: { withCombinations },
        });

        export default {
            title: 'LumX components/badge/Badge',
            ...meta,
        };

        export const WithText = { ...stories.WithText };
        export const WithIcon = { ...stories.WithIcon };
        export const AllColors = { ...stories.AllColors };
        ```

**🛑 MANDATORY Validation Checkpoint 2b - STOP HERE:**

-   Run `yarn test` to ensure no regressions
-   Run `yarn type-check` to verify TypeScript compilation
-   **STOP AND USE AskUserQuestion tool** to ask developer for validation:
    -   Present test and type-check results
    -   Ask: "All Vue stories complete. Please verify ALL Vue stories render correctly in Storybook. Should I proceed to Phase 3 (Tests Migration)?"
    -   Options: "Yes, proceed to Phase 3" / "No, fix issues first"
-   **DO NOT PROCEED** to Phase 3 until developer selects "Yes, proceed to Phase 3"
-   If developer selects "No", fix issues and ask again

### Phase 3: Tests Migration

**Goal:** Extract core tests and update framework-specific test suites.

**IMPORTANT RULES:**

-   **NO JSX ELEMENTS or component calls in core tests** - Use plain data only
-   **NO interaction/event tests in core** - Core tests should only test rendering, props, and DOM structure
-   **Event handler tests belong in React/Vue** - Test `onClick` interactions in React tests, test `emit('click')` in Vue tests
-   **Tests that need component children must use framework-specific setup** - Don't migrate those to core
-   **Vue tests should mimic React tests** - Include the same structure: core tests import, framework-specific describe block, and `commonTestsSuiteVTL` (Vue) or `commonTestsSuiteRTL` (React)
-   **DO NOT add NOTE comments or explanatory comments in generated files** - Keep code clean without meta-commentary

**IMPORTANT - Check for Existing Core Tests:**

-   If Phase 0 discovered that `Tests.ts` already exists in core, **skip step 2** and proceed to step 3 (React tests update)
-   If any modifications to existing core tests are needed:
    -   **ALWAYS use AskUserQuestion tool BEFORE making any changes**
    -   Present proposed changes with clear rationale
    -   Wait for user approval before modifying core Tests.ts

1. **Read and analyze existing React tests:**

    - Identify tests that use plain data (strings, numbers, etc.) - these can migrate to core
    - Identify tests that use JSX components (Icon, Thumbnail, etc.) - these stay in React/Vue only
    - Document which tests cannot be migrated due to component dependencies

2. **Create core tests (`packages/lumx-core/src/js/components/<ComponentName>/Tests.ts`):**

    - **NO JSX ELEMENTS or component calls allowed** - Use plain data only
    - Export `setup()` function that takes props and `SetupOptions`
    - Export default test suite function that receives `SetupOptions` and contains describe/it blocks
    - Only migrate tests that use plain data (strings, numbers, booleans)
    - Follow the Button pattern exactly
    - Example pattern:

        ```typescript
        import { getByClassName } from '../../../testing/queries';
        import { SetupOptions } from '../../../testing';
        import { ColorPalette } from '../../constants';

        const CLASSNAME = 'lumx-badge';

        /**
         * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
         */
        export const setup = (propsOverride: any = {}, { render, ...options }: SetupOptions<any>) => {
            const props = { ...propsOverride };
            const wrapper = render(props, options);

            const badge = getByClassName(document.body, CLASSNAME);
            return { props, badge, wrapper };
        };

        export default (renderOptions: SetupOptions<any>) => {
            const { screen } = renderOptions;

            describe('Badge core tests', () => {
                describe('Props', () => {
                    it('should use default props', () => {
                        const { badge } = setup({ children: '30' }, renderOptions);

                        expect(badge.className).toContain('lumx-badge');
                        expect(badge.className).toContain('lumx-badge--color-primary');
                        expect(badge).toHaveTextContent(/30/);
                    });

                    it('should render color', () => {
                        const { badge } = setup({ children: 'Badge', color: ColorPalette.red }, renderOptions);
                        expect(badge).toHaveClass('lumx-badge--color-red');
                    });
                });
            });
        };
        ```

3. **Update React tests:**

    - Import default export from core tests (the test suite)
    - Call the test suite with `{ render, screen }` options
    - Keep React-specific tests (ref forwarding, theme context, JSX children)
    - Keep `commonTestsSuiteRTL` (React-specific)
    - Example pattern:

        ```typescript
        import { commonTestsSuiteRTL } from '@lumx/react/testing/utils';
        import { getByClassName } from '@lumx/react/testing/utils/queries';
        import { render, screen } from '@testing-library/react';
        import { Badge, BadgeProps } from './Badge';
        import BaseBadgeTests from '@lumx/core/js/components/Badge/Tests';

        const CLASSNAME = Badge.className as string;

        const setup = (propsOverride: Partial<BadgeProps> = {}) => {
            const props: BadgeProps = {
                children: <span>30</span>,
                ...propsOverride,
            };
            render(<Badge {...props} />);
            const badge = getByClassName(document.body, CLASSNAME);
            return { badge, props };
        };

        describe(`<${Badge.displayName}>`, () => {
            // Run core tests
            BaseBadgeTests({
                render: (props: BadgeProps) => render(<Badge {...props} />),
                screen,
            });

            // React-specific tests
            describe('React', () => {
                it('should render empty children', () => {
                    const { badge } = setup({ children: null });
                    expect(badge).toBeInTheDocument();
                    expect(badge).toBeEmptyDOMElement();
                });
            });

            // Common tests suite
            commonTestsSuiteRTL(setup, {
                baseClassName: CLASSNAME,
                forwardClassName: 'badge',
                forwardAttributes: 'badge',
                forwardRef: 'badge',
            });
        });
        ```

4. **Create Vue tests (`packages/lumx-vue/src/components/<component-name>/<Component>.test.ts`):**

    - **IMPORTANT: Vue tests should mimic React tests exactly** - Same structure with core tests, framework describe, and commonTestsSuite
    - Import default export from core tests (the test suite)
    - Import and use the core `setup` function
    - Call the test suite with render function that converts `children` to slots
    - Create a local setup function that wraps the core setup
    - Add `commonTestsSuiteVTL` (Vue equivalent of React's `commonTestsSuiteRTL`)
    - Add Vue-specific tests (emit events, disabled states) if needed
    - Use `@testing-library/vue`
    - Example pattern:

        ```typescript
        import { render, screen } from '@testing-library/vue';
        import BaseBadgeTests, { setup } from '@lumx/core/js/components/Badge/Tests';
        import { CLASSNAME } from '@lumx/core/js/components/Badge';
        import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

        import { Badge } from '.';

        describe('<Badge />', () => {
            const renderBadge = ({ children, ...props }: any, options?: SetupRenderOptions<any>) =>
                render(Badge, {
                    ...options,
                    props,
                    slots: children ? { default: children } : undefined,
                });

            // Run core tests
            BaseBadgeTests({
                render: renderBadge,
                screen,
            });

            const setupBadge = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
                setup(props, { ...options, render: renderBadge, screen });

            // Common tests suite
            commonTestsSuiteVTL(setupBadge, {
                baseClassName: CLASSNAME,
                forwardClassName: 'div',
                forwardAttributes: 'div',
                forwardRef: 'div',
            });
        });
        ```

**🛑 MANDATORY Validation Checkpoint 3 (Tests) - STOP HERE:**

-   Run `yarn test` to ensure all tests pass
-   Run `yarn type-check` to verify TypeScript compilation
-   Verify core tests use only plain data (no JSX)
-   Verify framework-specific tests remain in React/Vue
-   **STOP AND USE AskUserQuestion tool** to ask developer for validation:
    -   Present test results (number of tests passing)
    -   Ask: "Phase 3 complete. All tests migrated and passing. Should I proceed to Phase 4 (Update CHANGELOG and verify builds)?"
    -   Options: "Yes, proceed to finalization" / "No, fix issues first"
-   **DO NOT PROCEED** to Phase 4 until developer selects "Yes, proceed to finalization"
-   If developer selects "No", fix issues and ask again

**Important Notes:**

-   Tests with framework-specific rendering behavior (e.g., empty children) should stay in framework test files
-   Vue uses slots for children, so the render helper must convert `children` prop to `slots.default`
-   React renders empty for `null` children, Vue renders comment nodes `<!---->`
-   Vue tests should include `commonTestsSuiteVTL` to match React's `commonTestsSuiteRTL` structure
-   Core `setup()` function should return aliases if needed (e.g., `const div = badge;`) for `commonTestsSuite` compatibility

### Phase 4: Update Package Exports

**Verify React package already exports component**

### Phase 5: Update CHANGELOG

**IMPORTANT:** Complete this phase ONCE for the entire component family after all components are migrated.

Add entry under `[Unreleased]`:

**For single component:**

```markdown
### Added

-   `@lumx/vue`:
    -   Create the `<Component>` component

### Changed

-   `@lumx/core`:
    -   Moved `<Component>` from `@lumx/react`
```

**For component family:**

```markdown
### Added

-   `@lumx/vue`:
    -   Create the `<Component>` component family (`<Component>`, `<SubComponent1>`, `<SubComponent2>`, etc.)

### Changed

-   `@lumx/core`:
    -   Moved `<Component>` component family from `@lumx/react` (`<Component>`, `<SubComponent1>`, `<SubComponent2>`, etc.)
```

**Example for Table:**

```markdown
### Added

-   `@lumx/vue`:
    -   Create the `Table` component family (`Table`, `TableBody`, `TableCell`, `TableHeader`, `TableRow`)

### Changed

-   `@lumx/core`:
    -   Moved `Table` component family from `@lumx/react` (`Table`, `TableBody`, `TableCell`, `TableHeader`, `TableRow`)
```

### Phase 6: Final Build Verification

**IMPORTANT:** After completing Phases 1-5 for ALL components in the family, perform final verification.

1. **Build packages:**

    ```bash
    yarn build:core
    yarn build:react
    yarn build:vue
    ```

2. **Final smoke test:**

    - Run full test suite: `yarn test`
    - Verify all builds succeed
    - Check Storybook for any console errors
    - Verify all components in the family work together correctly

3. **Validate React/Vue parity:**

    - **CRITICAL: Check that all tests and stories are properly matched between React and Vue**
    - For each component in the family:

        **Stories validation:**

        - Verify every `.stories.tsx` file in React has a corresponding `.stories.tsx` file in Vue
        - Read both story files and compare exported story names
        - Ensure all React stories have Vue equivalents (e.g., Default, WithHeader, AllStates)
        - Both should be thin wrappers calling the same core `setup()` with identical structure
        - Example check:
            ```bash
            # React stories
            ls packages/lumx-react/src/components/<component-name>/*.stories.tsx
            # Vue stories
            ls packages/lumx-vue/src/components/<component-name>/*.stories.tsx
            ```

        **Tests validation:**

        - Verify every `.test.tsx` file in React has a corresponding `.test.ts` file in Vue
        - Read test files and compare test structure:
            - Core tests are imported and run in both React and Vue
            - Framework-specific `describe` blocks exist in both (React/Vue)
            - `commonTestsSuiteRTL` (React) has equivalent `commonTestsSuiteVTL` (Vue)
            - React-specific tests have Vue-specific equivalents where appropriate
        - Check `commonTestsSuite` configurations match:
            - Verify `baseClassName`, `forwardClassName`, `forwardAttributes`, `forwardRef` are present
            - Check if React has `applyTheme` config - Vue should have it too
        - Example validation:

            ```typescript
            // React test structure:
            describe(`<${Component.displayName}>`, () => {
                BaseComponentTests({ render, screen });
                describe('React', () => {
                    /* React-specific tests */
                });
                commonTestsSuiteRTL(setup, {
                    /* config */
                });
            });

            // Vue test structure should match:
            describe('<Component />', () => {
                BaseComponentTests({ render, screen });
                describe('Vue', () => {
                    /* Vue-specific tests */
                });
                commonTestsSuiteVTL(setup, {
                    /* same config */
                });
            });
            ```

    - **Fix any discrepancies found:**

        - Missing Vue stories → Create thin wrapper `.stories.tsx` calling core `setup()` with Vue components
        - Missing Vue tests → Add them following the React test structure
        - Missing `applyTheme` config → Add to Vue test
        - Missing Vue-specific tests → Add equivalent tests for Vue behavior

    - **Run tests again after fixes:**
        ```bash
        yarn test
        ```

### Phase 7: Add Vue Documentation

**IMPORTANT:** After all components are migrated and verified, add Vue documentation to the site-demo.

**Goal:** Create Vue demo files and update the documentation MDX page to include both React and Vue frameworks.

1. **Check for existing documentation:**

    - Verify that a documentation page exists at `packages/site-demo/content/product/components/<component>/index.mdx`
    - If no documentation exists, the vue-docs skill will report this and you should note it for later

2. **Run the vue-docs skill:**

    - Use the Skill tool to invoke the vue-docs skill for the component
    - The skill will automatically:
        - Read existing React demos
        - Create matching Vue demos (.vue files)
        - Update the MDX page with Vue imports and demo blocks
        - Add Vue PropTable integration
    - Example:
        ```
        Skill tool: vue-docs, args: "<ComponentName>"
        ```

3. **Manual verification:**
    - After the vue-docs skill completes, verify:
        - All Vue demo files were created
        - MDX page includes `frameworks: ['react', 'vue']`
        - All DemoBlocks reference both frameworks
        - PropTable includes both React and Vue docs

**Note:** This phase must be completed for every component migration. If documentation doesn't exist, create a task or issue to add it later.

## Key Patterns to Follow

### Props Type Inheritance Pattern

**IMPORTANT:** Use the new type utilities for cleaner and more maintainable props definitions.

**Core Type Definition:**

-   Core defines `PropsToOverride = 'ref' | 'onClick' | 'onChange' | 'onKeyPress'`
-   These are generic JSX props that need framework-specific implementations

**React Props Pattern:**

```typescript
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

// Automatically omits PropsToOverride ('ref' | 'onClick' | 'onChange' | 'onKeyPress')
export interface ComponentProps extends GenericProps, ReactToJSX<UIProps, 'inputId' | 'label'> {
    children?: React.ReactNode;
    onChange?(param: Type): void; // Define React-specific onChange signature
}
```

**Vue Props Pattern:**

```typescript
import { VueToJSXProps } from '../../utils/VueToJSX';

// Automatically omits PropsToOverride + 'children' + 'className'
export type ComponentProps = VueToJSXProps<UIProps, 'inputId' | 'label'>;
```

**Benefits:**

-   ✅ No need to manually list `ref`, `onClick`, `onChange`, `onKeyPress` in every Omit
-   ✅ Consistent pattern across all components
-   ✅ Easier maintenance - update `PropsToOverride` once to affect all components
-   ❌ Old pattern (deprecated): `Omit<UIProps, 'children' | 'ref' | 'onClick' | 'onChange' | 'onKeyPress' | 'inputId' | 'label'>`

### Export Files (index.ts) - React and Vue

**IMPORTANT:** The `index.ts` files in React and Vue should export the same items in a similar structure, with only framework-specific differences.

**React index.ts pattern:**

```typescript
export { Badge, type BadgeProps } from './Badge';
export { BadgeWrapper, type BadgeWrapperProps } from './BadgeWrapper';
export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS } from '@lumx/core/js/components/Badge';
```

**Vue index.ts pattern:**

```typescript
export { default as Badge, type BadgeProps } from './Badge';
export { default as BadgeWrapper, type BadgeWrapperProps } from './BadgeWrapper';
```

**Key differences:**

-   Vue uses `default as ComponentName` for component exports (because Vue component files use default export)
-   React uses direct named exports (because React component files use named exports)
-   **Vue does NOT export `CLASSNAME`, `COMPONENT_NAME`, or `DEFAULT_PROPS`** — these are internal constants meant for core/React only
-   Both export the same component types and props

### Core Component Structure

```typescript
import type { JSXElement, LumxClassName, HasTheme, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';
import { InputLabel } from '../InputLabel';
import { InputHelper } from '../InputHelper';

export interface ComponentProps extends HasTheme, HasClassName, HasAriaDisabled {
    helper?: string;
    inputId: string;  // Required
    label?: JSXElement;  // Not 'children'
    // ... other props
}

export const COMPONENT_NAME = 'Component';
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-component';
export const DEFAULT_PROPS: Partial<ComponentProps> = {};

export const Component = (props: ComponentProps) => {
    const { label, inputId, helper, /* ... */ } = props;

    return (
        <div className={/* ... */}>
            {/* Component structure */}
            {label && InputLabel({ htmlFor: inputId, children: label })}
            {helper && InputHelper({ id: `${inputId}-helper`, children: helper })}
        </div>
    );
};
```

### React Wrapper Structure

```typescript
import React from 'react';
import {
    Component as UI,
    ComponentProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Component';
import { useId, useTheme, useDisableStateProps, useMergeRefs } from '@lumx/react/...';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

export interface ComponentProps extends GenericProps, ReactToJSX<UIProps, 'inputId' | 'label'> {
    children?: React.ReactNode;
}

export const Component = forwardRef<ComponentProps, HTMLDivElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const defaultTheme = useTheme() || Theme.light;
    const { children, id, inputRef /* ... */ } = otherProps;

    const localInputRef = React.useRef<HTMLInputElement>(null);
    const generatedInputId = useId();
    const inputId = id || generatedInputId;

    return UI({
        ref,
        label: children, // Map children → label
        inputId,
        inputRef: useMergeRefs(inputRef, localInputRef),
        theme: defaultTheme,
        isDisabled: isAnyDisabled,
        inputProps: {
            ...inputProps,
            ...disabledStateProps,
            readOnly: inputProps.readOnly || isAnyDisabled,
        },
        ...otherProps,
    });
});
```

### Vue Wrapper Structure

```typescript
import { computed, defineComponent, toRaw, useAttrs } from 'vue';
import {
    Component as ComponentUI,
    type ComponentProps as UIProps,
} from '@lumx/core/js/components/Component';
import { useTheme, useDisableStateProps, useId } from '../../composables/...';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';

export type ComponentProps = VueToJSXProps<UIProps, 'inputId' | 'label'>;

export const emitSchema = {
    change: (/* params */) => /* validation */,
};

const Component = defineComponent(
    (props: ComponentProps, { emit, slots }) => {
        const attrs = useAttrs();
        const defaultTheme = useTheme();
        const generatedInputId = useId();
        const inputId = computed(() => props.id || generatedInputId);

        const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(
            computed(() => ({ ...props, ...attrs })),
        );

        const handleChange = (/* params */) => {
            if (isAnyDisabled.value) return;

            event.stopImmediatePropagation();  // Important!
            emit('change', /* params */);
        };

        return () => {
            // Unwrap linkAs from reactivity before passing to core (see pitfall #22)
            const { linkAs, ...rest } = otherProps.value;

            // Use JSX rendering
            return (
                <ComponentUI
                    {...rest}
                    linkAs={toRaw(linkAs)}
                    className={props.class}
                    theme={props.theme || defaultTheme}
                    inputId={inputId.value}
                    isDisabled={isAnyDisabled.value}
                    onChange={handleChange}
                    label={(props.label || slots.default?.()) as JSXElement}
                    inputProps={{
                        ...props.inputProps,
                        ...disabledStateProps.value,
                        readOnly: isAnyDisabled.value,
                    }}
                />
            );
        };
    },
    {
        name: 'LumxComponent',  // Prefix with 'Lumx'
        inheritAttrs: false,
        props: keysOf<ComponentProps>()(/* list all props */),
        emits: emitSchema,
    },
);

export default Component;
```

## Common Pitfalls

1. **🛑 NEVER skip validation checkpoints!** - This is the #1 most critical pitfall!
    - ✅ ALWAYS use AskUserQuestion tool at each checkpoint
    - ✅ WAIT for user approval before proceeding to next phase
    - ❌ NEVER continue to next phase without explicit user approval
    - ❌ NEVER assume "the user will validate later" - validate NOW
2. **🛑 ALWAYS update PropsToOverride when adding new callbacks to core!**
    - ✅ Check if core UI defines new callback props (e.g., `onCustomEvent`, `onSpecialAction`)
    - ✅ If new callbacks exist, update `/packages/lumx-core/src/js/types/jsx/PropsToOverride.ts`
    - ✅ Add the new callback to the PropsToOverride type union (e.g., `'ref' | 'onClick' | 'onChange' | 'onKeyPress' | 'onCustomEvent'`)
    - ❌ NEVER leave callback props in core without adding them to PropsToOverride
    - This ensures React and Vue can provide their own framework-specific implementations
3. **🛑 NEVER put JSX in `args` or `withCombinations` values** — All JSX must live in `render` functions. JSX in `args` (including `args.children`, `args.before`, `args.after`, `args.badge`) causes errors in Vue storybook tests. Combination rows/sections/cols values are merged into args at runtime, so they have the same restriction.
    - ✅ `render: (args: any) => <Badge {...args}><Icon icon={mdiHeart} /></Badge>`
    - ✅ `args: { color: 'red', isDisabled: true }` (serializable data only)
    - ❌ `args: { children: <Icon icon={mdiHeart} /> }` (JSX in args)
    - ❌ `rows: { 'With icon': { children: <Icon icon={mdiHeart} /> } }` (JSX in combinations)
4. **🛑 Define stories as individual `const` variables** — This enables cross-referencing between stories (e.g., reusing a render function, composing multiple renders). Return a flat object: `return { meta, StoryA, StoryB, ... }`.
    - ✅ `const WithIcon = { render: (args) => ... }; const AllTypography = { render: WithIcon.render, ... };`
    - ❌ Inline objects in the return statement that can't reference each other
5. **🛑 Vue stories MUST provide a `render` override when the Vue component uses slots AND the core meta.render passes content via args** — When each core story defines its own `render` that directly renders JSX children (the new default pattern), Vue usually doesn't need a render override. But when the core meta.render receives slot-like content via args (e.g., `label`, `before`, `after`), the Vue stories must map props to slots.
    - ✅ Default slot: `render: ({ label, ...args }: any) => <Flag {...args}>{label}</Flag>`
    - ✅ Named slots: `render: ({ label, before, after, ...args }: any) => (<Toolbar {...args}>{{ default: label ? () => label : undefined, before: before ? () => before : undefined }}</Toolbar>)`
    - ❌ No render override when Vue component uses slots and core render passes content via args
    - **How to check:** Read the Vue component's `.tsx` file. If it accesses `slots` (e.g., `slots.default?.()`, `slots.before?.()`) for any of the content props used in the core stories, a render override may be required.
6. **Core stories USE JSX in render functions** — but only with injected components from the `components` parameter. Never import from `@lumx/react` or `@lumx/vue` in core stories.
    - ✅ Core stories: `render: (args) => <Badge {...args}><Icon icon={mdiHeart} /></Badge>` (JSX in render, using `Icon` from `components` param)
    - ❌ Core stories: `args: { children: <Icon icon={mdiHeart} /> }` (JSX in args)
    - ❌ Core stories: `import { Icon } from '@lumx/react'` (hardcoded framework import)
7. **Core tests still use plain data only (no JSX)** — the JSX approach applies to stories only
    - ✅ Core tests: `children: '30'`, use `SetupOptions` pattern with default export
    - ❌ Core tests: `children: <Icon />` or JSX render functions
8. **DO NOT add NOTE comments or explanatory comments** - Don't add meta-commentary like "NOTE: X is not migrated because..." or "This test is framework-specific". Keep generated code clean.
9. **Don't add/remove stories** - Migrate existing stories only, keep the same set of stories
10. **🛑 ALWAYS destructure `children` out of args in story render functions** — When a render function provides its own inline JSX children, it must destructure `children` from the args to prevent the inherited `children` value (from `meta.args`) from leaking via `{...args}` onto the component. In Vue, spreading `children` as a prop on a DOM element causes `"Failed setting prop children"` warnings.
    - ✅ `render: ({ children, ...args }: any) => <Link {...args}>Link <Icon icon={mdiEarth} /> with icon</Link>`
    - ❌ `render: (args: any) => <Link {...args}>Link <Icon icon={mdiEarth} /> with icon</Link>` (`children` from meta.args leaks as a DOM prop)
11. **Don't use `Children.count()` in core** - This is React-specific
12. **Always use functional calls in core UI** - `InputLabel({ ... })` not `<InputLabel ... />`
13. **Add stopImmediatePropagation** - Prevent event bubbling in Vue wrapper (when handling events)
14. **Use JSX in Vue wrapper** - `return (<Component />)` not function calls
15. **Set correct component name** - Vue: `'LumxComponent'`, not `'Component'`
16. **Use `.tsx` extension for ALL story files** — core, React, and Vue stories all use JSX (Vue stories need `.tsx` when they provide a `render` override with JSX)
17. **No `.vue` template files for stories** — all story rendering is handled by JSX in core. Do NOT create `Stories/*.vue` files or use `withRender`.
18. **Vue tests must mimic React tests** - Include the same structure with `commonTestsSuiteVTL`
19. **Vue `index.ts` should export components and types only** - Do NOT export `CLASSNAME`, `COMPONENT_NAME`, or `DEFAULT_PROPS` from Vue index files. Only export components (using `default as` syntax) and types (props, enums)
20. **Always check for existing core implementation first** - Before creating UI/Stories/Tests in core, verify they don't already exist. If they do, reuse them and only make changes after user approval
21. **Use ReactToJSX and VueToJSXProps type utilities** - Don't manually list all props to omit; use the new type utilities that automatically handle PropsToOverride
22. **🛑 Use `toRaw()` on props that accept Vue component references** — Props like `linkAs` accept a Vue component object (e.g., a custom `RouterLink`). When this component object flows through Vue's reactivity system (props → `computed` → spread in `useDisableStateProps`), it becomes a reactive proxy. Passing a reactive component to JSX causes: `[Vue warn]: Vue received a Component that was made a reactive object`. Use `toRaw()` to unwrap reactivity before passing to the core UI component.
    - ✅ `const { linkAs, ...rest } = otherProps.value; <CoreUI {...rest} linkAs={toRaw(linkAs)} />`
    - ❌ `<CoreUI {...otherProps.value} />` (linkAs is still a reactive proxy)
    - **When does this apply?** Only for props whose value can be a **component reference** (function or object), like `linkAs`. Props like `as` on Text/Heading/FlexBox only accept **string** tag names (`'span'`, `'p'`, `'h1'`, `'div'`), which are primitives immune to reactivity — no `toRaw()` needed for those.
    - **Affected components:** `Link`, `Button`, `IconButton`, `Thumbnail` — any component with a `linkAs` prop.
    - **Import:** `import { toRaw } from 'vue';`

## Single Component vs Component Family

### Single Component (e.g., Switch, Divider)

-   One component file in the folder
-   Migration is straightforward: Phases 0-6 sequentially
-   CHANGELOG entry lists one component

### Component Family (e.g., Table, Badge)

-   Multiple component files in the same folder
-   **Phase 0 is critical**: Must analyze dependencies and determine order
-   **Phases 1-4 repeat per component** in the migration order
-   **Phases 5-6 run once** for the entire family
-   CHANGELOG entry lists all components in the family
-   **Common patterns:**
    -   Parent defines `constants.ts` → migrate parent first
    -   Sub-components import from constants → migrate after parent
    -   Sub-components are independent → can migrate in any order

## Reference Components

### Single Components

-   **Checkbox**: Full implementation with intermediate state
-   **Switch**: Recently migrated, good reference for binary components
-   **Divider**: Simple component without complex dependencies
-   **Link**: Good reference for stories with `const` pattern, render reuse across stories, and `withCombinations`
-   **Text**: Good reference for sharing `render` across stories (`WithIcon.render` reused by `AllTypography` and `AllColors`)

### Component Families

-   **Badge**: Best reference for the **new stories pattern** — `const` variables, no JSX in args, story render composition (`AllColors` composes `WithText.render`, `WithIcon.render`, `WithThumbnail.render`), and `FlexBox` for layout
-   **Toolbar**: Good reference for components with **slot-like props** — each story self-contains its JSX, Vue side provides `render` override for slot mapping
-   **Table** (not yet migrated): Parent `Table` + sub-components `TableBody`, `TableCell`, `TableHeader`, `TableRow`
-   **Button**: Good example of event handling with stopImmediatePropagation

## Files Created/Modified Checklist

**IMPORTANT:** This checklist applies to EACH component in the family. Complete all phases for one component before moving to the next (following the migration order from Phase 0).

**Note:** For sub-components (e.g., `BadgeWrapper` alongside `Badge`, or `TableRow` alongside `Table`), replace `<Component>` with the parent folder name (e.g., `Badge`, `Table`), and use `<SubComponent>.tsx` instead of `index.tsx` in core.

**Note:** For parent components with `constants.ts`, create the constants file in core during the first component migration.

### Phase 1: UI Extraction & Implementation (Per Component)

-   [ ] `/packages/lumx-core/src/js/components/<Component>/index.tsx` (created) or `<Component>/<SubComponent>.tsx` for sub-components
-   [ ] `/packages/lumx-react/src/components/<component>/<Component>.tsx` (modified to wrapper)
-   [ ] `/packages/lumx-vue/src/components/<component>/<Component>.tsx` (created)
-   [ ] `/packages/lumx-vue/src/components/<component>/index.ts` (created or updated to export sub-component)
-   [ ] `/packages/lumx-vue/src/index.ts` (export already exists for parent folder)

### Phase 2: Stories Migration

**Step 1: Core Stories**

-   [ ] Analyze existing React stories for component dependencies
-   [ ] Identify components to pass via `components` parameter
-   [ ] `/packages/lumx-core/src/js/components/<Component>/Stories.tsx` (created - JSX with injected components)

**Step 2: React Stories**

-   [ ] `/packages/lumx-react/src/components/<component>/<Component>.stories.tsx` (modified - thin wrapper + re-exports)
-   [ ] Validation checkpoint 2a (developer validates all React stories)

**Step 3: Vue Stories**

-   [ ] `/packages/lumx-vue/src/components/<component>/<Component>.stories.tsx` (created - thin wrapper + re-exports)
-   [ ] Validation checkpoint 2b (developer validates all Vue stories)

### Phase 3: Tests Migration

-   [ ] `/packages/lumx-core/src/js/components/<Component>/Tests.ts` (created - NO JSX, plain data only)
-   [ ] `/packages/lumx-react/src/components/<component>/<Component>.test.tsx` (modified)
-   [ ] `/packages/lumx-vue/src/components/<component>/<Component>.test.ts` (created)

### Phase 4-6: Finalization

-   [ ] Package exports verified
-   [ ] `/CHANGELOG.md` (add entry under Unreleased)
-   [ ] Final build verification completed

### Phase 7: Vue Documentation

-   [ ] Check if documentation page exists
-   [ ] Run vue-docs skill for the component
-   [ ] Verify Vue demo files created
-   [ ] Verify MDX page updated with Vue support

## Migration Workflow for Component Families

When migrating a component family (e.g., Table, TableRow, TableCell, etc.):

1. **Complete Phase 0** for the entire family
2. **For each component in migration order:**
    - Complete Phase 1 (UI Extraction) → Checkpoint
    - Complete Phase 2 (Stories) → Checkpoint
    - Complete Phase 3 (Tests) → Checkpoint
    - Complete Phase 4 (Package Exports)
3. **After all components are migrated:**
    - Complete Phase 5 (CHANGELOG) once for the entire family
    - Complete Phase 6 (Final Build Verification)
    - Complete Phase 7 (Vue Documentation)

**Example Timeline for Table Family:**

```
Phase 0: Discovery & Planning (all components)
├─ Component 1: Table
│  ├─ Phase 1: UI Extraction → ✓
│  ├─ Phase 2: Stories → ✓
│  ├─ Phase 3: Tests → ✓
│  └─ Phase 4: Package Exports → ✓
├─ Component 2: TableBody
│  ├─ Phase 1: UI Extraction → ✓
│  ├─ Phase 2: Stories → ✓
│  ├─ Phase 3: Tests → ✓
│  └─ Phase 4: Package Exports → ✓
├─ ... (repeat for TableCell, TableHeader, TableRow)
├─ Phase 5: CHANGELOG (entire family)
└─ Phase 6: Final Build Verification (entire family)
```

## Success Criteria

### After Phase 0 (Discovery & Planning)

-   [ ] All components in the family discovered
-   [ ] Dependencies analyzed
-   [ ] Migration order determined
-   [ ] Blocking dependencies identified
-   [ ] Developer approves migration plan

### After Phase 1 (UI Extraction - Per Component)

-   [ ] `yarn test` passes
-   [ ] `yarn type-check` passes
-   [ ] React component still works (backward compatible)
-   [ ] Vue component renders basic UI
-   [ ] Developer validates UI implementation

### After Phase 2 (Stories)

**After Step 1 (Core Stories):**

-   [ ] All component dependencies analyzed
-   [ ] Components to inject via `components` parameter identified
-   [ ] Core `Stories.tsx` created with JSX renders using injected components
-   [ ] Core stories created successfully

**After Step 2 (React Stories - Checkpoint 2a):**

-   [ ] React stories `.tsx` wrapper created with `components` and `decorators`
-   [ ] `yarn type-check` passes
-   [ ] All React Storybook stories render correctly
-   [ ] All variants and states display properly
-   [ ] Developer validates React stories ✅

**After Step 3 (Vue Stories - Checkpoint 2b):**

-   [ ] Vue stories `.tsx` wrapper created with `components` and `decorators`
-   [ ] `yarn test` passes
-   [ ] `yarn type-check` passes
-   [ ] All Vue Storybook stories render correctly
-   [ ] All variants and states display properly
-   [ ] Developer validates all Vue stories ✅

### After Phase 3 (Tests)

-   [ ] No JSX in core tests (plain data only)
-   [ ] All core tests pass
-   [ ] All React tests pass (including imported core tests)
-   [ ] All Vue tests pass (including imported core tests)
-   [ ] `yarn test` passes
-   [ ] `yarn type-check` passes
-   [ ] Developer validates test coverage

### Final Success Criteria

-   [ ] All packages build successfully (`yarn build:core`, `yarn build:react`, `yarn build:vue`)
-   [ ] React API is backward compatible
-   [ ] CHANGELOG is updated
-   [ ] No console errors in Storybook
