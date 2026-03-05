import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { defineComponent, h, ref } from 'vue';
import { vi } from 'vitest';

import { CLASSNAME } from '@lumx/core/js/components/List/ListItem';
import { getByClassName, queryByClassName } from '@lumx/core/testing/queries';
import BaseListItemTests, { setup } from '@lumx/core/js/components/List/ListItemTests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { provideDisabledState } from '../../composables/useDisabledState';

import { ListItem, ListItemAction } from '.';

describe('<ListItem />', () => {
    const renderListItem = (
        { children, before, after, handleClick, ...props }: any,
        options?: SetupRenderOptions<any>,
    ) =>
        render(ListItem, {
            ...options,
            props,
            slots: {
                ...(children ? { default: children } : undefined),
                ...(before ? { before: () => before } : undefined),
                ...(after ? { after: () => after } : undefined),
            },
            attrs: handleClick ? { onClick: handleClick } : undefined,
        });

    // Run core tests
    BaseListItemTests({ render: renderListItem, screen });

    const setupListItem = (props: any = {}, options: SetupRenderOptions<any> = {}) =>
        setup(props, { ...options, render: renderListItem, screen });

    // Vue-specific tests
    describe('Vue', () => {
        describe('Click handling', () => {
            it('should emit click when button is clicked', async () => {
                const wrapper = render(ListItem, {
                    props: { onClick: vi.fn() },
                    slots: { default: 'Label' },
                });
                await userEvent.click(screen.getByRole('button', { name: 'Label' }));
                expect(wrapper.emitted('click')).toBeTruthy();
            });

            it('should emit click when link is clicked', async () => {
                const wrapper = render(ListItem, {
                    props: { onClick: vi.fn(), linkProps: { href: '#' } },
                    slots: { default: 'Label' },
                });
                await userEvent.click(screen.getByRole('link', { name: 'Label' }));
                expect(wrapper.emitted('click')).toBeTruthy();
            });
        });

        describe('Disabled state', () => {
            it('should render isDisabled button with aria-disabled', () => {
                render(ListItem, {
                    props: { isDisabled: true, onClick: vi.fn() },
                    slots: { default: 'Label' },
                });
                expect(screen.getByRole('button', { name: 'Label' })).toHaveAttribute('aria-disabled', 'true');
            });

            it('should not emit click when button is disabled', async () => {
                const wrapper = render(ListItem, {
                    props: { isDisabled: true, onClick: vi.fn() },
                    slots: { default: 'Label' },
                });
                await userEvent.click(screen.getByRole('button', { name: 'Label' }));
                expect(wrapper.emitted('click')).toBeFalsy();
            });

            it('should render isDisabled link with aria-disabled', () => {
                render(ListItem, {
                    props: { isDisabled: true, linkProps: { href: 'https://example.com' } },
                    slots: { default: 'Label' },
                });
                expect(screen.getByRole('link', { name: 'Label' })).toHaveAttribute('aria-disabled', 'true');
            });

            it('should not emit click when link is disabled', async () => {
                const wrapper = render(ListItem, {
                    props: { isDisabled: true, onClick: vi.fn(), linkProps: { href: 'https://example.com' } },
                    slots: { default: 'Label' },
                });
                await userEvent.click(screen.getByRole('link', { name: 'Label' }));
                expect(wrapper.emitted('click')).toBeFalsy();
            });

            it('should render aria-disabled button with aria-disabled', () => {
                render(ListItem, {
                    props: { 'aria-disabled': true, onClick: vi.fn() },
                    slots: { default: 'Label' },
                });
                expect(screen.getByRole('button', { name: 'Label' })).toHaveAttribute('aria-disabled', 'true');
            });

            it('should not emit click when button is aria-disabled', async () => {
                const wrapper = render(ListItem, {
                    props: { 'aria-disabled': true, onClick: vi.fn() },
                    slots: { default: 'Label' },
                });
                await userEvent.click(screen.getByRole('button', { name: 'Label' }));
                expect(wrapper.emitted('click')).toBeFalsy();
            });

            it('should render aria-disabled link with aria-disabled', () => {
                render(ListItem, {
                    props: { 'aria-disabled': true, linkProps: { href: 'https://example.com' } },
                    slots: { default: 'Label' },
                });
                expect(screen.getByRole('link', { name: 'Label' })).toHaveAttribute('aria-disabled', 'true');
            });

            it('should not emit click when link is aria-disabled', async () => {
                const wrapper = render(ListItem, {
                    props: { 'aria-disabled': true, onClick: vi.fn(), linkProps: { href: 'https://example.com' } },
                    slots: { default: 'Label' },
                });
                await userEvent.click(screen.getByRole('link', { name: 'Label' }));
                expect(wrapper.emitted('click')).toBeFalsy();
            });
        });

        describe('linkAs prop', () => {
            it('should render as a custom component when linkAs is provided with href', () => {
                const CustomLink = defineComponent({
                    inheritAttrs: true,
                    setup(_, { attrs, slots }) {
                        return () => h('a', { ...attrs, 'data-custom': 'true' }, slots.default?.());
                    },
                });
                render(ListItem, {
                    props: { linkAs: CustomLink, linkProps: { href: '/custom' } },
                    slots: { default: 'Label' },
                });
                const link = queryByClassName(document.body, `${CLASSNAME}__link`);
                expect(link).toBeInTheDocument();
                expect(link).toHaveAttribute('data-custom', 'true');
                expect(link).toHaveAttribute('href', '/custom');
            });

            it('should render as clickable when only linkAs is provided', () => {
                const CustomLink = defineComponent({
                    inheritAttrs: true,
                    setup(_, { attrs, slots }) {
                        return () => h('a', { ...attrs, 'data-custom': 'true' }, slots.default?.());
                    },
                });
                render(ListItem, {
                    props: { linkAs: CustomLink },
                    slots: { default: 'Label' },
                });
                const link = queryByClassName(document.body, `${CLASSNAME}__link`);
                expect(link).toBeInTheDocument();
                expect(link).toHaveAttribute('data-custom', 'true');
            });
        });

        describe('DisabledState context', () => {
            it('should render disabled from context (button)', async () => {
                const onClick = vi.fn();
                render(
                    defineComponent({
                        template: `
                            <Wrapper>
                                <ListItem @click="onClick">Label</ListItem>
                            </Wrapper>
                        `,
                        components: {
                            ListItem,
                            Wrapper: defineComponent({
                                setup(_, { slots }) {
                                    provideDisabledState({ state: 'disabled' });
                                    return () => slots.default?.();
                                },
                            }),
                        },
                        setup() {
                            return { onClick };
                        },
                    }),
                );
                const link = queryByClassName(document.body, `${CLASSNAME}__link`);
                expect(link).toHaveAttribute('aria-disabled', 'true');
                if (link) await userEvent.click(link);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should render disabled from context (link)', async () => {
                const onClick = vi.fn();
                render(
                    defineComponent({
                        template: `
                            <Wrapper>
                                <ListItem :linkProps="{ href: 'https://example.com' }" @click="onClick">Label</ListItem>
                            </Wrapper>
                        `,
                        components: {
                            ListItem,
                            Wrapper: defineComponent({
                                setup(_, { slots }) {
                                    provideDisabledState({ state: 'disabled' });
                                    return () => slots.default?.();
                                },
                            }),
                        },
                        setup() {
                            return { onClick };
                        },
                    }),
                );
                const link = queryByClassName(document.body, `${CLASSNAME}__link`);
                expect(link).toHaveAttribute('aria-disabled', 'true');
                if (link) await userEvent.click(link);
                expect(onClick).not.toHaveBeenCalled();
            });
        });

        describe('ListItem.Action', () => {
            it('should render action as a button with default action class', async () => {
                const onClick = vi.fn();
                render(
                    defineComponent({
                        components: { ListItem, ListItemAction },
                        setup() {
                            return { onClick };
                        },
                        template: `
                            <ListItem>
                                <template #default>
                                    <ListItemAction @click="onClick">Action label</ListItemAction>
                                </template>
                            </ListItem>
                        `,
                    }),
                );
                const button = screen.getByRole('button', { name: 'Action label' });
                expect(button).toBeInTheDocument();
                expect(button).toHaveClass('lumx-action-area__action');
                await userEvent.click(button);
                expect(onClick).toHaveBeenCalledTimes(1);
            });

            it('should render action as a link with default action class', () => {
                render(
                    defineComponent({
                        components: { ListItem, ListItemAction },
                        template: `
                            <ListItem>
                                <template #default>
                                    <ListItemAction as="a" href="/test">Link action</ListItemAction>
                                </template>
                            </ListItem>
                        `,
                    }),
                );
                const link = screen.getByRole('link', { name: 'Link action' });
                expect(link).toBeInTheDocument();
                expect(link).toHaveClass('lumx-action-area__action');
                expect(link).toHaveAttribute('href', '/test');
            });

            it('should render wrapper as div (non-clickable) when Action is used', () => {
                render(
                    defineComponent({
                        components: { ListItem, ListItemAction },
                        template: `
                            <ListItem>
                                <template #default>
                                    <ListItemAction @click="() => {}">Action</ListItemAction>
                                </template>
                            </ListItem>
                        `,
                    }),
                );
                const listItem = getByClassName(document.body, CLASSNAME);
                const wrapper = queryByClassName(listItem, `${CLASSNAME}__wrapper`);
                const link = queryByClassName(listItem, `${CLASSNAME}__link`);
                expect(wrapper).toBeInTheDocument();
                expect(wrapper?.tagName).toBe('DIV');
                expect(link).not.toBeInTheDocument();
            });

            it('should forward ref to the action element', () => {
                const actionRef = ref<HTMLElement>();
                render(
                    defineComponent({
                        components: { ListItem, ListItemAction },
                        setup() {
                            return { actionRef };
                        },
                        template: `
                            <ListItem>
                                <template #default>
                                    <ListItemAction ref="actionRef" @click="() => {}">Action</ListItemAction>
                                </template>
                            </ListItem>
                        `,
                    }),
                );
                expect((actionRef.value as any)?.$el).toBeInstanceOf(HTMLButtonElement);
            });

            it('should render action with secondary actions in after slot', async () => {
                const onPrimary = vi.fn();
                const onSecondary = vi.fn();
                render(
                    defineComponent({
                        components: { ListItem, ListItemAction },
                        setup() {
                            return { onPrimary, onSecondary };
                        },
                        template: `
                            <ListItem>
                                <template #default>
                                    <ListItemAction @click="onPrimary">Primary</ListItemAction>
                                </template>
                                <template #after>
                                    <button type="button" @click="onSecondary">Secondary</button>
                                </template>
                            </ListItem>
                        `,
                    }),
                );
                const primary = screen.getByRole('button', { name: 'Primary' });
                const secondary = screen.getByRole('button', { name: 'Secondary' });
                expect(primary).toBeInTheDocument();
                expect(secondary).toBeInTheDocument();

                await userEvent.click(primary);
                expect(onPrimary).toHaveBeenCalledTimes(1);
                expect(onSecondary).not.toHaveBeenCalled();

                await userEvent.click(secondary);
                expect(onSecondary).toHaveBeenCalledTimes(1);
            });
        });
    });

    // Common tests suite
    commonTestsSuiteVTL(setupListItem, {
        baseClassName: CLASSNAME,
        forwardClassName: 'listItem',
        forwardAttributes: 'listItem',
    });
});
