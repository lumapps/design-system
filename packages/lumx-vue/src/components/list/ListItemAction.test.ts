/* eslint-disable vue/one-component-per-file */
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref } from 'vue';
import { vi } from 'vitest';

import { CLASSNAME } from '@lumx/core/js/components/List/ListItemAction';
import BaseListItemActionTests, { setup } from '@lumx/core/js/components/List/ListItemActionTests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { ListItemAction } from '.';

describe('<ListItemAction />', () => {
    const renderListItemAction = ({ children, handleClick, ...props }: any, options?: SetupRenderOptions<any>) =>
        render(ListItemAction, {
            ...options,
            props,
            slots: children ? { default: children } : undefined,
            attrs: handleClick ? { onClick: handleClick } : undefined,
        });

    // Run core tests
    BaseListItemActionTests({ render: renderListItemAction, screen });

    const setupListItemAction = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderListItemAction, screen });

    // Vue-specific tests
    describe('Vue', () => {
        it('should emit click event when clicked', async () => {
            const wrapper = render(ListItemAction, {
                props: { onClick: vi.fn() },
                slots: { default: 'Label' },
            });
            await userEvent.click(screen.getByRole('button', { name: 'Label' }));
            expect(wrapper.emitted('click')).toBeTruthy();
        });

        it('should expose the underlying action element via $el', () => {
            const actionRef = ref<HTMLElement>();
            render(
                defineComponent({
                    components: { ListItemAction },
                    setup() {
                        return { actionRef };
                    },
                    template: `<ListItemAction ref="actionRef" @click="() => {}">Action</ListItemAction>`,
                }),
            );
            const button = screen.getByRole('button', { name: 'Action' });
            // Vue auto-derives `$el` from the rendered VNode tree — no explicit expose() needed.
            expect((actionRef.value as any)?.$el).toBe(button);
        });

        it('should render as a custom component', () => {
            const CustomLink = defineComponent({
                inheritAttrs: true,
                setup(_, { attrs, slots }) {
                    return () => h('a', { ...attrs, 'data-custom': 'true' }, slots.default?.());
                },
            });
            render(ListItemAction, {
                props: { as: CustomLink as any, href: '/custom' },
                slots: { default: 'Custom link' },
            });
            const link = screen.getByRole('link', { name: 'Custom link' });
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('data-custom', 'true');
            expect(link).toHaveAttribute('href', '/custom');
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupListItemAction, {
        baseClassName: CLASSNAME,
        forwardClassName: 'listItemAction',
        forwardAttributes: 'listItemAction',
    });
});
