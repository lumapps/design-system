import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import identity from 'lodash/identity';
import over from 'lodash/over';

import treeListTests from '@lumx/core/js/components/TreeList/Tests';
import { CLASSNAME as TREE_LIST_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeList';
import { CLASSNAME as TREE_LIST_ITEM_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeListItem';
import { CLASSNAME as TREE_LIST_SECTION_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeListSection';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { getAllByClassName, getByClassName, queryByClassName } from '@lumx/react/testing/utils/queries';
import { Combobox, TreeList, TreeListItem, TreeListSection } from '@lumx/react';

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
    treeListTests({ components: { TreeList, TreeListItem, TreeListSection, Combobox }, renderWithState });

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

    describe('<TreeListSection> common', () => {
        const setup = (propsOverride: Record<string, any> = {}, options?: SetupRenderOptions) => {
            const props = { label: 'Fruits', ...propsOverride };
            const { container } = render(
                <TreeList aria-label="Food">
                    <TreeList.Section {...props}>
                        <TreeList.Item label="Apple" value="apple" />
                    </TreeList.Section>
                </TreeList>,
                options,
            );
            const element = getByClassName(document.body, TREE_LIST_SECTION_CLASSNAME);
            return { props, container, element };
        };
        commonTestsSuiteRTL(setup, {
            baseClassName: TREE_LIST_SECTION_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'element',
            forwardRef: 'element',
        });

        it('should render nothing without children', () => {
            render(
                <TreeList aria-label="Food">
                    <TreeListSection label="Fruits">{[]}</TreeListSection>
                </TreeList>,
            );
            expect(queryByClassName(document.body, TREE_LIST_SECTION_CLASSNAME)).toBeNull();
        });

        it('should warn when used in a tree item', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
            try {
                render(
                    <TreeList aria-label="Food">
                        <TreeListItem label="Fruits" value="fruits">
                            <TreeListSection label="Citrus">
                                <TreeListItem label="Lemon" value="lemon" />
                            </TreeListSection>
                        </TreeListItem>
                    </TreeList>,
                );
                expect(warn).toHaveBeenCalledWith(expect.stringContaining('must be used at the root of a TreeList'));
            } finally {
                warn.mockRestore();
            }
        });

        it('should hide a section with the auto filter when its tree items render after the section', async () => {
            const Template = ({ drinks }: { drinks: string[] }) => {
                const [value, setValue] = React.useState('');
                return (
                    <Combobox.Provider>
                        <Combobox.Input
                            value={value}
                            onChange={setValue}
                            filter="auto"
                            toggleButtonProps={{ label: 'Food' }}
                        />
                        <Combobox.Popover>
                            <TreeList aria-label="Food">
                                <TreeListSection label="Fruits">
                                    <TreeListItem label="Apple" value="apple" />
                                </TreeListSection>
                                <TreeListSection label="Drinks">
                                    {drinks.map((drink) => (
                                        <TreeListItem key={drink} label={drink} value={drink} />
                                    ))}
                                </TreeListSection>
                            </TreeList>
                        </Combobox.Popover>
                    </Combobox.Provider>
                );
            };
            const { rerender } = render(<Template drinks={[]} />);
            const input = screen.getByRole('combobox');
            await userEvent.click(input);
            await screen.findByRole('tree');
            rerender(<Template drinks={['Water']} />);
            const [, drinks] = getAllByClassName(document.body, TREE_LIST_SECTION_CLASSNAME);
            expect(drinks).not.toHaveAttribute('hidden');

            await userEvent.type(input, 'apple');
            await waitFor(() => expect(drinks).toHaveAttribute('hidden'));
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
