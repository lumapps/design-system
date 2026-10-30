import { render, screen } from '@testing-library/vue';
import { defineComponent, h, ref } from 'vue';
import identity from 'lodash/identity';

import treeListTests from '@lumx/core/js/components/TreeList/Tests';
import { CLASSNAME as TREE_LIST_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeList';
import { CLASSNAME as TREE_LIST_ITEM_CLASSNAME } from '@lumx/core/js/components/TreeList/TreeListItem';
import { getByClassName, getByTagName } from '@lumx/core/testing/queries';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { Combobox } from '../combobox';
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

describe('<TreeList>', () => {
    treeListTests({ components: { TreeList, TreeListItem, Combobox }, renderWithState });

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
                        { default: () => h(TreeList.Item, { label: 'Fruits', value: 'fruits', ...propsOverride }) },
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

        it('should render the before and after slots in the tree item row', () => {
            render(() =>
                h(
                    TreeList,
                    { 'aria-label': 'Food' },
                    {
                        default: () =>
                            h(
                                TreeListItem,
                                { label: 'Fruits', value: 'fruits' },
                                {
                                    before: () => h('span', { 'data-testid': 'before' }, 'B'),
                                    after: () => h('span', { 'data-testid': 'after' }, 'A'),
                                },
                            ),
                    },
                ),
            );
            const row = getByClassName(document.body, `${TREE_LIST_ITEM_CLASSNAME}__row`);
            expect(row).toContainElement(screen.getByTestId('before'));
            expect(row).toContainElement(screen.getByTestId('after'));
        });

        it('should throw outside a TreeList', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
            expect(() => render(TreeListItem, { props: { label: 'Fruits', value: 'fruits' } })).toThrow(
                'TreeListItem must be used within a TreeList',
            );
            warn.mockRestore();
        });
    });
});
