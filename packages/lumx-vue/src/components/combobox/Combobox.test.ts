import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref, type PropType } from 'vue';
import identity from 'lodash/identity';

import comboboxTests from '@lumx/core/js/components/Combobox/Tests';
import { CLASSNAME as TEXT_FIELD_CLASSNAME } from '@lumx/core/js/components/TextField/constants';
import { CLASSNAME as COMBOBOX_BUTTON_CLASSNAME } from '@lumx/core/js/components/Combobox/ComboboxButton';
import { getByClassName } from '@lumx/core/testing/queries';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Button, IconButton } from '@lumx/vue';

import { Combobox } from '.';
import ComboboxButton from './ComboboxButton';
import ComboboxInput from './ComboboxInput';
import ComboboxProvider from './ComboboxProvider';
import { useComboboxEvent } from './context/useComboboxEvent';

/**
 * Renders a template with controlled state management.
 * Vue equivalent of the React renderWithState helper.
 */
function renderWithState(
    template: (props: any) => any,
    initialArgs: Record<string, any> = {},
    {
        onChangeProp = 'onChange',
        valueExtract = identity,
    }: { onChangeProp?: string; valueExtract?: (v: any) => any } = {},
) {
    const Wrapper = defineComponent({
        setup() {
            const value = ref(initialArgs.value ?? '');

            return () => {
                const props = {
                    ...initialArgs,
                    value: value.value,
                    [onChangeProp]: (...args: any[]) => {
                        value.value = valueExtract(args[0]);
                        initialArgs[onChangeProp]?.(...args);
                    },
                };
                return template(props);
            };
        },
    });

    const { unmount, container } = render(Wrapper);
    return { unmount, container: container as HTMLElement };
}

