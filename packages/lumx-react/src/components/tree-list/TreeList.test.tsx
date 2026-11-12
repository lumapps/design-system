import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('<TreeList>', () => {
    treeListTests({ components: { TreeList, TreeListItem, Combobox }, renderWithState });

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
                    <TreeList.Item {...props} />
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
            try {
                expect(() => render(<TreeListItem label="Fruits" value="fruits" />)).toThrow(
                    'TreeListItem must be used within a TreeList',
                );
            } finally {
                error.mockRestore();
            }
        });
    });

    describe('Lifecycle', () => {
        it('calls the latest onSelect after a re-render (standalone)', async () => {
            const first = vi.fn();
            const second = vi.fn();
            const { rerender } = render(
                <TreeList aria-label="Food" onSelect={first}>
                    <TreeListItem label="Fruits" value="fruits" />
                </TreeList>,
            );
            rerender(
                <TreeList aria-label="Food" onSelect={second}>
                    <TreeListItem label="Fruits" value="fruits" />
                </TreeList>,
            );
            await userEvent.tab();
            expect(screen.getByRole('tree', { name: 'Food' })).toHaveFocus();
            await userEvent.keyboard('{ArrowDown}{Enter}');
            expect(first).not.toHaveBeenCalled();
            expect(second).toHaveBeenCalledWith(expect.objectContaining({ value: 'fruits' }));
        });

        it('attaches a new tree to the combobox after the previous tree unmounts', async () => {
            const Template = ({ fruits }: { fruits: boolean }) => (
                <Combobox.Provider>
                    <Combobox.Button label="Food" />
                    <Combobox.Popover>
                        {fruits ? (
                            <TreeList key="fruits" aria-label="Fruits">
                                <TreeListItem label="Apple" value="apple" />
                            </TreeList>
                        ) : (
                            <TreeList key="drinks" aria-label="Drinks">
                                <TreeListItem label="Water" value="water" />
                            </TreeList>
                        )}
                    </Combobox.Popover>
                </Combobox.Provider>
            );
            const { rerender } = render(<Template fruits />);
            const button = screen.getByRole('combobox');
            await userEvent.click(button);
            await screen.findByRole('tree', { name: 'Fruits' });

            rerender(<Template fruits={false} />);
            const tree = await screen.findByRole('tree', { name: 'Drinks' });
            expect(button).toHaveAttribute('aria-controls', tree.id);
            // The trigger drives the new tree.
            await userEvent.keyboard('{ArrowDown}');
            expect(button).toHaveAttribute('aria-activedescendant', screen.getByRole('treeitem', { name: 'Water' }).id);
        });
    });
});
