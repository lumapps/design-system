---
name: migrate-component
description: Migrate a React-only component to the shared core/React/Vue architecture
argument-hint: [component-name]
allowed-tools: Read, Write, Edit, Bash(yarn test:*), Bash(yarn build:*), Bash(mkdir:*), Bash(ls:*), Glob, Grep, Task, TodoWrite
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
- **Core package** (`@lumx/core`): Contains framework-agnostic UI logic, tests (plain data only, no JSX), and stories (plain data only, no JSX)
- **React package** (`@lumx/react`): Thin wrapper that delegates to core
- **Vue package** (`@lumx/vue`): Thin wrapper that delegates to core

**Component Families:**
- A component name may refer to a **family of components** (e.g., "Table" includes Table, TableRow, TableCell, TableBody, TableHeader)
- When migrating a component family, the skill will:
  1. **Discover all components** in the family by scanning the React folder
  2. **Analyze dependencies** between components and external dependencies
  3. **Determine migration order** based on dependencies
  4. **Migrate each component** in the correct order through all phases

**Component Organization:**
- **Sub-components go in the same folder as their parent component**
- Example: `Badge` and `BadgeWrapper` both live in the `badge/` folder
  - Core: `/packages/lumx-core/src/js/components/Badge/` contains both `Badge` and `BadgeWrapper`
  - React: `/packages/lumx-react/src/components/badge/` contains both `Badge.tsx` and `BadgeWrapper.tsx`
  - Vue: `/packages/lumx-vue/src/components/badge/` contains both `Badge.tsx` and `BadgeWrapper.tsx`
- Example: `Table` family in the `table/` folder
  - Core: `/packages/lumx-core/src/js/components/Table/` contains `index.tsx` (Table), `TableRow.tsx`, `TableCell.tsx`, etc.
  - React: `/packages/lumx-react/src/components/table/` contains `Table.tsx`, `TableRow.tsx`, `TableCell.tsx`, etc.
  - Vue: `/packages/lumx-vue/src/components/table/` contains `Table.tsx`, `TableRow.tsx`, `TableCell.tsx`, etc.
- The folder name uses lowercase-with-dashes (e.g., `badge/`, `table/`), while the component names use PascalCase (e.g., `Badge`, `BadgeWrapper`, `Table`, `TableRow`)

## Prerequisites

Before running this skill, ensure:
1. The component exists in `@lumx/react` and is fully functional
2. The component has existing tests and stories
3. A reference component (like Checkbox) has already been migrated and can serve as a pattern

## Phase 0: Discovery & Dependency Analysis

**Goal:** Discover all components in the family and determine the correct migration order.

**IMPORTANT:** This phase MUST be completed before starting any migration work.

1. **Discover component family:**
   - Read `/packages/lumx-react/src/components/<component-name>/index.ts` to find all exported components
   - List all `.tsx` files in the component folder
   - Identify which component is the parent and which are sub-components

2. **Analyze dependencies:**
   - For each component, check if it imports:
     - Constants from a shared `constants.ts` file (dependency on parent)
     - Other components from the same folder (dependency on siblings)
     - Components from `@lumx/react` or `@lumx/core` (external dependencies)
   - Verify external component dependencies are available in `@lumx/core`
   - Document any blocking dependencies (components not yet migrated to core)

3. **Determine migration order:**
   - **If there's a `constants.ts` file**, migrate the parent component first (it will create the constants in core)
   - **If sub-components import the parent component**, migrate the parent first
   - **Otherwise**, components can be migrated in any order
   - Create a numbered list of components in migration order

4. **Present migration plan to developer:**
   - Show discovered components
   - Show dependency analysis
   - Show proposed migration order
   - List any blocking dependencies
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
- Developer reviews and approves the migration plan
- Developer confirms all external dependencies are available or acceptable to skip

## Migration Steps

**IMPORTANT:** After Phase 0 approval, migrate each component in the determined order by going through Phases 1-6 for each component before moving to the next.

### Phase 1: UI Extraction & Implementation

**Goal:** Extract the core UI logic and create thin wrappers for React and Vue.

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
     - Export: `Component`, `ComponentProps`, `COMPONENT_NAME`, `CLASSNAME`, `DEFAULT_PROPS` (or import from constants if applicable)

