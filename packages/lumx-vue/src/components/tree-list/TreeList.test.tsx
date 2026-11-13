/* eslint-disable vue/one-component-per-file */
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent } from 'vue';

import treeListTests from '@lumx/core/js/components/TreeList/Tests';
import { CLASSNAME as TREE_LIST_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeList';
import { CLASSNAME as TREE_LIST_ITEM_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeListItem';
import { CLASSNAME as TREE_LIST_SECTION_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeListSection';
import { getByClassName, getByTagName, queryByClassName } from '@lumx/core/testing/queries';
import { commonTestsSuiteVTL, renderWithState, SetupRenderOptions } from '@lumx/vue/testing';

import { Combobox } from '../combobox';
import { TreeList, TreeListItem, TreeListSection } from '.';

describe('<TreeList>', () => {
    treeListTests({ components: { TreeList, TreeListItem, TreeListSection, Combobox }, renderWithState });

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
                () => (
                    <TreeList aria-label="Food">
                        <TreeList.Item label="Fruits" value="fruits" {...propsOverride} />
                    </TreeList>
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
            render(() => (
                <TreeList aria-label="Food">
                    <TreeListItem label="Ignored" value="fruits">
                        {{ label: () => <strong>Fruits</strong> }}
                    </TreeListItem>
                </TreeList>
            ));
            const treeItem = screen.getByRole('treeitem', { name: 'Fruits' });
            expect(getByTagName(treeItem, 'strong')).toHaveTextContent('Fruits');
        });

        it('should render the before and after slots in the tree item row', () => {
            render(() => (
                <TreeList aria-label="Food">
                    <TreeListItem label="Fruits" value="fruits">
                        {{
                            before: () => <span data-testid="before">B</span>,
                            after: () => <span data-testid="after">A</span>,
                        }}
                    </TreeListItem>
                </TreeList>
            ));
            const row = getByClassName(document.body, `${TREE_LIST_ITEM_CLASSNAME}__row`);
            expect(row).toContainElement(screen.getByTestId('before'));
            expect(row).toContainElement(screen.getByTestId('after'));
        });

        it('should throw outside a TreeList', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
            try {
                expect(() => render(TreeListItem, { props: { label: 'Fruits', value: 'fruits' } })).toThrow(
                    'TreeListItem must be used within a TreeList',
                );
            } finally {
                warn.mockRestore();
            }
        });
    });

    describe('<TreeListSection>', () => {
        const setup = (propsOverride: any = {}, options: SetupRenderOptions<any> = {}) => {
            render(
                () => (
                    <TreeList aria-label="Food">
                        <TreeList.Section label="Fruits" {...propsOverride}>
                            <TreeListItem label="Apple" value="apple" />
                        </TreeList.Section>
                    </TreeList>
                ),
                options,
            );
            const element = getByClassName(document.body, TREE_LIST_SECTION_CLASSNAME);
            return { props: propsOverride, element };
        };
        commonTestsSuiteVTL(setup, {
            baseClassName: TREE_LIST_SECTION_CLASSNAME,
            forwardClassName: 'element',
            forwardAttributes: 'element',
        });

        it('should render the label slot in place of the label prop', () => {
            render(() => (
                <TreeList aria-label="Food">
                    <TreeListSection label="Ignored">
                        {{
                            label: () => <strong>Fruits</strong>,
                            default: () => <TreeListItem label="Apple" value="apple" />,
                        }}
                    </TreeListSection>
                </TreeList>
            ));
            const section = getByClassName(document.body, TREE_LIST_SECTION_CLASSNAME);
            expect(getByTagName(section, 'strong')).toHaveTextContent('Fruits');
            expect(screen.queryByText('Ignored')).toBeNull();
        });

        it('should render nothing without children', () => {
            render(() => (
                <TreeList aria-label="Food">
                    <TreeListSection label="Fruits" />
                </TreeList>
            ));
            expect(queryByClassName(document.body, TREE_LIST_SECTION_CLASSNAME)).toBeNull();
        });

        it('should render nothing with an empty list of children', () => {
            const items: string[] = [];
            render(() => (
                <TreeList aria-label="Food">
                    <TreeListSection label="Fruits">
                        {items.map((item) => (
                            <TreeListItem key={item} label={item} value={item} />
                        ))}
                    </TreeListSection>
                </TreeList>
            ));
            expect(queryByClassName(document.body, TREE_LIST_SECTION_CLASSNAME)).toBeNull();
        });

        it('should render nothing with a hidden child', () => {
            const isVisible = false;
            render(() => (
                <TreeList aria-label="Food">
                    <TreeListSection label="Fruits">
                        {isVisible && <TreeListItem label="Apple" value="apple" />}
                    </TreeListSection>
                </TreeList>
            ));
            expect(queryByClassName(document.body, TREE_LIST_SECTION_CLASSNAME)).toBeNull();
        });

        it('should warn when used in a tree item', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
            try {
                render(() => (
                    <TreeList aria-label="Food">
                        <TreeListItem label="Fruits" value="fruits">
                            <TreeListSection label="Citrus">
                                <TreeListItem label="Lemon" value="lemon" />
                            </TreeListSection>
                        </TreeListItem>
                    </TreeList>
                ));
                expect(warn).toHaveBeenCalledWith(expect.stringContaining('must be used at the root of a TreeList'));
            } finally {
                warn.mockRestore();
            }
        });
    });

    describe('Lifecycle', () => {
        it('attaches a new tree to the combobox after the previous tree unmounts', async () => {
            const Template = defineComponent({
                props: { fruits: Boolean },
                setup(props) {
                    return () => (
                        <Combobox.Provider>
                            <Combobox.Button label="Food" />
                            <Combobox.Popover>
                                {props.fruits ? (
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
                },
            });
            const { rerender } = render(Template, { props: { fruits: true } });
            const button = screen.getByRole('combobox');
            await userEvent.click(button);
            await screen.findByRole('tree', { name: 'Fruits' });

            await rerender({ fruits: false });
            const tree = await screen.findByRole('tree', { name: 'Drinks' });
            expect(button).toHaveAttribute('aria-controls', tree.id);
            // The trigger drives the new tree.
            await userEvent.keyboard('{ArrowDown}');
            expect(button).toHaveAttribute('aria-activedescendant', screen.getByRole('treeitem', { name: 'Water' }).id);
        });
    });
});
