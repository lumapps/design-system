import { defineComponent, h } from 'vue';
import { render, screen, within } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { mdiCheck, mdiPlus } from '@lumx/icons';
import { JSXElement, Theme } from '@lumx/vue';

import ButtonTests, { setup } from '@lumx/core/js/components/Button/Tests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';
import { provideDisabledState } from '../../composables/useDisabledState';

import { Button, ButtonProps } from '.';
import { Text } from '../text';

const CLASSNAME = Button.className as string;

describe('<Button />', () => {
    const renderComponent = (props: ButtonProps & { children?: any }, options: SetupRenderOptions<ButtonProps> = {}) => {
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

        it('should call onClick', async () => {
            const onClick = vi.fn();
            const { button } = setupComponent({ onClick });
            await userEvent.click(button);
            expect(onClick).toHaveBeenCalledTimes(1);
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
                const onClick = vi.fn();
                const { button } = setupComponent({ children: 'Label', disabled: true, onClick } as any);
                expect(button).toHaveAttribute('disabled');
                await userEvent.click(button);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should render disabled link', async () => {
                const onClick = vi.fn();
                const { button } = setupComponent({
                    children: 'Label',
                    disabled: true,
                    href: 'https://example.com',
                    onClick,
                } as any);
                expect(screen.queryByRole('link')).toBeInTheDocument();
                expect(button).toHaveAttribute('aria-disabled', 'true');
                // Simulate standard disabled state (not focusable)
                expect(button).toHaveAttribute('tabindex', '-1');
                await userEvent.click(button);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should render aria-disabled button', async () => {
                const onClick = vi.fn();
                const { button } = setupComponent({ children: 'Label', 'aria-disabled': true, onClick });
                expect(button).toHaveAttribute('aria-disabled');
                await userEvent.click(button);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should render aria-disabled link', async () => {
                const onClick = vi.fn();
                const { button } = setupComponent({
                    children: 'Label',
                    'aria-disabled': true,
                    href: 'https://example.com',
                    onClick,
                });
                expect(button).toHaveAccessibleName('Label');
                expect(screen.queryByRole('link')).toBeInTheDocument();
                expect(button).toHaveAttribute('aria-disabled', 'true');
                await userEvent.click(button);
                expect(onClick).not.toHaveBeenCalled();
            });
        });

        it('should render disabled button when context is disabled', async () => {
            const onClick = vi.fn();
            const { getByRole } = render(
                defineComponent({
                    template: `
                <Wrapper>
                    <Button @click="onClick">Label</Button>
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
                    setup() {
                        return { onClick };
                    },
                }),
            );
            const button = getByRole('button', { name: 'Label' });
            expect(button).toHaveAttribute('disabled');
            expect(button).toHaveAttribute('aria-disabled', 'true');
            await userEvent.click(button);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render disabled link when context is disabled', async () => {
            const onClick = vi.fn();
            const { getByRole } = render(
                defineComponent({
                    template: `
                <Wrapper>
                    <Button href="https://example.com" @click="onClick">Label</Button>
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
                    setup() {
                        return { onClick };
                    },
                }),
            );
            expect(getByRole('link', { name: 'Label' })).toBeInTheDocument();
            const button = getByRole('link', { name: 'Label' });
            expect(button).toHaveAttribute('aria-disabled', 'true');
            // Simulate standard disabled state (not focusable)
            expect(button).toHaveAttribute('tabindex', '-1');
            await userEvent.click(button);
            expect(onClick).not.toHaveBeenCalled();
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
