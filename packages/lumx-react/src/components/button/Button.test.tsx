import { mdiCheck, mdiPlus } from '@lumx/icons';
import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Text, Theme, ThemeProvider } from '@lumx/react';
import { DisabledStateProvider } from '@lumx/react/utils/disabled';
import Tests, { setup } from '@lumx/core/js/components/Button/Tests';

import { Button, ButtonProps } from './Button';

const CLASSNAME = Button.className as string;

describe(`<${Button.displayName}>`, () => {
    const renderComponent = (props: ButtonProps, options?: SetupRenderOptions) =>
        render(<Button {...props} />, options);

    Tests({ render: renderComponent, screen });

    const setupComponent = (props: Partial<ButtonProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderComponent, screen });

    describe('Props', () => {
        it('should render hasBackground', () => {
            const label = 'Label';
            const { buttonWrapper, button } = setupComponent({ children: label, hasBackground: true });
            expect(buttonWrapper).toBeInTheDocument();
            expect(button).toBe(within(buttonWrapper as any).queryByRole('button', { name: label }));
        });

        it('should not wrap Text component children', () => {
            const { button } = setupComponent({ children: <Text as="p">Label</Text> });
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
                    wrapper: ({ children }) => <ThemeProvider value={Theme.dark}>{children}</ThemeProvider>,
                },
            );
            expect(icons[0]).not.toHaveClass('lumx-icon--theme-dark');
            expect(icons[1]).not.toHaveClass('lumx-icon--theme-dark');
        });
    });

    describe('Disabled state', () => {
        it('should render disabled button', async () => {
            const onClick = vi.fn();
            const { button } = setupComponent({ children: 'Label', disabled: true, onClick });
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
            });
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

        it('should render disabled button when context is disabled', async () => {
            const onClick = vi.fn();
            const { button } = setupComponent(
                { children: 'Label', onClick },
                {
                    wrapper: ({ children }) => (
                        <DisabledStateProvider state="disabled">{children}</DisabledStateProvider>
                    ),
                },
            );
            expect(button).toHaveAttribute('disabled');
            expect(button).toHaveAttribute('aria-disabled', 'true');
            await userEvent.click(button);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render disabled link when context is disabled', async () => {
            const onClick = vi.fn();
            const { button } = setupComponent(
                { children: 'Label', href: 'https://example.com', onClick },
                {
                    wrapper: ({ children }) => (
                        <DisabledStateProvider state="disabled">{children}</DisabledStateProvider>
                    ),
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
    commonTestsSuiteRTL(setupComponent, {
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