3. **Update React wrapper:**
   - Import UI component from core
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
   - Create `index.ts` to export component, props, and constants

5. **Update Vue package index:**
   ```typescript
   export * from './components/<component-name>';
   ```

**Validation Checkpoint 1:**
- Run `yarn test` to ensure no regressions
- Run `yarn type-check` to verify TypeScript compilation
- Ask developer for validation before proceeding to Phase 2

### Phase 2: Stories Migration

**Goal:** Extract core stories and create framework-specific story implementations.

**IMPORTANT RULES:**
- **NO JSX ELEMENTS in core stories** - Use plain data or functional JSX calls, NOT JSX elements like `<Component />`
  - ✅ Allowed: `children: 'text'`, `children: Icon({ icon: mdiHeart })`
  - ❌ Not allowed: `children: <Icon icon={mdiHeart} />`
- **Analyze component dependencies** - Read existing stories and check if all components used are available in `@lumx/core`
- **Skip stories with unavailable dependencies** - If a story uses components not yet in core, document it and skip migration for that story
- **Keep the same stories** - Don't add or remove stories; migrate existing ones only

#### Step 1: Analyze and Create Core Stories

1. **Read and analyze existing React stories:**
   - Identify all components used in the stories
   - Check if those components exist in `@lumx/core/js/components/`
   - Document any stories that cannot be migrated due to missing core dependencies

2. **Create core stories (`packages/lumx-core/src/js/components/<ComponentName>/Stories.ts`):**
   - **NO JSX ELEMENTS or component function calls allowed** - Use plain data only
   - **Stories that need component children must use `overrides`** - Let React/Vue provide the actual components
   - Export `setup()` function that takes `{ component, render, decorators, overrides }` and returns story configurations
   - List stories that need component children in the `overrides` type parameter
   - Only migrate stories where all component dependencies are available in core
   - For stories with unavailable dependencies, add a comment explaining why they weren't migrated
   - **Keep the same stories** - Migrate existing stories, don't add new ones
   - Pattern with TypeScript types:
     ```typescript
     import type { SetupStoriesOptions } from '@lumx/core/stories/types';
     import { DEFAULT_PROPS } from '.';

     export function setup({
         component,
         render,
         decorators: { withCombinations },
         overrides = {},
     }: SetupStoriesOptions<{
         overrides: 'WithIcon';  // List stories that need component children
         decorators: 'withCombinations';  // List required decorators (or 'never' for none)
     }>) {
         return {
             meta: {
                 component,
                 render,
                 argTypes: {
                     color: colorArgType,
                     children: { control: false },
                 },
                 args: {
                     ...DEFAULT_PROPS,
                 },
             },

             /** Story description */
             Default: {
                 args: {
                     children: 'Text', // Plain data only
                 },
             },

             /** Story with component children - injected via overrides */
             WithIcon: {
                 ...overrides.WithIcon,  // Framework provides the Icon component
             },

             AllColors: {
                 argTypes: {
                     color: { control: false },
                 },
                 decorators: [
                     withCombinations({
                         combinations: {
                             cols: { key: 'color', options: ColorPalette },
                             rows: {
                                 'With text': { children: '30' },
                                 // Framework-specific rows added via decorator override in React/Vue
                             },
                         },
                     }),
                 ],
             },
         };
     }
     ```

#### Step 2: Implement React Stories (All Stories)

