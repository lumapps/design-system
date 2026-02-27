/* eslint-disable vue/one-component-per-file */
/* eslint-disable vue/order-in-components */
/* eslint-disable vue/no-reserved-component-names */
import { defineComponent, ref } from 'vue';

import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';

import IconButtonTests, { setup } from '@lumx/core/js/components/Button/IconButtonTests';
import { CLASSNAME } from '@lumx/core/js/components/Button/Button';
import { IconButtonProps } from '@lumx/core/js/components/Button/IconButton';
import { commonTestsSuiteVTL, SetupRenderOptions } from '@lumx/vue/testing';

import { IconButton } from '.';
import { provideDisabledState } from '../../composables/useDisabledState';

describe('<IconButton />', () => {
    const renderComponent = (props: Partial<IconButtonProps>, options: SetupRenderOptions<IconButtonProps> = {}) => {
        return render(IconButton, {
            props: props as any,
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
            const { iconButton, wrapper } = setupComponent();
            await userEvent.click(iconButton);
            expect(wrapper.emitted('click')).toHaveLength(1);
        });

        it('should show tooltip on hover', async () => {
            const { iconButton } = setupComponent({ label: 'Label' });
            await userEvent.hover(iconButton);
            const tooltip = await screen.findByRole('tooltip');
            expect(tooltip).toBeInTheDocument();
        });

        it('should forward ref to the underlying button element', () => {
            const iconButtonRef = ref<HTMLElement>();
            render(
                defineComponent({
                    components: { IconButton },
                    setup() {
                        return { iconButtonRef };
                    },
                    template: `<IconButton ref="iconButtonRef" label="Icon" />`,
                }),
            );
            // The ref exposes { $el } pointing to the underlying button element,
            // so that @floating-ui/vue can resolve it correctly as an anchor.
            expect((iconButtonRef.value as any)?.$el).toBe(screen.getByRole('button', { name: 'Icon' }));
        });

        it('should hide tooltip when hideTooltip is true', async () => {
            const { iconButton } = setupComponent({ label: 'Label', hideTooltip: true } as any);
            await userEvent.hover(iconButton);
            const tooltip = screen.queryByRole('tooltip');
            expect(tooltip).not.toBeInTheDocument();
        });
    });

    describe('Disabled state', () => {
        describe('Disabled state', () => {
            it('should render disabled button', async () => {
                const { iconButton, wrapper } = setupComponent({ disabled: true });
                expect(iconButton).toHaveAttribute('disabled');
                await userEvent.click(iconButton);
                expect(wrapper.emitted('click')).toBeUndefined();
            });

            it('should render disabled link', async () => {
                const { iconButton, wrapper } = setupComponent({
                    disabled: true,
                    href: 'https://example.com',
                });
                expect(screen.queryByRole('link')).toBeInTheDocument();
                expect(iconButton).toHaveAttribute('aria-disabled', 'true');
                // Simulate standard disabled state (not focusable)
                expect(iconButton).toHaveAttribute('tabindex', '-1');
                await userEvent.click(iconButton);
                expect(wrapper.emitted('click')).toBeUndefined();
            });

            it('should render aria-disabled button', async () => {
                const { iconButton, wrapper } = setupComponent({ 'aria-disabled': true });
                expect(iconButton).toHaveAttribute('aria-disabled');
                await userEvent.click(iconButton);
                expect(wrapper.emitted('click')).toBeUndefined();
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
