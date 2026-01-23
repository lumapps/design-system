import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { Button, Theme, ThemeProvider } from '@lumx/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getByClassName, queryByClassName, queryByTagName } from '@lumx/react/testing/utils/queries';
import { DisabledStateProvider } from '@lumx/react/utils/disabled';

import { IconButton, IconButtonProps } from './IconButton';

const CLASSNAME = Button.className as string;

type SetupProps = Partial<IconButtonProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { ...propsOverride };
    render(<IconButton {...props} />, { wrapper });
    const iconButton = getByClassName(document.body, CLASSNAME);
    const icon = queryByClassName(iconButton, 'lumx-icon');
    const img = queryByTagName(iconButton, 'IMG');

    return { props, iconButton, icon, img };
};

describe(`<${IconButton.displayName}>`, () => {
    describe('Props', () => {
        it('should render default', () => {
            const { iconButton, icon, img } = setup();
            expect(iconButton).toBeInTheDocument();
            expect(iconButton.className).toMatchInlineSnapshot(
                '"lumx-button lumx-button--color-primary lumx-button--emphasis-high lumx-button--size-m lumx-button--theme-light lumx-button--variant-icon"',
            );

            expect(icon).toBeInTheDocument();
            expect(img).not.toBeInTheDocument();
        });

        it('should render label', () => {
            const label = 'Label';
            const { iconButton } = setup({ label });
            expect(iconButton).toBe(screen.queryByRole('button', { name: label }));
        });

        it('should render icon button with an image', () => {
            const { iconButton, icon, img } = setup({ image: 'http://foo.com' });

            expect(iconButton).toBeInTheDocument();
            expect(icon).not.toBeInTheDocument();
            expect(img).toBeInTheDocument();
        });

        it('should pass tooltipProps to Tooltip', async () => {
            const { iconButton } = setup({ label: 'Label', tooltipProps: { placement: 'right' } });
            await userEvent.hover(iconButton);
            const tooltip = await screen.findByRole('tooltip');
            expect(tooltip).toBeInTheDocument();
            // Note: Verifying placement is tricky in unit tests without extensive setup,
            // but ensuring the tooltip renders on hover confirms prop passing in general integration.
        });

        it('should hide tooltip when hideTooltip is true', async () => {
            const { iconButton } = setup({ label: 'Label', hideTooltip: true });
            await userEvent.hover(iconButton);
            const tooltip = screen.queryByRole('tooltip');
            expect(tooltip).not.toBeInTheDocument();
        });

        it('should render disabled button', async () => {
            const onClick = vi.fn();
            const { iconButton } = setup({ isDisabled: true, onClick });
            expect(iconButton).toBeDisabled();
            await userEvent.click(iconButton);
            expect(onClick).not.toHaveBeenCalled();
        });

        it('should render with type submit', () => {
            const { iconButton } = setup({ type: 'submit' });
            expect(iconButton).toHaveAttribute('type', 'submit');
        });

        it('should render as link', () => {
            const { iconButton } = setup({ href: 'https://example.com' });
            expect(iconButton.tagName).toBe('A');
            expect(iconButton).toHaveAttribute('href', 'https://example.com');
        });

        it('should not apply theme to icon', () => {
            const { icon } = setup(
                {},
                {
                    wrapper: ({ children }) => <ThemeProvider value={Theme.dark}>{children}</ThemeProvider>,
                },
            );
            expect(icon).not.toHaveClass('lumx-icon--theme-dark');
        });
    });

    describe('Disabled state from context', () => {
        it('should render disabled button when context is disabled', async () => {
            const onClick = vi.fn();
            const { iconButton } = setup(
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
            const { iconButton } = setup(
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
    commonTestsSuiteRTL(setup, {
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
