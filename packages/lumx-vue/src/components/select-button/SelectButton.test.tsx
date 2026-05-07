import { defineComponent, ref } from 'vue';
import { render, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectTypeOf } from 'vitest';

import selectButtonTests from '@lumx/core/js/components/SelectButton/Tests';
import { SelectButton, type SingleSelectButtonProps, type MultipleSelectButtonProps } from '.';
import { Combobox } from '../combobox';

interface Fruit {
    id: string;
    name: string;
    category?: string;
}

const FRUITS: Fruit[] = [
    { id: 'apple', name: 'Apple', category: 'Pome' },
    { id: 'banana', name: 'Banana', category: 'Tropical' },
    { id: 'cherry', name: 'Cherry', category: 'Stone' },
];

/**
 * Render a SelectButton template with controlled state management for Vue.
 * Manages a `value` state and wires it through the `onChange` prop.
 *
 * The `template` function is a JSX function (from the core tests) that receives
 * `{ value, onChange, ... }` and returns a VNode. We wrap it in a Vue component
 * that manages the reactive state.
 */
function renderWithState(template: (props: any) => any, initialArgs: Record<string, any> = {}) {
    const Wrapper = defineComponent({
        setup() {
            const value = ref(initialArgs.value ?? undefined);
            return () => {
                const props = {
                    ...initialArgs,
                    value: value.value,
                    onChange: (v: any) => {
                        value.value = v;
                        initialArgs.onChange?.(v);
                    },
                };
                return template(props);
            };
        },
    });

    const result = render(Wrapper);
    return { ...result, container: result.container as unknown as HTMLElement };
}

/** Get the SelectButton trigger from the rendered output. */
function getButton(): HTMLButtonElement {
    return document.body.querySelector<HTMLButtonElement>('[role="combobox"]')!;
}

