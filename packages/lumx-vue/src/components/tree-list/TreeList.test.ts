import { render, screen, waitFor } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref, type PropType } from 'vue';
import identity from 'lodash/identity';

import treeListTests from '@lumx/core/js/components/TreeList/Tests';
import { CLASSNAME as TREE_LIST_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeList';
import { CLASSNAME as TREE_LIST_ITEM_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeListItem';
import { getByClassName, getByTagName } from '@lumx/core/testing/queries';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Combobox } from '../combobox';
import { useComboboxEvent } from '../combobox/context/useComboboxEvent';
import { TreeList, TreeListItem } from '.';

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

/** Consumer of the public composable: reads a combobox event and a list event. */
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

/** Combobox whose tree remounts (new tree list handle registered on the combobox) when `treeKey` changes. */
const SwappableTreeCombobox = defineComponent({
    props: {
        treeKey: { type: String, required: true },
        labels: { type: Array as PropType<string[]>, required: true },
        hasTree: { type: Boolean, default: true },
        onTreeSelect: { type: Function as PropType<(option: { value: string }) => void>, default: undefined },
    },
    setup(props) {
        return () =>
            h(Combobox.Provider, null, {
                default: () => [
                    h(Combobox.Button, { label: 'Food' }),
                    h(ComboboxEvents),
                    h(Combobox.Popover, null, {
                        default: () => [
                            props.hasTree &&
                                h(
                                    TreeList,
                                    { key: props.treeKey, 'aria-label': 'Food', onSelect: props.onTreeSelect },
                                    {
                                        default: () =>
                                            props.labels.map((label) =>
                                                h(TreeListItem, { key: label, label, value: label }),
                                            ),
                                    },
                                ),
                            h(Combobox.State, { emptyMessage: 'No result' }),
                        ],
                    }),
                ],
            });
    },
});

describe('<TreeList>', () => {
    treeListTests({ components: { TreeList, TreeListItem, Combobox }, renderWithState });

    describe('id', () => {
        it('should use the id prop on a standalone tree', () => {
            render(() => h(TreeList, { 'aria-label': 'Food', id: 'food-tree' }));
            expect(screen.getByRole('tree')).toHaveAttribute('id', 'food-tree');
        });

        it('should ignore the id prop in a combobox (the trigger controls the combobox list ID)', async () => {
            render(() =>
                h(Combobox.Provider, null, {
                    default: () => [
                        h(Combobox.Button, { label: 'Food' }),
                        h(Combobox.Popover, null, {
                            default: () =>
                                h(
                                    TreeList,
                                    { 'aria-label': 'Food', id: 'food-tree' },
                                    { default: () => h(TreeListItem, { label: 'Fruits', value: 'fruits' }) },
                                ),
                        }),
                    ],
                }),
            );
            const button = screen.getByRole('combobox');
            await userEvent.click(button);
            const tree = await screen.findByRole('tree');
            expect(tree.id).not.toBe('food-tree');
            expect(button).toHaveAttribute('aria-controls', tree.id);
        });
    });

    describe('in a combobox', () => {
        it('should not emit the tree select event (the trigger select event handles the selection)', async () => {
            const onTreeSelect = vi.fn();
            const onSelect = vi.fn();
            render(() =>
                h(Combobox.Provider, null, {
                    default: () => [
                        h(Combobox.Input, {
                            value: '',
                            onSelect,
                            toggleButtonProps: { label: 'Food' },
                        }),
                        h(Combobox.Popover, null, {
                            default: () =>
                                h(
                                    TreeList,
                                    { 'aria-label': 'Food', onSelect: onTreeSelect },
                                    {
                                        default: () => [
                                            h(TreeListItem, { label: 'Fruits', value: 'fruits' }),
                                            h(TreeListItem, { label: 'Vegetables', value: 'vegetables' }),
                                        ],
                                    },
                                ),
                        }),
                    ],
                }),
            );
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await screen.findByRole('tree');
            await userEvent.keyboard('{ArrowDown}');
            const fruits = screen.getByRole('treeitem', { name: 'Fruits' });
            expect(input).toHaveAttribute('aria-activedescendant', fruits.id);
            await userEvent.keyboard('{Enter}');
            expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'fruits' }));
            expect(onTreeSelect).not.toHaveBeenCalled();
        });

        it('should stay standalone inside a combobox list (the nearest parent wins)', async () => {
            render(() =>
                h(Combobox.Provider, null, {
                    default: () => [
                        h(Combobox.Button, { label: 'Fruits' }),
                        h(Combobox.Popover, null, {
                            default: () =>
                                h(
                                    Combobox.List,
                                    { 'aria-label': 'Fruits' },
                                    {
                                        default: () => [
                                            h(Combobox.Option, { value: 'apple' }, () => 'Apple'),
                                            h('li', null, [
                                                h(
                                                    TreeList,
                                                    { 'aria-label': 'Food' },
                                                    {
                                                        default: () =>
                                                            h(TreeListItem, { label: 'Fruits', value: 'fruits' }),
                                                    },
                                                ),
                                            ]),
                                        ],
                                    },
                                ),
                        }),
                    ],
                }),
            );
            const button = screen.getByRole('combobox');
            await userEvent.click(button);
            const tree = await screen.findByRole('tree');
            // The combobox list stays the listbox, and the tree is its own focus owner.
            expect(button).toHaveAttribute('aria-haspopup', 'listbox');
            expect(button).toHaveAttribute('aria-controls', screen.getByRole('listbox').id);
            expect(tree).toHaveAttribute('tabindex', '0');
            expect(screen.getByRole('treeitem', { name: 'Fruits' })).toBeInTheDocument();
        });
    });

    describe('registered tree change', () => {
        it('should re-subscribe the combobox events and the state to the new tree', async () => {
            const onTreeSelect = vi.fn();
            const { rerender } = render(SwappableTreeCombobox, {
                props: { treeKey: 'first', labels: ['Fruits', 'Vegetables', 'Drinks'] },
            });
            const events = screen.getByTestId('events');
            const button = screen.getByRole('combobox');

            await userEvent.click(button);
            await waitFor(() => expect(events).toHaveAttribute('data-count', '3'));
            expect(button).toHaveAttribute('aria-haspopup', 'tree');

            // Remount the tree while open: a new tree list handle registers on the combobox.
            await rerender({ treeKey: 'second', labels: ['Snacks', 'Sweets'], onTreeSelect });
            await waitFor(() => expect(events).toHaveAttribute('data-count', '2'));
            expect(screen.getAllByRole('treeitem')).toHaveLength(2);
            expect(button).toHaveAttribute('aria-haspopup', 'tree');
            expect(button).toHaveAttribute('aria-expanded', 'true');
            expect(button).toHaveAttribute('aria-controls', screen.getByRole('tree').id);

            // The new tree is linked to the trigger.
            await userEvent.keyboard('{ArrowDown}');
            const snacks = screen.getByRole('treeitem', { name: 'Snacks' });
            expect(button).toHaveAttribute('aria-activedescendant', snacks.id);
            await userEvent.keyboard('{ArrowDown}');
            const sweets = screen.getByRole('treeitem', { name: 'Sweets' });
            expect(button).toHaveAttribute('aria-activedescendant', sweets.id);
            expect(onTreeSelect).not.toHaveBeenCalled();

            // Unmount the tree while open: no list, nothing to show, no stale active item.
            await rerender({ hasTree: false });
            await waitFor(() => expect(events).toHaveAttribute('data-count', '0'));
            expect(screen.queryByRole('tree')).not.toBeInTheDocument();
            expect(button).toHaveAttribute('aria-expanded', 'false');
            expect(button).toHaveAttribute('aria-activedescendant', '');
        });
    });

    describe('<TreeList> common', () => {
        const setup = (propsOverride: any = {}, options: SetupRenderOptions<any> = {}) => {
            render(TreeList, { ...options, props: { 'aria-label': 'Food', ...propsOverride } });
            const element = getByClassName(document.body, TREE_LIST_CLASSNAME);
            return { props: propsOverride, element };
        };
        commonTestsSuiteVTL(setup, {
            baseClassName: TREE_LIST_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'element',
        });
    });

    describe('<TreeListItem>', () => {
        const setup = (propsOverride: any = {}, options: SetupRenderOptions<any> = {}) => {
            render(
                () =>
                    h(
                        TreeList,
                        { 'aria-label': 'Food' },
                        { default: () => h(TreeListItem, { label: 'Fruits', value: 'fruits', ...propsOverride }) },
                    ),
                options,
            );
            const element = getByClassName(document.body, TREE_LIST_ITEM_CLASSNAME);
            return { props: propsOverride, element };
        };
        commonTestsSuiteVTL(setup, {
            baseClassName: TREE_LIST_ITEM_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'element',
        });

        it('should render the label slot in place of the label prop', () => {
            render(() =>
                h(
                    TreeList,
                    { 'aria-label': 'Food' },
                    {
                        default: () =>
                            h(
                                TreeListItem,
                                { label: 'Ignored', value: 'fruits' },
                                { label: () => h('strong', 'Fruits') },
                            ),
                    },
                ),
            );
            const treeItem = screen.getByRole('treeitem', { name: 'Fruits' });
            expect(getByTagName(treeItem, 'strong')).toHaveTextContent('Fruits');
        });

        it('should provide the option context to the before and after slots only', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
            const renderTree = (slots: Record<string, () => any>) =>
                render(() =>
                    h(
                        TreeList,
                        { 'aria-label': 'Food' },
                        {
                            default: () =>
                                h(TreeListItem, { label: 'Fruits', value: 'fruits', isSelected: true }, slots),
                        },
                    ),
                );
            const { unmount } = renderTree({ after: () => h(Combobox.SelectionIcon) });
            expect(screen.getByRole('treeitem', { name: 'Fruits' })).toBeInTheDocument();
            unmount();
            // Same as React: the label slot does not get the option context.
            expect(() => renderTree({ label: () => ['Fruits', h(Combobox.SelectionIcon)] })).toThrow(
                'must be used within a Combobox.Option',
            );
            warn.mockRestore();
        });

        it('should throw outside a TreeList', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
            expect(() => render(TreeListItem, { props: { label: 'Fruits', value: 'fruits' } })).toThrow(
                'TreeListItem must be used within a TreeList',
            );
            warn.mockRestore();
        });

        it('should warn in another composite (e.g. a combobox list)', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
            render(() =>
                h(Combobox.Provider, null, {
                    default: () => [
                        h(Combobox.Button, { label: 'Fruits' }),
                        h(Combobox.Popover, null, {
                            default: () =>
                                h(
                                    Combobox.List,
                                    { 'aria-label': 'Fruits' },
                                    { default: () => h(TreeListItem, { label: 'Fruits', value: 'fruits' }) },
                                ),
                        }),
                    ],
                }),
            );
            await userEvent.click(screen.getByRole('combobox'));
            await waitFor(() =>
                expect(warn).toHaveBeenCalledWith(
                    expect.stringContaining('TreeListItem must be used within a TreeList'),
                ),
            );
            warn.mockRestore();
        });
    });
});