3. **Update React stories to use core setup:**
   - Import `setup` from core stories
   - Call `const { meta, ...stories } = setup({ component, decorators, overrides })`
   - Pass React-specific decorators (e.g., `withCombinations`, `withWrapper`)
   - **Pass `overrides` for stories with component children** - Provide JSX for component rendering
   - Export default with `...meta`
   - Export each story individually: `export const StoryName = { ...stories.StoryName };`
   - **Override stories at export level as needed** by spreading the core story and adding/replacing properties
   - Add stories that couldn't be migrated to core (due to missing dependencies) as separate exports
   - Pattern:
     ```typescript
     import { Component, Icon } from '@lumx/react';
     import { mdiHeart } from '@lumx/icons';
     import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
     import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
     import { setup } from '@lumx/core/js/components/Component/Stories';

     const { meta, ...stories } = setup({
         component: Component,
         decorators: { withCombinations, withWrapper },
         overrides: {
             // Provide JSX for stories that need component children
             WithIcon: {
                 args: {
                     children: <Icon icon={mdiHeart} />,
                 },
             },
         },
     });

     export default {
         title: 'LumX components/component/Component',
         ...meta,
     };

     // Export stories as-is from core
     export const Default = { ...stories.Default };
     export const WithIcon = { ...stories.WithIcon };

     // Override a story at export with React-specific customizations
     export const CustomStory = {
         ...stories.CustomStory,
         // Override decorators, render, args, etc. as needed
         decorators: [
             withCombinations({ /* React-specific config */ }),
         ],
     };

     // Stories not in core (e.g., using components not yet migrated)
     export const WithThumbnail = {
         args: {
             children: <Thumbnail ... />,
         },
     };
     ```

**Validation Checkpoint 2a:**
- Run `yarn type-check` to verify TypeScript compilation
- Visual verification in Storybook:
  - Verify ALL React stories render correctly
  - Test all variants and states
- Ask developer for validation before proceeding to Vue stories

#### Step 3: Implement First Vue Story

4. **Create Vue story infrastructure with ONE story:**
   - Create `<Component>.stories.ts` in Vue component directory (use `.tsx` if using JSX in decorators/overrides)
   - Import `setup` from core stories
   - **IMPORTANT: Components with `children` prop need `withRender` to convert children to slots**
   - For components with `children`:
     - Create a `.vue` template in `Stories/` subdirectory that wraps the component with `<slot />`
     - Pass `render: withRender({ ComponentDefaultVue }, '{{ args.children }}')` to setup
   - Call `const { meta, ...stories } = setup({ component, render, decorators })`
   - Pass Vue-specific decorators (e.g., `withCombinations`, `withWrapper`)
   - Implement ONLY the Default/first story export

   - **Pattern for components with `children` prop:**
     ```typescript
     // Badge.stories.ts (NO .tsx needed, no JSX in args)
     import { Badge } from '@lumx/vue';
     import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
     import { withRender } from '@lumx/vue/stories/utils/withRender';
     import { setup } from '@lumx/core/js/components/Badge/Stories';
     import BadgeDefaultVue from './Stories/BadgeDefault.vue';
     import BadgeWithIconVue from './Stories/BadgeWithIcon.vue';

     const { meta, ...stories } = setup({
         component: Badge,
         render: withRender({ BadgeDefaultVue }, '{{ args.children }}'),
         decorators: { withCombinations },
         overrides: {
             // For stories with component children, provide .vue template with render
             WithIcon: {
                 render: withRender({ BadgeWithIconVue }),
             },
         },
     });

     export default {
         title: 'LumX components/badge/Badge',
         ...meta,
     };

     // Export ONLY the first story
     export const WithText = { ...stories.WithText };
     ```

   - **Vue template for component children (`Stories/BadgeWithIcon.vue`):**
     ```vue
     <template>
         <Badge v-bind="$attrs">
             <Icon :icon="mdiHeart" />
         </Badge>
     </template>

     <script setup lang="ts">
     import { Badge, Icon } from '@lumx/vue';
     import { mdiHeart } from '@lumx/icons';
     </script>
     ```

   - **Vue template pattern (`Stories/BadgeDefault.vue`):**
     ```vue
     <template>
         <Badge v-bind="$attrs">
             <slot />
         </Badge>
     </template>

     <script setup lang="ts">
     import { Badge } from '@lumx/vue';
     </script>
     ```

   - **Pattern for components WITHOUT `children` (e.g., Divider):**
     ```typescript
     const { meta, ...stories } = setup({
         component: Component,
         decorators: { withCombinations },
     });
     // No render or .vue template needed
     ```

**Validation Checkpoint 2b:**
- Run `yarn type-check` to verify TypeScript compilation
- Visual verification in Storybook:
  - Verify the first Vue story renders correctly
- Ask developer for validation before implementing remaining stories

