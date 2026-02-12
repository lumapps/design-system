# React Component Cheatsheet

Code templates and references for `@lumx/react` components.

## Component Template

```tsx
import React from 'react';
import { classNames } from '@lumx/core/js/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import type { GenericProps, LumxClassName } from '@lumx/core/js/types';

export interface MyComponentProps extends GenericProps {
    /** Component children. */
    children?: React.ReactNode;
}

const COMPONENT_NAME = 'MyComponent';
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-my-component';
const { block, element } = classNames.bem(CLASSNAME);

const DEFAULT_PROPS: Partial<MyComponentProps> = {};

export const MyComponent = forwardRef<MyComponentProps, HTMLDivElement>((props, ref) => {
    const { children, className, ...forwardedProps } = props;

    return (
        <div ref={ref} {...forwardedProps} className={classNames.join(className, block())}>
            {children}
        </div>
    );
});
MyComponent.displayName = COMPONENT_NAME;
MyComponent.className = CLASSNAME;
MyComponent.defaultProps = DEFAULT_PROPS;
```

## Component with Theme Support

```tsx
import React from 'react';
import { classNames } from '@lumx/core/js/utils';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import type { GenericProps, HasTheme, LumxClassName } from '@lumx/core/js/types';
import { Theme } from '@lumx/core/js/constants';

export interface MyComponentProps extends GenericProps, HasTheme {
    children?: React.ReactNode;
}

const COMPONENT_NAME = 'MyComponent';
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-my-component';
const { block } = classNames.bem(CLASSNAME);

const DEFAULT_PROPS: Partial<MyComponentProps> = {};

export const MyComponent = forwardRef<MyComponentProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { children, className, theme = defaultTheme, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(className, block({ [`theme-${theme}`]: Boolean(theme) }))}
        >
            {children}
        </div>
    );
});
MyComponent.displayName = COMPONENT_NAME;
MyComponent.className = CLASSNAME;
MyComponent.defaultProps = DEFAULT_PROPS;
```

## Shared Constants File Template (`constants.ts`)

For component families sharing a class name, enums, or configuration:

```typescript
import type { LumxClassName } from '@lumx/core/js/types';

// Shared component name and BEM base class
export const COMPONENT_NAME = 'MyComponent';
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-my-component';

// Domain-specific constants (if needed)
export const MyVariant = { option1: 'option1', option2: 'option2' } as const;
export type MyVariant = (typeof MyVariant)[keyof typeof MyVariant];
```

## Shared Types File Template (`types.ts`)

For component families sharing a props interface across variants:

```typescript
import type { GenericProps } from '@lumx/core/js/types';

export interface MyComponentProps extends GenericProps {
    /** Shared prop used by all variants. */
    value: string;
    /** Change handler. */
    onChange(value: string): void;
}
```

## Test Template

```tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { commonTestsSuiteRTL } from '@lumx/react/testing/utils/commonTestsSuiteRTL';
import { MyComponent, MyComponentProps } from './MyComponent';

const CLASSNAME = 'lumx-my-component';

const setup = (propsOverride: Partial<MyComponentProps> = {}) => {
    const props: MyComponentProps = { ...propsOverride };
    const { container } = render(<MyComponent {...props} />);
    const myComponent = container.querySelector(`.${CLASSNAME}`) as HTMLElement;
    return { props, container, myComponent };
};

describe('<MyComponent />', () => {
    // Standard test suite: checks base class, className forwarding,
    // attribute forwarding, ref forwarding, and theme support.
    commonTestsSuiteRTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'myComponent',
        forwardAttributes: 'myComponent',
        forwardRef: 'myComponent',
    });

    // Component-specific tests
    it('should render children', () => {
        const { myComponent } = setup({ children: 'Hello' });
        expect(myComponent).toHaveTextContent('Hello');
    });
});
```

## Stories Template

