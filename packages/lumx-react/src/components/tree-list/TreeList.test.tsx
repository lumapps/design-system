import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import identity from 'lodash/identity';
import over from 'lodash/over';

import treeListTests from '@lumx/core/js/components/TreeList/Tests';
import { CLASSNAME as TREE_LIST_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeList';
import { CLASSNAME as TREE_LIST_ITEM_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeListItem';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { Combobox, TreeList, TreeListItem } from '@lumx/react';

/**
 * Render a template with controlled state management.
 * Mirrors the withValueOnChange Storybook decorator.
 */
function renderWithState(
    template: (props: any) => React.JSX.Element,
    initialArgs: Record<string, any> = {},
    {
        onChangeProp = 'onChange',
        valueExtract = identity,
    }: { onChangeProp?: string; valueExtract?: (v: any) => any } = {},
) {
    const Wrapper = () => {
        const [value, setValue] = React.useState(initialArgs.value ?? '');
        const props = {
            ...initialArgs,
            value,
            [onChangeProp]: over([(v: any) => setValue(valueExtract(v)), initialArgs[onChangeProp]]),
        };
        return template(props);
    };
    return render(<Wrapper />);
}

/** Consumer of the public hook: reads a combobox event and a list event. */
function ComboboxEvents() {
    const isOpen = Combobox.useComboboxEvent('open', false);
    const options = Combobox.useComboboxEvent('optionsChange', undefined);
    return (
        <output data-testid="events" data-open={isOpen} data-count={options?.optionsLength ?? 0}>
            events
        </output>
    );
}

/** Combobox whose tree remounts (new tree list handle registered on the combobox) when `treeKey` changes. */
function SwappableTreeCombobox({
    treeKey,
    labels,
    hasTree = true,
    onTreeSelect,
}: {
    treeKey: string;
    labels: string[];
    hasTree?: boolean;
    onTreeSelect?: (option: { value: string }) => void;
}) {
    return (
        <Combobox.Provider>
            <Combobox.Button label="Food" />
            <ComboboxEvents />
            <Combobox.Popover>
                {hasTree && (
                    <TreeList key={treeKey} aria-label="Food" onSelect={onTreeSelect}>
                        {labels.map((label) => (
                            <TreeListItem key={label} label={label} value={label} />
                        ))}
                    </TreeList>
                )}
                <Combobox.State emptyMessage="No result" />
            </Combobox.Popover>
        </Combobox.Provider>
    );
}

/** Label of the active item (the `aria-activedescendant` of the trigger). */
const getActiveLabel = (trigger: HTMLElement) => {
    const id = trigger.getAttribute('aria-activedescendant');
    return id ? document.getElementById(id)?.textContent?.trim() : undefined;
};

describe('<TreeList>', () => {
    treeListTests({ components: { TreeList, TreeListItem, Combobox }, renderWithState });

    describe('id', () => {
        it('should use the id prop on a standalone tree', () => {
            render(<TreeList aria-label="Food" id="food-tree" />);
            expect(screen.getByRole('tree')).toHaveAttribute('id', 'food-tree');
        });

        it('should ignore the id prop in a combobox (the trigger controls the combobox list ID)', async () => {
            render(
                <Combobox.Provider>
                    <Combobox.Button label="Food" />
                    <Combobox.Popover>
                        <TreeList aria-label="Food" id="food-tree">
                            <TreeListItem label="Fruits" value="fruits" />
                        </TreeList>
                    </Combobox.Popover>
                </Combobox.Provider>,
            );
            const button = screen.getByRole('combobox');
            await userEvent.click(button);
            const tree = await screen.findByRole('tree');
            expect(tree.id).not.toBe('food-tree');
            expect(button).toHaveAttribute('aria-controls', tree.id);
        });
    });

    describe('in a combobox', () => {
        it('should not call the tree onSelect (the trigger onSelect handles the selection)', async () => {
            const onTreeSelect = vi.fn();
            const onSelect = vi.fn();
            render(
                <Combobox.Provider>
                    <Combobox.Input
                        value=""
                        onChange={() => {}}
                        onSelect={onSelect}
                        toggleButtonProps={{ label: 'Food' }}
                    />
                    <Combobox.Popover>
                        <TreeList aria-label="Food" onSelect={onTreeSelect}>
                            <TreeListItem label="Fruits" value="fruits" />
                            <TreeListItem label="Vegetables" value="vegetables" />
                        </TreeList>
                    </Combobox.Popover>
                </Combobox.Provider>,
            );
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await screen.findByRole('tree');
            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => expect(getActiveLabel(input)).toBe('Fruits'));
            await userEvent.keyboard('{Enter}');
            expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ value: 'fruits' }));
            expect(onTreeSelect).not.toHaveBeenCalled();
        });

        it('should stay standalone inside a combobox list (the nearest parent wins)', async () => {
            render(
                <Combobox.Provider>
                    <Combobox.Button label="Fruits" />
                    <Combobox.Popover>
                        <Combobox.List aria-label="Fruits">
                            <Combobox.Option value="apple">Apple</Combobox.Option>
                            <li>
                                <TreeList aria-label="Food">
                                    <TreeListItem label="Fruits" value="fruits" />
                                </TreeList>
                            </li>
                        </Combobox.List>
                    </Combobox.Popover>
                </Combobox.Provider>,
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
            const { rerender } = render(
                <SwappableTreeCombobox treeKey="first" labels={['Fruits', 'Vegetables', 'Drinks']} />,
            );
            const events = screen.getByTestId('events');
            const button = screen.getByRole('combobox');

            await userEvent.click(button);
            await waitFor(() => expect(events).toHaveAttribute('data-count', '3'));
            expect(button).toHaveAttribute('aria-haspopup', 'tree');

            // Remount the tree while open: a new tree list handle registers on the combobox.
            rerender(
                <SwappableTreeCombobox treeKey="second" labels={['Snacks', 'Sweets']} onTreeSelect={onTreeSelect} />,
            );
            await waitFor(() => expect(events).toHaveAttribute('data-count', '2'));
            expect(screen.getAllByRole('treeitem')).toHaveLength(2);
            expect(button).toHaveAttribute('aria-haspopup', 'tree');
            expect(button).toHaveAttribute('aria-expanded', 'true');
            expect(button).toHaveAttribute('aria-controls', screen.getByRole('tree').id);

            // The new tree is linked to the trigger.
            await userEvent.keyboard('{ArrowDown}');
            await waitFor(() => expect(getActiveLabel(button)).toBe('Snacks'));
            await userEvent.keyboard('{ArrowDown}');
            expect(getActiveLabel(button)).toBe('Sweets');
            expect(onTreeSelect).not.toHaveBeenCalled();

            // Unmount the tree while open: no list, nothing to show, no stale active item.
            rerender(<SwappableTreeCombobox treeKey="second" labels={['Snacks', 'Sweets']} hasTree={false} />);
            await waitFor(() => expect(events).toHaveAttribute('data-count', '0'));
            expect(screen.queryByRole('tree')).not.toBeInTheDocument();
            expect(button).toHaveAttribute('aria-expanded', 'false');
            expect(button).toHaveAttribute('aria-activedescendant', '');
        });
    });

    describe('<TreeList> common', () => {
        const setup = (propsOverride: Record<string, any> = {}, options?: SetupRenderOptions) => {
            const props = { 'aria-label': 'Food', ...propsOverride };
            const { container } = render(<TreeList {...props} />, options);
            const element = getByClassName(document.body, TREE_LIST_CLASSNAME);
            return { props, container, element };
        };
        commonTestsSuiteRTL(setup, {
            baseClassName: TREE_LIST_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'element',
            forwardRef: 'element',
        });
    });

    describe('<TreeListItem> common', () => {
        const setup = (propsOverride: Record<string, any> = {}, options?: SetupRenderOptions) => {
            const props = { label: 'Fruits', value: 'fruits', ...propsOverride };
            const { container } = render(
                <TreeList aria-label="Food">
                    <TreeListItem {...props} />
                </TreeList>,
                options,
            );
            const element = getByClassName(document.body, TREE_LIST_ITEM_CLASSNAME);
            return { props, container, element };
        };
        commonTestsSuiteRTL(setup, {
            baseClassName: TREE_LIST_ITEM_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'element',
            forwardRef: 'element',
        });

        it('should throw outside a TreeList', () => {
            const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
            expect(() => render(<TreeListItem label="Fruits" value="fruits" />)).toThrow(
                'TreeListItem must be used within a TreeList',
            );
            error.mockRestore();
        });

        it('should warn in another composite (e.g. a combobox list)', async () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
            render(
                <Combobox.Provider>
                    <Combobox.Button label="Fruits" />
                    <Combobox.Popover>
                        <Combobox.List aria-label="Fruits">
                            <TreeListItem label="Fruits" value="fruits" />
                        </Combobox.List>
                    </Combobox.Popover>
                </Combobox.Provider>,
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
