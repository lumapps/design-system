# Component Migration Cheatsheet

Quick reference for migrating components to core architecture.

## Quick Command

```bash
/migrate-component <ComponentName>
```

## File Mapping

### Input (React only)

```
packages/lumx-react/src/components/<component>/
├── <Component>.tsx
├── <Component>.test.tsx
└── <Component>.stories.tsx
```

### Output (Core + React + Vue)

```
packages/lumx-core/src/js/components/<Component>/
├── index.tsx        # Core UI logic
├── Tests.ts         # Core test suite
└── Stories.tsx      # Story configurations with JSX renders

packages/lumx-react/src/components/<component>/
├── <Component>.tsx          # Thin wrapper (modified)
├── <Component>.test.tsx     # Framework tests (modified)
└── <Component>.stories.tsx  # Thin story wrapper (modified)

packages/lumx-vue/src/components/<component>/
├── <Component>.tsx          # Vue wrapper (new)
├── <Component>.test.ts      # Vue tests (new)
├── <Component>.stories.tsx  # Thin story wrapper (new)
└── index.ts                 # Exports (new)
```

## Key Code Transformations

### React → Core Props

```typescript
// BEFORE (React)
export interface SwitchProps {
    children?: React.ReactNode; // ← React-specific
    helper?: string;
    // ...
}

// AFTER (Core)
export interface SwitchProps {
    label?: JSXElement; // ← Framework-agnostic
    inputId: string; // ← Required (wrappers generate)
    helper?: string;
    // ...
}
```

### React → Core Rendering

```typescript
// BEFORE (React)
return (
    <div>
        <InputLabel htmlFor={inputId}>
            {children}
        </InputLabel>
    </div>
);

// AFTER (Core)
return (
    <div>
        {label && InputLabel({ htmlFor: inputId, children: label })}
    </div>
);
```

### React Wrapper Pattern

```typescript
// React wrapper calls core UI
import { Component as UI } from '@lumx/core/js/components/Component';

export const Component = forwardRef<Props, HTMLDivElement>((props, ref) => {
    const inputId = id || useId();

    return UI({
        ref,
        label: children, // Map children → label
        inputId, // Pass generated ID
        // ... other props
    });
});
```

### Vue Wrapper Pattern

```typescript
// Vue wrapper with JSX
const Component = defineComponent(
    (props, { emit, slots }) => {
        const inputId = computed(() => props.id || useId());

        const handleChange = (...args) => {
            event.stopImmediatePropagation();  // ← Important!
            emit('change', ...args);
        };

        return () => (
            <ComponentUI
                inputId={inputId.value}
                label={(props.label || slots.default?.()) as JSXElement}
                onChange={handleChange}
                {...props}
            />
        );
    },
    {
        name: 'LumxComponent',  // ← Prefix with 'Lumx'
        inheritAttrs: false,
        props: keysOf<Props>()('prop1', 'prop2', ...),
        emits: { change: (...args) => validation },
    }
);
```

## Common Props Mappings

| React            | Core        | Notes           |
| ---------------- | ----------- | --------------- |
| `children`       | `label`     | JSXElement type |
| `id` (generated) | `inputId`   | Required prop   |
| `ref`            | `ref`       | Same            |
| `className`      | `className` | Same            |
| `theme`          | `theme`     | Same            |
| `onChange`       | `onChange`  | Same signature  |

## Test File Templates

### Core Tests Export

```typescript
export const setup = (props = {}, { render, ...options }) => {
    const finalProps = { inputId: 'fixedId', ...props };
    render(finalProps, options);

    return {
        wrapper: getByClassName(document.body, CLASSNAME),
        input: getByTagName(wrapper, 'input'),
        // ... other elements
        props: finalProps,
    };
};

export default (renderOptions) => {
    describe('Props', () => {
        /* tests */
    });
    describe('Events', () => {
        /* tests */
    });
};
```

### React Tests Import

```typescript
import BaseTests, { setup } from '@lumx/core/js/components/Component/Tests';

describe('<Component>', () => {
    const renderComponent = (props, options) => {
        const { inputId, label, ...rest } = props;
        return render(<Component id={inputId} {...rest}>{label}</Component>);
    };

    BaseTests({ render: renderComponent, screen });

    describe('React-specific', () => {
        it('should forward ref', () => { /* ... */ });
    });
});
```

### Vue Tests Import

```typescript
import BaseTests, { setup } from '@lumx/core/js/components/Component/Tests';

describe('<Component />', () => {
    const renderComponent = (props, options) =>
        render(Component, { props: { ...props, id: props.inputId }, ...options });

    BaseTests({ render: renderComponent, screen });

    describe('Vue-specific', () => {
        it('should emit events', () => {
            /* ... */
        });
    });
});
```

## Story Templates

### Core Stories (`Stories.tsx`)

Core stories use JSX with framework components injected via `components` parameter.
The same JSX works for both React and Vue because each framework's build compiles it.