describe('<Combobox>', () => {
    comboboxTests({
        components: { Combobox, IconButton, Button },
        renderWithState,
    });

    // ── Combobox.Input — commonTestsSuiteVTL ──────────────────────
    describe('<Combobox.Input>', () => {
        /**
         * Setup function for commonTestsSuiteVTL.
         * Renders Combobox.Input inside a Provider (required for context)
         * and returns named DOM references.
         */
        const setup = (propsOverride: any = {}, options: SetupRenderOptions<any> = {}) => {
            const Wrapper = defineComponent({
                setup() {
                    return () =>
                        h(ComboboxProvider, null, {
                            default: () =>
                                h(ComboboxInput, {
                                    placeholder: 'Pick a fruit…',
                                    ...propsOverride,
                                }),
                        });
                },
            });

            render(Wrapper, options);

            const element = getByClassName(document.body, TEXT_FIELD_CLASSNAME);
            const inputNative = document.body.querySelector('input') as HTMLInputElement;

            return {
                props: propsOverride,
                element,
                inputNative,
            };
        };

        commonTestsSuiteVTL(setup, {
            baseClassName: TEXT_FIELD_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'inputNative',
            applyTheme: {
                affects: [{ element: 'element' }],
                viaProp: true,
                viaContext: true,
                defaultTheme: 'light',
            },
        });
    });

    // ── Combobox.Button — commonTestsSuiteVTL ─────────────────────
    describe('<Combobox.Button>', () => {
        /**
         * Setup function for commonTestsSuiteVTL.
         * Renders Combobox.Button inside a Provider (required for context)
         * and returns named DOM references.
         */
        const setup = (propsOverride: any = {}, options: SetupRenderOptions<any> = {}) => {
            const Wrapper = defineComponent({
                setup() {
                    return () =>
                        h(ComboboxProvider, null, {
                            default: () =>
                                h(ComboboxButton, {
                                    label: 'Select a fruit',
                                    ...propsOverride,
                                }),
                        });
                },
            });

            render(Wrapper, options);

            const element = getByClassName(document.body, COMBOBOX_BUTTON_CLASSNAME);

            return {
                props: propsOverride,
                element,
            };
        };

        commonTestsSuiteVTL(setup, {
            baseClassName: COMBOBOX_BUTTON_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'element',
            applyTheme: {
                affects: [{ element: 'element' }],
                viaProp: true,
                viaContext: true,
                defaultTheme: 'light',
            },
        });
    });

    // ── Registered list change ───────────────────────────────────
    describe('registered list change', () => {
        /** Consumer of the public composable: reads a combobox event and a listbox event. */
        const ComboboxEvents = defineComponent(() => {
            const isOpen = useComboboxEvent('open', false);
            const options = useComboboxEvent('optionsChange', undefined);
            return () =>
                h(
                    'output',
                    {
                        'data-testid': 'events',
                        'data-open': String(isOpen.value),
                        'data-count': options.value?.optionsLength ?? 0,
                    },
                    'events',
                );
        });

        /** Combobox whose list remounts (new list handle registered on the combobox) when `listKey` changes. */
        const SwappableCombobox = defineComponent({
            props: {
                listKey: { type: String, required: true },
                fruits: { type: Array as PropType<string[]>, required: true },
                hasList: { type: Boolean, default: true },
            },
            emits: ['open'],
            setup(props, { emit }) {
                return () =>
                    h(
                        Combobox.Provider,
                        { onOpen: (isOpen: boolean) => emit('open', isOpen) },
                        {
                            default: () => [
                                h(Combobox.Button, { label: 'Fruits' }),
                                h(ComboboxEvents),
                                h(Combobox.Popover, null, {
                                    default: () => [
                                        props.hasList &&
                                            h(
                                                Combobox.List,
                                                { key: props.listKey, 'aria-label': 'Fruits' },
                                                {
                                                    default: () =>
                                                        props.fruits.map((fruit) =>
                                                            h(
                                                                Combobox.Option,
                                                                { key: fruit, value: fruit },
                                                                () => fruit,
                                                            ),
                                                        ),
                                                },
                                            ),
                                        h(Combobox.State, { nbOptionMessage: (count: number) => `${count} options` }),
                                    ],
                                }),
                            ],
                        },
                    );
            },
        });

        it('should re-subscribe the combobox events and the state to the new list', async () => {
            const onOpen = vi.fn();
            const { rerender } = render(SwappableCombobox, {
                props: { listKey: 'first', fruits: ['Apple', 'Banana', 'Cherry'], onOpen },
            });
            const events = screen.getByTestId('events');

            await userEvent.click(screen.getByRole('combobox'));
            await waitFor(() => expect(events).toHaveAttribute('data-count', '3'));
            expect(await screen.findByText('3 options')).toBeInTheDocument();
            expect(onOpen).toHaveBeenLastCalledWith(true);

            // Remount the list while open: a new list handle registers on the combobox.
            await rerender({ listKey: 'second', fruits: ['Date', 'Fig'] });
            await waitFor(() => expect(events).toHaveAttribute('data-count', '2'));
            expect(await screen.findByText('2 options')).toBeInTheDocument();
            expect(screen.queryByText('3 options')).not.toBeInTheDocument();
            expect(screen.getAllByRole('option')).toHaveLength(2);
            expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true');

            // The open state still reaches `onOpen` and the new list.
            onOpen.mockClear();
            await userEvent.keyboard('{Escape}');
            await waitFor(() => expect(events).toHaveAttribute('data-open', 'false'));
            expect(onOpen).toHaveBeenLastCalledWith(false);
            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => expect(events).toHaveAttribute('data-open', 'true'));
            expect(onOpen).toHaveBeenLastCalledWith(true);
            // The new list is linked to the trigger (the first option becomes active).
            await waitFor(() =>
                expect(screen.getByRole('combobox')).toHaveAttribute(
                    'aria-activedescendant',
                    screen.getByRole('option', { name: 'Date' }).id,
                ),
            );

            // Unmount the list while open: no list, nothing to show.
            await rerender({ hasList: false });
            await waitFor(() => expect(events).toHaveAttribute('data-count', '0'));
            expect(events).toHaveAttribute('data-open', 'true');
            expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
        });
    });
});
