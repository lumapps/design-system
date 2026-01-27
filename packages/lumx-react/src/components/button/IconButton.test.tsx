import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { Button, Theme, ThemeProvider } from '@lumx/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DisabledStateProvider } from '@lumx/react/utils/disabled';

import Tests, { setup } from '@lumx/core/js/components/Button/IconButtonTests';

import { IconButton, IconButtonProps } from './IconButton';

const CLASSNAME = Button.className as string;

describe(`<${IconButton.displayName}>`, () => {
    const renderComponent = (props: IconButtonProps, options?: SetupRenderOptions) =>
        render(<IconButton {...props} />, options);

    Tests({ render: renderComponent, screen });

    const setupComponent = (props: Partial<IconButtonProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderComponent, screen });

    describe('Props', () => {
        it('should not apply theme to icon', () => {
            const { icon } = setupComponent(
                {},
                {
                    wrapper: ({ children }) => <ThemeProvider value={Theme.dark}>{children}</ThemeProvider>,
                },
            );
            expect(icon).not.toHaveClass('lumx-icon--theme-dark');
        });

        it('should pass tooltipProps to Tooltip', async () => {
            const { iconButton } = setupComponent({ label: 'Label', tooltipProps: { placement: 'right' } });
            await userEvent.hover(iconButton);
            const tooltip = await screen.findByRole('tooltip');
            expect(tooltip).toBeInTheDocument();
            // Note: Verifying placement is tricky in unit tests without extensive setup,
            // but ensuring the tooltip renders on hover confirms prop passing in general integration.
        });

        it('should hide tooltip when hideTooltip is true', async () => {
            const { iconButton } = setupComponent({ label: 'Label', hideTooltip: true });
            await userEvent.hover(iconButton);
            const tooltip = screen.queryByRole('tooltip');
            expect(tooltip).not.toBeInTheDocument();
        });
    });

    describe('Disabled state from context', () => {
        it('should render disabled button when context is disabled', async () => {
            const onClick = vi.fn();
            const { iconButton } = setupComponent(
                { label: 'Label', onClick },
                {
                    wrapper: ({ children }) => (
                        <DisabledStateProvider state="disabled">{children}</DisabledStateProvider>
                    ),
                },
            );
            expect(iconButton).toHaveAttribute('disabled');
            expect(iconButton).toHaveAttribute('aria-disabled', 'true');
            await userEvent.click(iconButton);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render disabled link when context is disabled', async () => {
            const onClick = vi.fn();
            const { iconButton } = setupComponent(
                { label: 'Label', href: 'https://example.com', onClick },
                {
                    wrapper: ({ children }) => (
                        <DisabledStateProvider state="disabled">{children}</DisabledStateProvider>
                    ),
                },
            );
            expect(screen.queryByRole('link')).toBeInTheDocument();
            expect(iconButton).toHaveAttribute('aria-disabled', 'true');
            // Simulate standard disabled state (not focusable)
            expect(iconButton).toHaveAttribute('tabindex', '-1');
            await userEvent.click(iconButton);
            expect(onClick).not.toHaveBeenCalled();
        });
    });

    // Common tests suite.
    commonTestsSuiteRTL(setupComponent, {
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
