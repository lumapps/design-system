import { defineComponent, ref, nextTick } from 'vue';
import { fireEvent, render, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { expectTypeOf } from 'vitest';

import selectTextFieldTests, { TRANSLATIONS, MULTI_TRANSLATIONS } from '@lumx/core/js/components/SelectTextField/Tests';
import { SelectTextField, type SingleSelectTextFieldProps, type MultipleSelectTextFieldProps } from '.';
import { Combobox } from '../combobox';
import { Chip } from '../chip';

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
 * Render a SelectTextField template with controlled state management for Vue.
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

/** Get the combobox input from the rendered output. */
function getInput(): HTMLInputElement {
    return document.body.querySelector<HTMLInputElement>('[role="combobox"]')!;
}

describe('<SelectTextField>', () => {
    selectTextFieldTests({
        components: { SelectTextField, Combobox },
        renderWithState,
    });

    describe('Vue', () => {
        // ─── Emits ──────────────────────────────────────────────

        it('should emit "change" when an option is selected', async () => {
            const { emitted } = render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    translations: TRANSLATIONS,
                },
            });
            const user = userEvent.setup();
            await user.click(getInput());
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

        it('should emit "search" when typing in the input', async () => {
            const { emitted } = render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'manual',
                    translations: TRANSLATIONS,
                },
            });
            const user = userEvent.setup();
            await user.click(getInput());
            await user.keyboard('app');

            const events = emitted('search') as string[][];
            expect(events).toBeTruthy();
            // Final search emission should equal the typed string.
            expect(events.at(-1)![0]).toBe('app');
        });

        it('should emit "clear" when clear button is clicked', async () => {
            const { emitted } = render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    value: FRUITS[0],
                    translations: TRANSLATIONS,
                },
            });
            const clearButton = await waitFor(() => {
                const el = document.body.querySelector<HTMLElement>(
                    'button[aria-label="Clear"], .lumx-text-field__input-clear',
                );
                if (!el) throw new Error('clear button not found');
                return el;
            });
            await fireEvent.click(clearButton);

            expect(emitted('clear')).toBeTruthy();
            const changes = emitted('change') as any[][];
            expect(changes.at(-1)![0]).toBeUndefined();
        });

        it('should emit "open" when dropdown opens and closes', async () => {
            const { emitted } = render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    translations: TRANSLATIONS,
                },
            });
            const user = userEvent.setup();
            await user.click(getInput());

            await waitFor(() => {
                const opens = (emitted('open') as boolean[][]) || [];
                expect(opens.length).toBeGreaterThan(0);
                expect(opens.at(-1)![0]).toBe(true);
            });
        });

        it('should emit "load-more" only when a listener is attached (infinite scroll sentinel)', async () => {
            // No load-more listener: sentinel must not be rendered.
            render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    translations: TRANSLATIONS,
                },
            });
            const user = userEvent.setup();
            await user.click(getInput());
            await waitFor(() => {
                expect(document.body.querySelector('[role="listbox"]')).toBeInTheDocument();
            });
            expect(document.body.querySelector('.lumx-infinite-scroll-anchor')).toBeNull();
        });

        it('should render the infinite scroll sentinel when a load-more listener is attached', async () => {
            const onLoadMore = vi.fn();
            // With a load-more listener: sentinel should be present.
            render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    translations: TRANSLATIONS,
                    'onLoad-more': onLoadMore,
                },
            });
            const user = userEvent.setup();
            await user.click(getInput());
            await waitFor(() => {
                expect(document.body.querySelector('[role="listbox"]')).toBeInTheDocument();
            });
            expect(document.body.querySelector('.lumx-infinite-scroll-anchor')).toBeInTheDocument();
        });

        // ─── Controlled searchInputValue ─────────────────────────

        it('should seed the input with searchInputValue on first render', async () => {
            render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'manual',
                    searchInputValue: 'app',
                    translations: TRANSLATIONS,
                },
            });
            expect(getInput().value).toBe('app');
        });

        it('should react to a parent changing searchInputValue', async () => {
            const search = ref('');
            const Wrapper = defineComponent({
                setup: () => () => (
                    <SelectTextField
                        selectionType="single"
                        label="Select a fruit"
                        options={FRUITS}
                        getOptionId="id"
                        getOptionName="name"
                        filter="manual"
                        searchInputValue={search.value}
                        translations={TRANSLATIONS}
                    />
                ),
            });
            render(Wrapper);
            expect(getInput().value).toBe('');

            search.value = 'cher';
            await nextTick();
            expect(getInput().value).toBe('cher');
        });

        // ─── Scoped slots ────────────────────────────────────────

        it('should render the `option` scoped slot for each option', async () => {
            render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    translations: TRANSLATIONS,
                },
                slots: {
                    // Slot must render a Combobox.Option to integrate with combobox handle.
                    option: ({ option }: any) => (
                        <Combobox.Option value={option.id} key={option.id}>
                            Custom: {option.name}
                        </Combobox.Option>
                    ),
                },
            });
            const user = userEvent.setup();
            await user.click(getInput());
            await waitFor(() => {
                expect(document.body.querySelector('[role="option"][data-value="apple"]')).toBeInTheDocument();
            });
            const optionEl = document.body.querySelector('[role="option"][data-value="apple"]');
            expect(optionEl?.textContent).toContain('Custom: Apple');
        });

        it('should merge `option` slot props with core-computed Combobox.Option props', async () => {
            render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    translations: TRANSLATIONS,
                },
                slots: {
                    // Slot returns a <Combobox.Option> with an extra `data-test` attr and isDisabled.
                    option: ({ option }: any) => (
                        <Combobox.Option value={option.id} key={option.id} isDisabled data-test={`opt-${option.id}`}>
                            Custom: {option.name}
                        </Combobox.Option>
                    ),
                },
            });
            const user = userEvent.setup();
            await user.click(getInput());
            await waitFor(() => {
                expect(document.body.querySelector('[role="option"][data-value="apple"]')).toBeInTheDocument();
            });
            // Custom content is rendered.
            const appleOption = document.body.querySelector('[role="option"][data-value="apple"]');
            expect(appleOption?.textContent).toContain('Custom: Apple');
            // Slot-provided `isDisabled` is applied (aria-disabled="true").
            expect(appleOption).toHaveAttribute('aria-disabled', 'true');
            // Core-computed `data-value` and `role` are still present (not clobbered).
            expect(appleOption).toHaveAttribute('data-value', 'apple');
            expect(appleOption).toHaveAttribute('role', 'option');
        });

        it('should pass before/after slots from the `option` slot to the rendered Combobox.Option', async () => {
            render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    translations: TRANSLATIONS,
                },
                slots: {
                    option: ({ option }: any) => (
                        <Combobox.Option value={option.id} key={option.id}>
                            {{
                                default: () => `Custom: ${option.name}`,
                                before: () => <span data-test={`before-${option.id}`}>★</span>,
                            }}
                        </Combobox.Option>
                    ),
                },
            });
            const user = userEvent.setup();
            await user.click(getInput());
            await waitFor(() => {
                expect(document.body.querySelector('[role="option"][data-value="apple"]')).toBeInTheDocument();
            });
            // `before` named slot content appears inside the option.
            expect(document.body.querySelector('[data-test="before-apple"]')).toBeInTheDocument();
        });

        it('should render the `option` slot VNodes as-is when no Combobox.Option is returned', async () => {
            render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    translations: TRANSLATIONS,
                },
                slots: {
                    // Plain element — no Combobox.Option wrapping.
                    option: ({ option }: any) => <div data-test={`raw-${option.id}`}>{option.name}</div>,
                },
            });
            const user = userEvent.setup();
            await user.click(getInput());
            await waitFor(() => {
                expect(document.body.querySelector('[data-test="raw-apple"]')).toBeInTheDocument();
            });
            // The raw div is present but NOT wrapped in a [role="option"] element.
            const rawEl = document.body.querySelector('[data-test="raw-apple"]');
            expect(rawEl?.closest('[role="option"]')).toBeNull();
        });

        it('should render the `sectionTitle` scoped slot for each section', async () => {
            render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    getSectionId: 'category',
                    filter: 'auto',
                    translations: TRANSLATIONS,
                },
                slots: {
                    sectionTitle: ({ sectionId }: any) => <span data-test="section">Section: {sectionId}</span>,
                },
            });
            const user = userEvent.setup();
            await user.click(getInput());
            await waitFor(() => {
                expect(document.body.querySelector('[data-test="section"]')).toBeInTheDocument();
            });
            const titles = Array.from(document.body.querySelectorAll('[data-test="section"]')).map(
                (el) => el.textContent,
            );
            expect(titles).toEqual(expect.arrayContaining(['Section: Pome', 'Section: Tropical', 'Section: Stone']));
        });

        it('should render the `chip` scoped slot for selected values (multiple mode)', async () => {
            render(SelectTextField, {
                props: {
                    selectionType: 'multiple',
                    label: 'Select fruits',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    value: [FRUITS[0]],
                    translations: MULTI_TRANSLATIONS,
                },
                slots: {
                    // The chip slot must return a `Chip` component. SelectionChipGroup extracts
                    // the Chip's props/`before` slot and forwards them; the main label still comes
                    // from `getOptionName`. We assert the `data-test` prop and the `before` slot
                    // both reach the rendered chip.
                    chip: ({ option }: any) => (
                        <Chip data-test={`chip-${option.id}`}>
                            {{ before: () => <span data-test="chip-before">★</span> }}
                        </Chip>
                    ),
                },
            });
            await waitFor(() => {
                expect(document.body.querySelector('[data-test="chip-apple"]')).toBeInTheDocument();
            });
            const chip = document.body.querySelector('[data-test="chip-apple"]');
            // Label still comes from getOptionName.
            expect(chip?.textContent).toContain('Apple');
            // `before` slot from the chip slot is rendered inside the chip.
            expect(chip?.querySelector('[data-test="chip-before"]')).toBeInTheDocument();
        });

        it('should render the `beforeOptions` slot above the options', async () => {
            render(SelectTextField, {
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    translations: TRANSLATIONS,
                },
                slots: {
                    beforeOptions: () => <div data-test="before">Before content</div>,
                },
            });
            const user = userEvent.setup();
            await user.click(getInput());
            await waitFor(() => {
                expect(document.body.querySelector('[data-test="before"]')).toBeInTheDocument();
            });
            // Ensure it's positioned before the first option in the listbox.
            const listbox = document.body.querySelector('.lumx-combobox-list');
            const before = listbox?.querySelector('[data-test="before"]');
            const firstOption = listbox?.querySelector('[role="option"]');
            expect(before).toBeTruthy();
            expect(firstOption).toBeTruthy();
            // before should appear earlier in document order than the first option.
            // eslint-disable-next-line no-bitwise
            expect(before!.compareDocumentPosition(firstOption!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
        });

        // ─── class + className merging ───────────────────────────

        it('should merge the `class` prop with the `className` attr passed via $attrs', () => {
            // Vue parents using template syntax pass `class`; React-style consumers (or core JSX)
            // pass `className` as an attribute. Both should reach the underlying TextField.
            render(SelectTextField, {
                attrs: {
                    class: 'from-class-prop',
                    className: 'from-class-name-attr',
                },
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    translations: TRANSLATIONS,
                },
            });
            const textField = document.body.querySelector('.lumx-text-field')!;
            expect(textField).toHaveClass('from-class-prop');
            expect(textField).toHaveClass('from-class-name-attr');
        });

        // ─── aria-disabled normalization ─────────────────────────

        /*
         * Compile-time assertions on the exported prop types. Enforced by `vue-tsc`
         * during `yarn type-check`; no runtime effect. We assert prop shapes rather
         * than render JSX because constructor overloads don't resolve `EmitsToProps`
         * handlers in TSX call sites — `@change` / `$emit('change', …)` are the
         * supported consumer surfaces (covered at runtime by Storybook `play`).
         */
        describe('Types', () => {
            interface TypedFruit extends Fruit {
                weight: number;
            }
            const FRUIT: TypedFruit = { id: 'a', name: 'A', weight: 1 };

            type SingleProps = SingleSelectTextFieldProps<TypedFruit>;
            type MultipleProps = MultipleSelectTextFieldProps<TypedFruit>;

            /*
             * Split the constructor overloads into a discriminable union, then pick the
             * branch matching `selectionType`. `InstanceType` collapses to the last
             * overload and loses per-branch payload narrowing.
             */
            type Overloads<T> = T extends {
                new (props: infer P1): infer R1;
                new (props: infer P2): infer R2;
            }
                ? { props: P1; instance: R1 } | { props: P2; instance: R2 }
                : never;
            type EmitFor<S extends 'single' | 'multiple'> = Extract<
                Overloads<typeof SelectTextField<TypedFruit>>,
                { props: { selectionType: S } }
            >['instance']['$emit'];
            type SingleEmit = EmitFor<'single'>;
            type MultipleEmit = EmitFor<'multiple'>;

            it('flows the generic <O> through props', () => {
                // `toEqualTypeOf` is bidirectional, so wrong-shape values are also rejected.
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

            it('narrows the change payload per selectionType', () => {
                expectTypeOf<SingleEmit>().toBeCallableWith('change', FRUIT);
                expectTypeOf<SingleEmit>().toBeCallableWith('change', undefined);
                expectTypeOf<MultipleEmit>().toBeCallableWith('change', [FRUIT]);
                expectTypeOf<MultipleEmit>().toBeCallableWith('change', undefined);
            });

            it('types common event payloads on $emit', () => {
                expectTypeOf<SingleEmit>().toBeCallableWith('search', 'hello');
                expectTypeOf<SingleEmit>().toBeCallableWith('blur', new FocusEvent('blur'));
                expectTypeOf<SingleEmit>().toBeCallableWith('focus', new FocusEvent('focus'));
                expectTypeOf<SingleEmit>().toBeCallableWith('keydown', new KeyboardEvent('keydown'));
                expectTypeOf<SingleEmit>().toBeCallableWith('clear', new MouseEvent('click'));
                expectTypeOf<SingleEmit>().toBeCallableWith('open', true);
                expectTypeOf<SingleEmit>().toBeCallableWith('load-more');
            });
        });

        it('should resolve aria-disabled passed as a Vue attr', () => {
            render(SelectTextField, {
                attrs: { 'aria-disabled': true },
                props: {
                    selectionType: 'single',
                    label: 'Select a fruit',
                    options: FRUITS,
                    getOptionId: 'id',
                    getOptionName: 'name',
                    filter: 'auto',
                    value: FRUITS[0],
                    translations: TRANSLATIONS,
                },
            });
            // When aria-disabled is true, the clear button is suppressed.
            expect(document.body.querySelector('button[aria-label="Clear"]')).toBeNull();
            expect(getInput()).toHaveAttribute('aria-disabled', 'true');
        });
    });
});