#### Step 4: Implement Remaining Vue Stories

5. **Complete all remaining Vue stories:**
   - Export all remaining stories: `export const StoryName = { ...stories.StoryName };`
   - **Override stories as needed** by spreading the core story and adding/replacing properties
   - Create additional `.vue` templates if needed for different story variants
   - Ensure all stories follow the same pattern as the validated first story
   - Add stories that couldn't be migrated to core (due to missing dependencies) as separate exports

**Validation Checkpoint 2c (Final):**
- Run `yarn test` to ensure no regressions
- Run `yarn type-check` to verify TypeScript compilation
- Visual verification in Storybook:
  - Verify ALL Vue stories render correctly
  - Test all variants and states
- Ask developer for final validation before proceeding to Phase 3

### Phase 3: Tests Migration

**Goal:** Extract core tests and update framework-specific test suites.

**IMPORTANT RULES:**
- **NO JSX ELEMENTS or component calls in core tests** - Use plain data only
- **Tests that need component children must use framework-specific setup** - Don't migrate those to core
- **Vue tests should mimic React tests** - Include the same structure: core tests import, framework-specific describe block, and `commonTestsSuiteVTL` (Vue) or `commonTestsSuiteRTL` (React)
- **DO NOT add NOTE comments or explanatory comments in generated files** - Keep code clean without meta-commentary

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

**Validation Checkpoint 3:**
- Run `yarn test` to ensure all tests pass
- Run `yarn type-check` to verify TypeScript compilation
- Verify core tests use only plain data (no JSX)
- Verify framework-specific tests remain in React/Vue
- Ask developer for validation before proceeding to Phase 4

**Important Notes:**
- Tests with framework-specific rendering behavior (e.g., empty children) should stay in framework test files
- Vue uses slots for children, so the render helper must convert `children` prop to `slots.default`
- React renders empty for `null` children, Vue renders comment nodes `<!---->`
- Vue tests should include `commonTestsSuiteVTL` to match React's `commonTestsSuiteRTL` structure
- Core `setup()` function should return aliases if needed (e.g., `const div = badge;`) for `commonTestsSuite` compatibility

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
     - Verify every `.stories.tsx` file in React has a corresponding `.stories.ts` file in Vue
     - Read both story files and compare exported story names
     - Ensure all React stories have Vue equivalents (e.g., Default, WithHeader, AllStates)
     - Example check:
       ```bash
       # React stories
       ls packages/lumx-react/src/components/<component-name>/*.stories.tsx
       # Vue stories
       ls packages/lumx-vue/src/components/<component-name>/*.stories.ts
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
           describe('React', () => { /* React-specific tests */ });
           commonTestsSuiteRTL(setup, { /* config */ });
       });

       // Vue test structure should match:
       describe('<Component />', () => {
           BaseComponentTests({ render, screen });
           describe('Vue', () => { /* Vue-specific tests */ });
           commonTestsSuiteVTL(setup, { /* same config */ });
       });
       ```

   - **Fix any discrepancies found:**
     - Missing Vue stories → Create them using `.vue` templates and `withRender`
     - Missing Vue tests → Add them following the React test structure
     - Missing `applyTheme` config → Add to Vue test
     - Missing Vue-specific tests → Add equivalent tests for Vue behavior

   - **Run tests again after fixes:**
     ```bash
     yarn test
     ```

## Key Patterns to Follow

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

export interface ComponentProps extends GenericProps, Omit<UIProps, 'inputId' | 'label'> {
    children?: React.ReactNode;
}

