/* eslint-disable vue/one-component-per-file */
/* eslint-disable vue/order-in-components */
/* eslint-disable vue/no-reserved-component-names */
import { defineComponent, h } from 'vue';
import { render, screen, within } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { mdiCheck, mdiPlus } from '@lumx/icons';
import { JSXElement, Theme } from '@lumx/vue';

import ButtonTests, { setup } from '@lumx/core/js/components/Button/Tests';
import { CLASSNAME, ButtonProps } from '@lumx/core/js/components/Button/Button';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { provideDisabledState } from '../../composables/useDisabledState';

import { Button } from '.';
import { Text } from '../text';

describe('<Button />', () => {
    const renderComponent = (
        props: ButtonProps & { children?: any },
        options: SetupRenderOptions<ButtonProps> = {},
    ) => {
        const { children, ...restProps } = props;
        return render(Button, {
            props: restProps,
            slots: children ? { default: () => children } : undefined,
            ...options,
        });
    };

    ButtonTests({ render: renderComponent, screen });

    const setupComponent = (props: Partial<ButtonProps> = {}, options: SetupRenderOptions<ButtonProps> = {}) =>
        setup(props, { ...options, render: renderComponent, screen });

    describe('Props', () => {
        it('should render hasBackground', () => {
            const label = 'Label';
            const { buttonWrapper, button } = setupComponent({ children: label, hasBackground: true });
            expect(buttonWrapper).toBeInTheDocument();
            expect(button).toBe(within(buttonWrapper as any).queryByRole('button', { name: label }));
        });

        it('should not wrap Text component children', () => {
            const { button } = setupComponent({
                children: h(Text, { as: 'p' }, { default: () => 'Label' }) as JSXElement,
            });
            expect(button.querySelector('p')).toHaveTextContent('Label');
            expect(button.querySelector('span')).toBeNull();
        });

        it('should emit click event', async () => {
            const { button, wrapper } = setupComponent({ children: 'Label' });
            await userEvent.click(button);
            expect(wrapper.emitted('click')).toHaveLength(1);
        });

        it('should not apply theme to icons', () => {
            const { icons } = setupComponent(
                { leftIcon: mdiCheck, rightIcon: mdiPlus },
                {
                    global: {
                        provide: {
                            theme: Theme.dark,
                        },
                    },
                },
            );
            expect(icons[0]).not.toHaveClass('lumx-icon--theme-dark');
            expect(icons[1]).not.toHaveClass('lumx-icon--theme-dark');
        });
    });

    describe('Disabled state', () => {
        describe('Disabled state', () => {
            it('should render disabled button', async () => {
                const { button, wrapper } = setupComponent({ children: 'Label', disabled: true } as any);
                expect(button).toHaveAttribute('disabled');
                await userEvent.click(button);
                expect(wrapper.emitted('click')).toBeUndefined();
            });

            it('should render disabled link', async () => {
                const { button, wrapper } = setupComponent({
                    children: 'Label',
                    disabled: true,
                    href: 'https://example.com',
                } as any);
                expect(screen.queryByRole('link')).toBeInTheDocument();
                expect(button).toHaveAttribute('aria-disabled', 'true');
                // Simulate standard disabled state (not focusable)
                expect(button).toHaveAttribute('tabindex', '-1');
                await userEvent.click(button);
                expect(wrapper.emitted('click')).toBeUndefined();
            });

            it('should render aria-disabled button', async () => {
                const { button, wrapper } = setupComponent({
                    children: 'Label',
                    'aria-disabled': true,
                    isDisabled: true,
                });
                expect(button).toHaveAttribute('aria-disabled');
                await userEvent.click(button);
                expect(wrapper.emitted('click')).toBeUndefined();
            });

            it('should render aria-disabled link', async () => {
                const { button, wrapper } = setupComponent({
                    children: 'Label',
                    'aria-disabled': true,
                    isDisabled: true,
                    disabled: true,
                    href: 'https://example.com',
                });
                expect(button).toHaveAccessibleName('Label');
                expect(screen.queryByRole('link')).toBeInTheDocument();
                expect(button).toHaveAttribute('aria-disabled', 'true');
                await userEvent.click(button);
                expect(wrapper.emitted('click')).toBeUndefined();
            });
        });

        it('should render disabled button when context is disabled', async () => {
            const { getByRole, emitted } = render(
                defineComponent({
                    template: `
                <Wrapper>
                    <Button>Label</Button>
                </Wrapper>
            `,
                    components: {
                        Button,
                        Wrapper: defineComponent({
                            setup(props, { slots }) {
                                provideDisabledState({ state: 'disabled' });
                                return () => slots.default?.();
                            },
                        }),
                    },
                }),
            );
            const button = getByRole('button', { name: 'Label' });
            expect(button).toHaveAttribute('disabled');
            expect(button).toHaveAttribute('aria-disabled', 'true');
            await userEvent.click(button);
            expect(emitted()).not.toHaveProperty('click');
        });

        it('should render disabled link when context is disabled', async () => {
            const { getByRole, emitted } = render(
                defineComponent({
                    template: `
                <Wrapper>
                    <Button href="https://example.com">Label</Button>
                </Wrapper>
            `,
                    components: {
                        Button,
                        Wrapper: defineComponent({
                            setup(props, { slots }) {
                                provideDisabledState({ state: 'disabled' });
                                return () => slots.default?.();
                            },
                        }),
                    },
                }),
            );
            expect(getByRole('link', { name: 'Label' })).toBeInTheDocument();
            const button = getByRole('link', { name: 'Label' });
            expect(button).toHaveAttribute('aria-disabled', 'true');
            // Simulate standard disabled state (not focusable)
            expect(button).toHaveAttribute('tabindex', '-1');
            await userEvent.click(button);
            expect(emitted()).not.toHaveProperty('click');
        });
    });

    // Common tests suite.
    commonTestsSuiteVTL(setupComponent, {
        baseClassName: CLASSNAME,
        forwardClassName: 'button',
        forwardAttributes: 'button',
        forwardRef: 'button',
        applyTheme: {
            affects: [{ element: 'button' }, { not: { element: 'icons' } }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
            defaultProps: { rightIcon: mdiPlus, leftIcon: mdiCheck },
        },
    });
});
