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
            // The Button.vue logic wraps in span if NOT Text component.
            // If it IS Text component, it returns the slot directly (array of vnodes).
            // So we shouldn't see an intermediate span wrapper around p.
            // However, the button itself contains the content.
            // querySelector('span') checks for ANY span inside.
            // If Text component renders a 'p', and no wrapper, then no span unless Text renders one.
            expect(button.querySelector('span')).toBeNull();
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
        const DisabledStateProvider = defineComponent({
            props: ['state'],
            setup(props, { slots }) {
                provideDisabledState({ state: props.state });
                return () => slots.default?.();
            },
        });

        const renderWithDisabledContext =
            (state: string) =>
            (props: ButtonProps & { children?: any }, options: SetupRenderOptions<ButtonProps> = {}) => {
                const { children, ...restProps } = props;
                return render(DisabledStateProvider, {
                    props: { state },
                    slots: {
                        default: () => h(Button, { ...restProps }, children ? { default: () => children } : undefined),
                    },
                    ...options,
                });
            };

        it('should render disabled button when context is disabled', async () => {
            const onClick = vi.fn();
            const { button } = setup(
                { children: 'Label', onClick },
                {
                    render: renderWithDisabledContext('disabled'),
                    screen,
                },
            );
            expect(button).toHaveAttribute('disabled');
            expect(button).toHaveAttribute('aria-disabled', 'true');
            await userEvent.click(button);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render disabled link when context is disabled', async () => {
            const onClick = vi.fn();
            const { button } = setup(
                { children: 'Label', href: 'https://example.com', onClick },
                {
                    render: renderWithDisabledContext('disabled'),
                    screen,
                },
            );
            expect(screen.queryByRole('link')).toBeInTheDocument();
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