export const Component = forwardRef<ComponentProps, HTMLDivElement>((props, ref) => {
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const defaultTheme = useTheme() || Theme.light;
    const { children, id, inputRef, /* ... */ } = otherProps;

    const localInputRef = React.useRef<HTMLInputElement>(null);
    const generatedInputId = useId();
    const inputId = id || generatedInputId;

    return UI({
        ref,
        label: children,  // Map children → label
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
import { computed, defineComponent, useAttrs } from 'vue';
import {
    Component as ComponentUI,
    type ComponentProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Component';
import { useTheme, useDisableStateProps, useId } from '../../composables/...';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { JSXElement } from '@lumx/core/js/types';

export type ComponentProps = VueToJSXProps<UIProps, 'inputId' | 'inputRef'>;

export const emitSchema = {
    change: (/* params */) => /* validation */,
};

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

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
            // Use JSX rendering
            return (
                <ComponentUI
                    {...otherProps.value}
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

1. **NO JSX ELEMENTS or component calls in core stories or tests** - Use plain data only, provide components via `overrides` (stories) or framework-specific tests (tests)
   - ✅ Core stories: `children: 'Text'` or `...overrides.WithIcon`
   - ❌ Core stories: `children: <Icon />`, `children: Icon({ icon: mdiHeart })`
   - ✅ Core tests: `children: '30'`, use `SetupOptions` pattern with default export
   - ❌ Core tests: Pass testing utilities as parameters, don't follow Button pattern
2. **DO NOT add NOTE comments or explanatory comments** - Don't add meta-commentary like "NOTE: X is not migrated because..." or "This test is framework-specific". Keep generated code clean.
3. **Don't add/remove stories** - Migrate existing stories only, keep the same set of stories
4. **Check component dependencies before migrating stories** - If a story uses components not in core, don't migrate it
5. **Don't use `Children.count()` in core** - This is React-specific
6. **Always use functional calls in core UI** - `InputLabel({ ... })` not `<InputLabel ... />`
7. **Add stopImmediatePropagation** - Prevent event bubbling in Vue wrapper (when handling events)
8. **Use JSX in Vue wrapper** - `return (<Component />)` not function calls
9. **Set correct component name** - Vue: `'LumxComponent'`, not `'Component'`
10. **Vue stories with component children need `.vue` templates in `overrides`** - Create `.vue` template and use `render: withRender({ ComponentVue })` in overrides
11. **Vue components with `children` need base `.vue` template + `withRender`** - Convert children prop to slots
12. **Don't override Vue combination decorators with JSX** - Can't use JSX in `withCombinations` rows; use core version or create templates
13. **Don't pass JSX components in Vue `args.children`** - Use `render: withRender({ ComponentVue })` instead
14. **Use `.ts` extension for Vue stories** - Only use `.tsx` if absolutely necessary (rare)
15. **Vue tests must mimic React tests** - Include the same structure with `commonTestsSuiteVTL`

## Single Component vs Component Family

### Single Component (e.g., Switch, Divider)
- One component file in the folder
- Migration is straightforward: Phases 0-6 sequentially
- CHANGELOG entry lists one component

### Component Family (e.g., Table, Badge)
- Multiple component files in the same folder
- **Phase 0 is critical**: Must analyze dependencies and determine order
- **Phases 1-4 repeat per component** in the migration order
- **Phases 5-6 run once** for the entire family
- CHANGELOG entry lists all components in the family
- **Common patterns:**
  - Parent defines `constants.ts` → migrate parent first
  - Sub-components import from constants → migrate after parent
  - Sub-components are independent → can migrate in any order

## Reference Components

### Single Components
- **Checkbox**: Full implementation with intermediate state
- **Switch**: Recently migrated, good reference for binary components
- **Divider**: Simple component without complex dependencies

### Component Families
- **Badge**: Parent `Badge` + sub-component `BadgeWrapper`
- **Table** (not yet migrated): Parent `Table` + sub-components `TableBody`, `TableCell`, `TableHeader`, `TableRow`
- **Button**: Good example of event handling with stopImmediatePropagation

## Files Created/Modified Checklist

**IMPORTANT:** This checklist applies to EACH component in the family. Complete all phases for one component before moving to the next (following the migration order from Phase 0).

**Note:** For sub-components (e.g., `BadgeWrapper` alongside `Badge`, or `TableRow` alongside `Table`), replace `<Component>` with the parent folder name (e.g., `Badge`, `Table`), and use `<SubComponent>.tsx` instead of `index.tsx` in core.

**Note:** For parent components with `constants.ts`, create the constants file in core during the first component migration.

### Phase 1: UI Extraction & Implementation (Per Component)
- [ ] `/packages/lumx-core/src/js/components/<Component>/index.tsx` (created) or `<Component>/<SubComponent>.tsx` for sub-components
- [ ] `/packages/lumx-react/src/components/<component>/<Component>.tsx` (modified to wrapper)
- [ ] `/packages/lumx-vue/src/components/<component>/<Component>.tsx` (created)
- [ ] `/packages/lumx-vue/src/components/<component>/index.ts` (created or updated to export sub-component)
- [ ] `/packages/lumx-vue/src/index.ts` (export already exists for parent folder)

### Phase 2: Stories Migration
**Step 1: Core Stories**
- [ ] Analyze existing React stories for component dependencies
- [ ] Document any stories that cannot be migrated (missing core dependencies)
- [ ] `/packages/lumx-core/src/js/components/<Component>/Stories.ts` (created - NO JSX, data only)

**Step 2: React Stories**
- [ ] `/packages/lumx-react/src/components/<component>/<Component>.stories.tsx` (modified - all stories)
- [ ] Validation checkpoint 2a (developer validates all React stories)

**Step 3: First Vue Story**
- [ ] `/packages/lumx-vue/src/components/<component>/<Component>.stories.ts` (created - one story)
- [ ] `/packages/lumx-vue/src/components/<component>/Stories/<Component>Default.vue` (created)
- [ ] Validation checkpoint 2b (developer validates first Vue story)

**Step 4: Remaining Vue Stories**
- [ ] Complete all Vue stories in `<Component>.stories.ts`
- [ ] Create additional `.vue` templates if needed
- [ ] Validation checkpoint 2c (developer validates all Vue stories)

### Phase 3: Tests Migration
- [ ] `/packages/lumx-core/src/js/components/<Component>/Tests.ts` (created - NO JSX, plain data only)
- [ ] `/packages/lumx-react/src/components/<component>/<Component>.test.tsx` (modified)
- [ ] `/packages/lumx-vue/src/components/<component>/<Component>.test.ts` (created)

### Phase 4-6: Finalization
- [ ] Package exports verified
- [ ] `/CHANGELOG.md` (add entry under Unreleased)
- [ ] Final build verification completed

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
- [ ] All components in the family discovered
- [ ] Dependencies analyzed
- [ ] Migration order determined
- [ ] Blocking dependencies identified
- [ ] Developer approves migration plan

### After Phase 1 (UI Extraction - Per Component)
- [ ] `yarn test` passes
- [ ] `yarn type-check` passes
- [ ] React component still works (backward compatible)
- [ ] Vue component renders basic UI
- [ ] Developer validates UI implementation

### After Phase 2 (Stories)
**After Step 1 (Core Stories):**
- [ ] All component dependencies analyzed
- [ ] Stories with missing dependencies documented
- [ ] No JSX in core stories (data only)
- [ ] Core stories created successfully

**After Step 2 (React Stories - Checkpoint 2a):**
- [ ] All React stories implemented
- [ ] `yarn type-check` passes
- [ ] All React Storybook stories render correctly
- [ ] All variants and states display properly
- [ ] Developer validates React stories ✅

**After Step 3 (First Vue Story - Checkpoint 2b):**
- [ ] First Vue story implemented
- [ ] `yarn type-check` passes
- [ ] First Vue story renders correctly
- [ ] Developer validates first Vue story ✅

**After Step 4 (All Vue Stories - Checkpoint 2c):**
- [ ] All Vue stories implemented
- [ ] `yarn test` passes
- [ ] `yarn type-check` passes
- [ ] All Vue Storybook stories render correctly
- [ ] All variants and states display properly
- [ ] Developer validates all Vue stories ✅

### After Phase 3 (Tests)
- [ ] No JSX in core tests (plain data only)
- [ ] All core tests pass
- [ ] All React tests pass (including imported core tests)
- [ ] All Vue tests pass (including imported core tests)
- [ ] `yarn test` passes
- [ ] `yarn type-check` passes
- [ ] Developer validates test coverage

### Final Success Criteria
- [ ] All packages build successfully (`yarn build:core`, `yarn build:react`, `yarn build:vue`)
- [ ] React API is backward compatible
- [ ] CHANGELOG is updated
- [ ] No console errors in Storybook
