import React from 'react';
import { render, screen } from '@testing-library/react';
import { expectTypeOf } from 'vitest';

import selectButtonTests from '@lumx/core/js/components/SelectButton/Tests';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { SelectButton, type SelectButtonProps, type SingleSelectButtonProps, type MultipleSelectButtonProps } from '.';
import { Combobox } from '../combobox';
import { IconButton } from '../button';
import { Chip } from '../chip';
import { Link } from '../link';

/**
 * Setup a basic SelectButton
 */
function setup(props: Partial<SelectButtonProps<string>> = {}, options: SetupRenderOptions = {}) {
    render(<SelectButton label="Select a fruit" options={[]} getOptionId={String} {...props} />, options);
    return { button: screen.getByRole('combobox') };
}

/**
 * Render a SelectButton template with controlled state management.
 * Manages a `value` state and wires it through the `onChange` prop.
 *
 * @param template    JSX render function receiving `{ value, onChange, ... }`.
 * @param initialArgs Initial props (value, spies, etc.).
 */
function renderWithState(template: (props: any) => React.JSX.Element, initialArgs: Record<string, any> = {}) {
    const Wrapper = () => {
        const [value, setValue] = React.useState(initialArgs.value ?? undefined);
        const props = {
            ...initialArgs,
            value,
            onChange: (v: any) => {
                setValue(v);
                initialArgs.onChange?.(v);
            },
        };
        return template(props);
    };
    return render(<Wrapper />);
}

describe('<SelectButton>', () => {
    selectButtonTests({
        components: { SelectButton, Combobox },
        renderWithState,
    });

    /*** Type-level tests for the public component API */
    describe('type API', () => {
        type Fruit = { id: string; name: string; weight: number };
        const aFruit = { id: '1', name: 'Apple', weight: 50 } as const;

        it('infers <O> from options and flows it into value/onChange (single branch)', () => {
            type Props = SingleSelectButtonProps<Fruit>;

            // Option-typed props
            expectTypeOf<Props['options']>().toEqualTypeOf<Fruit[] | undefined>();
            expectTypeOf<Props['value']>().toEqualTypeOf<Fruit | undefined>();
            expectTypeOf<Props['onChange']>().toEqualTypeOf<((newValue?: Fruit) => void) | undefined>();

            // Selector functions on Fruit
            expectTypeOf<(o: Fruit) => string>().toExtend<Props['getOptionId']>();
            expectTypeOf<(o: Fruit) => string | undefined>().toExtend<Props['getOptionName']>();

            // Selector key shorthand: only string-valued keys allowed.
            expectTypeOf<'id'>().toExtend<Props['getOptionId']>();
            expectTypeOf<'name'>().toExtend<Props['getOptionId']>();
            expectTypeOf<'weight'>().not.toExtend<Props['getOptionId']>(); // numeric
            expectTypeOf<'missing'>().not.toExtend<Props['getOptionId']>(); // unknown

            // renderOption takes Fruit
            expectTypeOf<(o: Fruit, i: number) => React.ReactNode>().toExtend<Props['renderOption']>();
        });

        it('flows <O> into the multiple branch as O[]', () => {
            type Props = MultipleSelectButtonProps<Fruit>;

            expectTypeOf<Props['value']>().toEqualTypeOf<Fruit[] | undefined>();
            expectTypeOf<Props['onChange']>().toEqualTypeOf<((newValue?: Fruit[]) => void) | undefined>();
            // `selectionType` is the inference site for `S` and is therefore
            // optional at the type level. Runtime still requires `'multiple'`
            // to opt into multi-select.
            expectTypeOf<Props['selectionType']>().toEqualTypeOf<'multiple' | undefined>();
        });

        it('makes selectionType optional on the union (default = single)', () => {
            // Union exposes the discriminator as an optional 'single' | 'multiple'.
            // Existing single-mode consumers do not need to set it.
            const singleProps = {
                label: 'Pick',
                options: [] as Fruit[],
                getOptionId: 'id',
                value: aFruit,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onChange: (newValue?: Fruit) => undefined,
            } as const;
            expectTypeOf(singleProps).toExtend<SelectButtonProps<Fruit>>();

            const multiProps = {
                label: 'Pick',
                options: [] as Fruit[],
                getOptionId: 'id' as const,
                selectionType: 'multiple' as const,
                value: [aFruit] as Fruit[],
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onChange: (newValue?: Fruit[]) => undefined,
            };
            // For multi-select, use the dedicated alias (which sets `S='multiple'`).
            expectTypeOf(multiProps).toExtend<MultipleSelectButtonProps<Fruit>>();
        });

        it('exposes LumX ButtonProps on the default trigger (no `as`)', () => {
            // All these LumX Button props must be accepted on the default trigger.
            const buttonOnlyProps = {
                label: 'Pick',
                options: [] as Fruit[],
                getOptionId: 'id',
                emphasis: 'high',
                size: 'm',
                value: aFruit,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onChange: (newValue?: Fruit) => undefined,
            } as const;
            expectTypeOf(buttonOnlyProps).toExtend<SelectButtonProps<Fruit>>();
        });

        it('exposes IconButton-specific props when as={IconButton}', () => {
            // IconButton's `icon` and `hideTooltip` must be accepted when as={IconButton}.
            const iconProps = {
                label: 'Pick',
                options: [] as Fruit[],
                getOptionId: 'id',
                as: IconButton,
                icon: 'mdi-apple',
                value: aFruit,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onChange: (newValue?: Fruit) => undefined,
            } as const;
            expectTypeOf(iconProps).toExtend<SelectButtonProps<Fruit, typeof IconButton>>();
        });

        it('exposes Chip slots (after/before) when as={Chip}', () => {
            const chipProps = {
                label: 'Pick',
                options: [] as Fruit[],
                getOptionId: 'id',
                as: Chip,
                isClickable: true,
                size: 's',
                value: aFruit,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onChange: (newValue?: Fruit) => undefined,
            } as const;
            expectTypeOf(chipProps).toExtend<SelectButtonProps<Fruit, typeof Chip>>();
        });

        it('accepts Link with `rightIcon` when as={Link}', () => {
            const linkProps = {
                label: 'Pick',
                options: [] as Fruit[],
                getOptionId: 'id',
                as: Link,
                rightIcon: 'mdi-down',
                value: aFruit,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                onChange: (newValue?: Fruit) => undefined,
            } as const;
            expectTypeOf(linkProps).toExtend<SelectButtonProps<Fruit, typeof Link>>();
        });
    });

    // Common tests suite (classes, refs and attributes forwarding)
    commonTestsSuiteRTL(setup, {
        baseClassName: 'lumx-combobox-button',
        forwardRef: 'button',
        forwardClassName: 'button',
        forwardAttributes: 'button',
    });
});
