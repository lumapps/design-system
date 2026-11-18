import { defineComponent, h, ref } from 'vue';
import { screen } from '@testing-library/vue';
import { render } from '@testing-library/vue';

import selectListTests from '@lumx/core/js/components/SelectList/Tests';
import { CLASSNAME } from '@lumx/core/js/components/SelectList';
import { CLASSNAME as DIVIDER_CLASSNAME } from '@lumx/core/js/components/List/ListDivider';
import { getByClassName } from '@lumx/core/testing/queries';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { SelectList, SelectListDivider, SelectListOption, SelectListOptionMoreInfo } from '.';

/**
 * Render a SelectList template with controlled state management for Vue.
 * Manages a `value` state and wires it through the `onChange` prop.
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
    const { unmount, container } = render(Wrapper);
    return { unmount, container: container as HTMLElement };
}

describe('<SelectList>', () => {
    selectListTests({
        components: { SelectList, Option: SelectListOption, OptionMoreInfo: SelectListOptionMoreInfo },
        renderWithState,
    });

    describe('Divider', () => {
        it('should render a decorative list divider', () => {
            render(
                defineComponent({
                    setup: () => () =>
                        h('ul', { role: 'listbox', 'aria-label': 'Fruits' }, [
                            h(SelectListDivider, { 'data-testid': 'divider' }),
                        ]),
                }),
            );
            const divider = screen.getByTestId('divider');
            expect(divider).toHaveClass(DIVIDER_CLASSNAME);
            expect(divider).toHaveAttribute('role', 'none');
        });
    });

    describe('option slot', () => {
        it('should fall back on the option name when the slot option has no default content', () => {
            render(
                defineComponent({
                    setup: () => () =>
                        h(
                            SelectList as any,
                            {
                                'aria-label': 'Files',
                                options: [{ id: 'a', name: 'Annual report' }],
                                getOptionId: 'id',
                                getOptionName: 'name',
                            },
                            {
                                // Compiled slots (as in a `.vue` template) carry the `_` flag and are not normalized.
                                option: ({ option }: any) =>
                                    h(
                                        SelectListOption,
                                        { value: option.id },
                                        { before: () => h('span', 'icon'), _: 1 },
                                    ),
                            },
                        ),
                }),
            );
            expect(screen.getByRole('option')).toHaveTextContent('Annual report');
            expect(screen.getByText('icon')).toBeInTheDocument();
        });
    });

    const setup = (propsOverride: any = {}, options: SetupRenderOptions<any> = {}) => {
        const Wrapper = defineComponent({
            setup() {
                return () =>
                    h(SelectList as any, {
                        'aria-label': 'Fruits',
                        options: ['Apple'],
                        getOptionId: String,
                        ...propsOverride,
                    });
            },
        });
        render(Wrapper, options);
        return { props: propsOverride, element: getByClassName(document.body, CLASSNAME) };
    };

    commonTestsSuiteVTL(setup, {
        baseClassName: CLASSNAME,
        forwardClassName: 'element',
        forwardAttributes: 'element',
    });
});