**KEY RULES:**

-   **NEVER put JSX in `args`** — all JSX must live in `render` functions
-   **NEVER put JSX in `withCombinations` rows/sections/cols** — these are merged into args
-   **Define each story as an individual `const`** — enables cross-referencing renders
-   **Only serializable data in `args`** — strings, numbers, booleans, enums, objects
-   **ALWAYS destructure `children` in render functions** — when a render provides its own inline JSX children, destructure `children` out of args to prevent it leaking via `{...args}` as a DOM prop (causes Vue warnings)

```tsx
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { mdiHeart } from '@lumx/icons';
import { DEFAULT_PROPS } from '.';

export function setup({
    component: Badge,
    components: { Icon, FlexBox },
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
    components: { Icon: any; FlexBox: any };
}>) {
    const meta = {
        component: Badge,
        render: (args: any) => <Badge {...args} />,
        argTypes: {
            /* ... */
        },
        args: DEFAULT_PROPS,
    };

    /** Default with text — JSX in render, NOT args */
    const WithText = {
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

    /** Disabled — only serializable data in args, no JSX */
    const Disabled = {
        args: { isDisabled: true },
        decorators: [
            withCombinations({
                combinations: {
                    rows: {
                        disabled: { isDisabled: true },
                        'aria-disabled': { 'aria-disabled': true },
                    },
                },
            }),
        ],
    };

    /** Composite story — references other stories' renders */
    const AllVariants = {
        render: (args: any) => (
            <FlexBox orientation="vertical" gap="regular">
                {WithText.render(args)}
                {WithIcon.render(args)}
            </FlexBox>
        ),
    };

    return { meta, WithText, WithIcon, Disabled, AllVariants };
}
```

### React Stories (thin wrapper)

```tsx
import { Badge, FlexBox, Icon } from '@lumx/react';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Badge/Stories';

const { meta, ...stories } = setup({
    component: Badge,
    components: { Icon, FlexBox },
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/badge/Badge',
    ...meta,
};

export const WithText = { ...stories.WithText };
export const WithIcon = { ...stories.WithIcon };
export const Disabled = { ...stories.Disabled };
export const AllVariants = { ...stories.AllVariants };
```

### Vue Stories (thin wrapper — identical structure to React)

```tsx
import { Badge, FlexBox, Icon } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/Badge/Stories';

const { meta, ...stories } = setup({
    component: Badge,
    components: { Icon, FlexBox },
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/badge/Badge',
    ...meta,
};

export const WithText = { ...stories.WithText };
export const WithIcon = { ...stories.WithIcon };
export const Disabled = { ...stories.Disabled };
export const AllVariants = { ...stories.AllVariants };
```

### Vue Stories with slot mapping (when Vue component uses slots)

When the core stories pass slot-like content via the meta `render` or args, and the Vue component uses slots instead of props, provide a `render` override:

```tsx
import { Toolbar, Icon } from '@lumx/vue';
import { setup } from '@lumx/core/js/components/Toolbar/Stories';

const { meta, ...stories } = setup({
    component: Toolbar,
    components: { Icon },
    // Map props to Vue named slots
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

export default {
    title: 'LumX components/toolbar/Toolbar',
    ...meta,
};

export const Default = { ...stories.Default };
export const WithBefore = { ...stories.WithBefore };
export const WithAfter = { ...stories.WithAfter };
export const WithAll = { ...stories.WithAll };
```

## Verification Commands

```bash
# Test each package
yarn test packages/lumx-core/src/js/components/<Component>
yarn test packages/lumx-react/src/components/<component>
yarn test packages/lumx-vue/src/components/<component>

# Build each package
yarn build:core
yarn build:react
yarn build:vue

# Visual check
yarn storybook
```

## CHANGELOG Template

```markdown
## [Unreleased]

### Added

-   `@lumx/vue`:
    -   Create the `<Component>` component

### Changed

-   `@lumx/core`:
    -   Moved `<Component>` from `@lumx/react`
```

## Time Estimates

-   **Simple component** (like Switch): 1-2 hours
-   **Complex component** (with many variants): 3-4 hours
-   **Component with special logic**: 4-6 hours

## Reference Components

-   **Badge** - Best reference for the **new stories pattern** (`const` variables, no JSX in args, story render composition, `FlexBox` for layout)
-   **Toolbar** - Best reference for components with **slot-like props** (each story self-contains its JSX, Vue provides `render` override for slot mapping)
-   **Link** - Good reference for stories with `const` pattern, render reuse, and `withCombinations`
-   **Text** - Good reference for sharing `render` across stories (`WithIcon.render` reused by `AllTypography` and `AllColors`)
-   **Checkbox** - Complete example with intermediate state
-   **Switch** - Recently migrated binary component
-   **Button** - Event handling with stopImmediatePropagation
-   **Message** - Simple component migration
-   **Flag** - Component with variants