describe('<SelectButton>', () => {
    selectButtonTests({
        components: { SelectButton, Combobox },
        renderWithState,
    });

    describe('Vue', () => {
        // ─── #button scoped slot ─────────────────────────────────

        it('should invoke the #button slot with buttonProps, label, and children', async () => {
            const slotSpy = vi.fn((slotProps: any) => {
                // Return a simple button so the combobox can wire up event listeners
                return [<button {...slotProps.buttonProps}>{slotProps.children}</button>];
            });

            render(SelectButton, {
                props: {
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                },
                slots: { button: slotSpy },
            });

            expect(slotSpy).toHaveBeenCalled();
            const slotProps = slotSpy.mock.calls[0][0];
            expect(slotProps).toHaveProperty('buttonProps');
            expect(slotProps.buttonProps).toHaveProperty('role', 'combobox');
            expect(slotProps).toHaveProperty('label', 'Select a fruit');
            // Default labelDisplayMode is 'show-selection'; no value selected → children fall back to label
            expect(slotProps).toHaveProperty('children', 'Select a fruit');
        });

        it('should set children to null when labelDisplayMode is "show-tooltip"', () => {
            const slotSpy = vi.fn((slotProps: any) => [<button {...slotProps.buttonProps} />]);

            render(SelectButton, {
                props: {
                    label: 'Pick one',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    labelDisplayMode: 'show-tooltip',
                },
                slots: { button: slotSpy },
            });

            const slotProps = slotSpy.mock.calls[0][0];
            expect(slotProps.children).toBeNull();
        });

        it('should place combobox ARIA attributes on the #button slot root', async () => {
            render(SelectButton, {
                props: {
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                },
                slots: {
                    button: (slotProps: any) => [<div data-testid="custom-trigger" {...slotProps.buttonProps} />],
                },
            });

            const trigger = document.body.querySelector('[data-testid="custom-trigger"]')!;
            expect(trigger).toBeInTheDocument();
            expect(trigger).toHaveAttribute('role', 'combobox');
            expect(trigger).toHaveAttribute('aria-haspopup', 'listbox');
            expect(trigger).toHaveAttribute('aria-expanded');
            expect(trigger).toHaveAttribute('aria-controls');
        });

        it('should open the dropdown when the #button slot root is clicked', async () => {
            render(SelectButton, {
                props: {
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                },
                slots: {
                    button: (slotProps: any) => [<button data-testid="custom-trigger" {...slotProps.buttonProps} />],
                },
            });

            const user = userEvent.setup();
            const trigger = document.body.querySelector<HTMLElement>('[data-testid="custom-trigger"]')!;
            await user.click(trigger);

            await waitFor(() => {
                expect(document.body.querySelector('[role="listbox"]')).toBeInTheDocument();
            });
        });

        it('should emit "change" when selecting an option via the #button slot', async () => {
            const { emitted } = render(SelectButton, {
                props: {
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                },
                slots: {
                    button: (slotProps: any) => [<button data-testid="custom-trigger" {...slotProps.buttonProps} />],
                },
            });

            const user = userEvent.setup();
            await user.click(document.body.querySelector('[data-testid="custom-trigger"]')!);
            const option = await waitFor(() => {
                const el = document.body.querySelector<HTMLElement>('[role="option"][data-value="cherry"]');
                if (!el) throw new Error('option not found');
                return el;
            });
            await user.click(option);

            const changes = emitted('change') as any[][];
            expect(changes).toBeTruthy();
            expect(changes.at(-1)![0]).toEqual(FRUITS[2]);
        });

        it('should not apply the default rightIcon when the #button slot is provided', () => {
            // The default rightIcon (mdiMenuDown) is added by the Vue wrapper only when no #button
            // slot is provided. When a custom slot is used, rightIcon should not appear in slot props.
            const slotSpy = vi.fn((slotProps: any) => [<button {...slotProps.buttonProps} />]);

            render(SelectButton, {
                props: {
                    label: 'Select',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                },
                slots: { button: slotSpy },
            });

            const slotProps = slotSpy.mock.calls[0][0];
            expect(slotProps.buttonProps).not.toHaveProperty('rightIcon');
        });

        // ─── Emits ──────────────────────────────────────────────

        it('should emit "change" when an option is selected', async () => {
            const { emitted } = render(SelectButton, {
                props: {
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                },
            });
            const user = userEvent.setup();
            await user.click(getButton());
            const option = await waitFor(() => {
                const el = document.body.querySelector<HTMLElement>('[role="option"][data-value="banana"]');
                if (!el) throw new Error('option not found');
                return el;
            });
            await user.click(option);

            const changes = emitted('change') as any[][];
            expect(changes).toBeTruthy();
            expect(changes.at(-1)![0]).toEqual(FRUITS[1]);
        });

        it('should emit "open" when dropdown opens', async () => {
            const { emitted } = render(SelectButton, {
                props: {
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                },
            });
            const user = userEvent.setup();
            await user.click(getButton());

            await waitFor(() => {
                const opens = (emitted('open') as boolean[][]) || [];
                expect(opens.length).toBeGreaterThan(0);
                expect(opens.at(-1)![0]).toBe(true);
            });
        });

        // ─── Infinite scroll sentinel detection ─────────────────

        it('should not render the infinite scroll sentinel when no load-more listener is attached', async () => {
            render(SelectButton, {
                props: {
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                },
            });
            const user = userEvent.setup();
            await user.click(getButton());
            await waitFor(() => {
                expect(document.body.querySelector('[role="listbox"]')).toBeInTheDocument();
            });
            expect(document.body.querySelector('.lumx-infinite-scroll-anchor')).toBeNull();
        });

        it('should render the infinite scroll sentinel when a load-more listener is attached', async () => {
            const onLoadMore = vi.fn();
            render(SelectButton, {
                props: {
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    'onLoad-more': onLoadMore,
                },
            });
            const user = userEvent.setup();
            await user.click(getButton());
            await waitFor(() => {
                expect(document.body.querySelector('[role="listbox"]')).toBeInTheDocument();
            });
            expect(document.body.querySelector('.lumx-infinite-scroll-anchor')).toBeInTheDocument();
        });

        /*
         * Compile-time assertions on the exported prop types. Enforced by `vue-tsc`
         * during `yarn type-check`; no runtime effect. We assert prop shapes rather
         * than render JSX because constructor overloads don't resolve `EmitsToProps`
         * handlers in TSX call sites — `@change` / `$emit('change', …)` are the
         * supported consumer surfaces (covered at runtime above).
         */
        describe('Types', () => {
            interface TypedFruit extends Fruit {
                weight: number;
            }
            const FRUIT: TypedFruit = { id: 'a', name: 'A', weight: 1 };

            type SingleProps = SingleSelectButtonProps<TypedFruit>;
            type MultipleProps = MultipleSelectButtonProps<TypedFruit>;

            /*
             * Split the constructor overloads into a discriminable union, then pick the
             * branch matching `selectionType`. Single mode: `selectionType` is optional
             * (default), so we match the branch that allows `undefined` via Exclude.
             * `InstanceType` collapses to the last overload and loses per-branch payload narrowing.
             */
            type Overloads<T> = T extends {
                new (props: infer P1): infer R1;
                new (props: infer P2): infer R2;
            }
                ? { props: P1; instance: R1 } | { props: P2; instance: R2 }
                : never;
            type SingleEmit = Exclude<
                Overloads<typeof SelectButton<TypedFruit>>,
                { props: { selectionType: 'multiple' } }
            >['instance']['$emit'];
            type MultipleEmit = Extract<
                Overloads<typeof SelectButton<TypedFruit>>,
                { props: { selectionType: 'multiple' } }
            >['instance']['$emit'];

            it('flows the generic <O> through props', () => {
                expectTypeOf<SingleProps['options']>().toEqualTypeOf<TypedFruit[] | undefined>();
                expectTypeOf<SingleProps['value']>().toEqualTypeOf<TypedFruit | undefined>();
                expectTypeOf<MultipleProps['value']>().toEqualTypeOf<TypedFruit[] | undefined>();

                // Selector functions.
                expectTypeOf<(o: TypedFruit) => string>().toMatchTypeOf<SingleProps['getOptionId']>();
                expectTypeOf<(o: TypedFruit) => string | undefined>().toMatchTypeOf<SingleProps['getOptionName']>();

                // Selector key shorthand: only string-valued keys allowed.
                expectTypeOf<'id'>().toMatchTypeOf<SingleProps['getOptionId']>();
                expectTypeOf<'name'>().toMatchTypeOf<SingleProps['getOptionId']>();
                expectTypeOf<'weight'>().not.toMatchTypeOf<SingleProps['getOptionId']>(); // numeric
                expectTypeOf<'missing'>().not.toMatchTypeOf<SingleProps['getOptionId']>(); // unknown
            });

            it('makes selectionType optional on the single branch (default = single)', () => {
                expectTypeOf<SingleProps['selectionType']>().toEqualTypeOf<'single' | undefined>();
                expectTypeOf<MultipleProps['selectionType']>().toEqualTypeOf<'multiple'>();
            });

            it('narrows the change payload per selectionType', () => {
                expectTypeOf<SingleEmit>().toBeCallableWith('change', FRUIT);
                expectTypeOf<SingleEmit>().toBeCallableWith('change', undefined);
                expectTypeOf<MultipleEmit>().toBeCallableWith('change', [FRUIT]);
                expectTypeOf<MultipleEmit>().toBeCallableWith('change', undefined);
            });

            it('types common event payloads on $emit', () => {
                expectTypeOf<SingleEmit>().toBeCallableWith('open', true);
                expectTypeOf<SingleEmit>().toBeCallableWith('load-more');
            });
        });
    });
});
