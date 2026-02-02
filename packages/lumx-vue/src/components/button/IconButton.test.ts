/* eslint-disable vue/one-component-per-file */
/* eslint-disable vue/order-in-components */
/* eslint-disable vue/no-reserved-component-names */
import { defineComponent } from 'vue';

import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import IconButtonTests, { setup } from '@lumx/core/js/components/Button/IconButtonTests';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { IconButtonProps, IconButton, Button } from '.';
import { provideDisabledState } from '../../composables/useDisabledState';

const CLASSNAME = Button.className as string;

describe('<IconButton />', () => {
    const renderComponent = (props: IconButtonProps, options: SetupRenderOptions<IconButtonProps> = {}) => {
        return render(IconButton, {
            props,
            ...options,
        });
    };

    IconButtonTests({ render: renderComponent, screen });

    const setupComponent = (
        props: Partial<IconButtonProps> = {},
        options: SetupRenderOptions<IconButtonProps> = {},
    ) => {
        const result = setup(props, { ...options, render: renderComponent, screen });
        return result;
    };

    describe('Props', () => {
        it('should call onClick', async () => {
            const onClick = vi.fn();
            const { iconButton } = setupComponent({ onClick });
            await userEvent.click(iconButton);
            expect(onClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('Disabled state', () => {
        describe('Disabled state', () => {
            it('should render disabled button', async () => {
                const onClick = vi.fn();
                const { iconButton } = setupComponent({ disabled: true, onClick } as any);
                expect(iconButton).toHaveAttribute('disabled');
                await userEvent.click(iconButton);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should render disabled link', async () => {
                const onClick = vi.fn();
                const { iconButton } = setupComponent({
                    disabled: true,
                    href: 'https://example.com',
                    onClick,
                } as any);
                expect(screen.queryByRole('link')).toBeInTheDocument();
                expect(iconButton).toHaveAttribute('aria-disabled', 'true');
                // Simulate standard disabled state (not focusable)
                expect(iconButton).toHaveAttribute('tabindex', '-1');
                await userEvent.click(iconButton);
                expect(onClick).not.toHaveBeenCalled();
            });

            it('should render aria-disabled button', async () => {
                const onClick = vi.fn();
                const { iconButton } = setupComponent({ 'aria-disabled': true, onClick });
                expect(iconButton).toHaveAttribute('aria-disabled');
                await userEvent.click(iconButton);
                expect(onClick).not.toHaveBeenCalled();
            });
        });

        it('should render disabled button when context is disabled', async () => {
            const onClick = vi.fn();
            const { getByRole } = render(
                defineComponent({
                    template: `
                <Wrapper>
                    <IconButton @click="onClick" label="Icon" />
                </Wrapper>
            `,
                    components: {
                        IconButton,
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
            const button = getByRole('button');
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
                    <IconButton href="https://example.com" @click="onClick" label="Icon" />
                </Wrapper>
            `,
                    components: {
                        IconButton,
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
            expect(getByRole('link')).toBeInTheDocument();
            const button = getByRole('link');
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
        forwardClassName: 'iconButton',
        forwardAttributes: 'iconButton',
        forwardRef: 'iconButton',
        applyTheme: {
            affects: [{ element: 'iconButton' }],
            viaProp: true,
            viaContext: true,
            defaultTheme: 'light',
        },
    });
});