```tsx
import { MyComponent } from './MyComponent';

export default {
    title: 'LumX components/MyComponent',
    component: MyComponent,
};

export const Default = {
    args: {
        children: 'Example content',
    },
};
```

## Site Demo Documentation Templates

See `packages/site-demo/README.md` for `DemoBlock`/`PropTable` props and full conventions.

## Barrel Export (`index.ts`)

Single component:

```typescript
export * from './MyComponent';
```

Component family with selective exports:

```typescript
export type { InternalComponentProps } from './InternalComponent';
export * from './MyComponent';
export * from './MyComponentVariant';
```

## SCSS Template

```scss
.#{$lumx-base-prefix}-my-component {
    // Base styles

    // Modifiers (BEM --)
    &--color-#{$key} {
        // Color modifier
    }

    // Elements (BEM __)
    &__icon {
        // Sub-element styles
    }
}
```

## Shared Types Reference

| Type               | Import                | Purpose                                              |
| ------------------ | --------------------- | ---------------------------------------------------- |
| `GenericProps`     | `@lumx/core/js/types` | Base props: `className` + any HTML attribute         |
| `HasTheme`         | `@lumx/core/js/types` | Adds `theme?: Theme` prop                            |
| `HasDisabled`      | `@lumx/core/js/types` | Adds `disabled?: boolean; isDisabled?: boolean`      |
| `HasAriaDisabled`  | `@lumx/core/js/types` | Adds `aria-disabled?: boolean`                       |
| `HasPolymorphicAs` | `@lumx/core/js/types` | Adds `as` prop for polymorphic rendering             |
| `LumxClassName`    | `@lumx/core/js/types` | Type-safe BEM base class: `` `lumx-${kebab-case}` `` |

## Shared Constants Reference

| Constant       | Import                    | Values                                      |
| -------------- | ------------------------- | ------------------------------------------- |
| `Theme`        | `@lumx/core/js/constants` | `light`, `dark`                             |
| `Size`         | `@lumx/core/js/constants` | `xxs`, `xs`, `s`, `m`, `l`, `xl`, `xxl`     |
| `ColorPalette` | `@lumx/core/js/constants` | `primary`, `secondary`, `blue`, `red`, etc. |
| `Emphasis`     | `@lumx/core/js/constants` | `low`, `medium`, `high`                     |
| `Alignment`    | `@lumx/core/js/constants` | `left`, `center`, `right`                   |
| `Orientation`  | `@lumx/core/js/constants` | `horizontal`, `vertical`                    |

## Utility Hooks Reference

| Hook                          | Import                                            | Purpose                |
| ----------------------------- | ------------------------------------------------- | ---------------------- |
| `useTheme()`                  | `@lumx/react/utils/theme/ThemeContext`            | Get theme from context |
| `useDisableStateProps(props)` | `@lumx/react/utils/disabled/useDisableStateProps` | Resolve disabled state |
| `useId()`                     | `@lumx/react/hooks/useId`                         | Generate unique ID     |
| `useMergeRefs(...refs)`       | `@lumx/react/utils/react/mergeRefs`               | Merge multiple refs    |
| `useBooleanState(initial)`    | `@lumx/react/hooks/useBooleanState`               | Boolean toggle state   |
| `useFocusTrap(ref, active)`   | `@lumx/react/hooks/useFocusTrap`                  | Trap focus in element  |

## BEM Class Utility

```typescript
import { classNames } from '@lumx/core/js/utils';

const CLASSNAME = 'lumx-my-component';
const { block, element } = classNames.bem(CLASSNAME);

block(); // => 'lumx-my-component'
block({ active: true }); // => 'lumx-my-component lumx-my-component--active'
block({ 'color-primary': true }); // => 'lumx-my-component lumx-my-component--color-primary'
element('icon'); // => 'lumx-my-component__icon'
element('icon', { visible: true }); // => 'lumx-my-component__icon lumx-my-component__icon--visible'
classNames.join(className, block()); // => merges user className with BEM class
```
