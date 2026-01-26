import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { DisabledStateProvider } from '@lumx/react/utils/disabled';
import { ColorPalette, Emphasis, Size, Theme } from '@lumx/react';

import { ButtonRoot, ButtonRootProps, BUTTON_CLASSNAME, BUTTON_WRAPPER_CLASSNAME } from './ButtonRoot';

type SetupProps = Partial<ButtonRootProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { variant: 'button', ...propsOverride };
    render(<ButtonRoot {...props} />, { wrapper });
    const button = getByClassName(document.body, BUTTON_CLASSNAME);
    return { props, button };
};

describe(`<${ButtonRoot.displayName}>`, () => {
    describe('adaptedColor logic', () => {
        it('should use provided color', () => {
            const { button } = setup({ color: ColorPalette.red });
            expect(button).toHaveClass(`${BUTTON_CLASSNAME}--color-red`);
        });

        it('should default to light color when emphasis is not high and theme is dark', () => {
            const { button } = setup({ emphasis: Emphasis.low, theme: Theme.dark });
            expect(button).toHaveClass(`${BUTTON_CLASSNAME}--color-light`);
        });

        it('should default to light color when emphasis is undefined and theme is dark', () => {
            const { button } = setup({ theme: Theme.dark });
            expect(button).toHaveClass(`${BUTTON_CLASSNAME}--color-light`);
        });

        it('should default to primary color when emphasis is high', () => {
            const { button } = setup({ emphasis: Emphasis.high });
            expect(button).toHaveClass(`${BUTTON_CLASSNAME}--color-primary`);
        });

        it('should default to dark color otherwise', () => {
            const { button } = setup();
            expect(button).toHaveClass(`${BUTTON_CLASSNAME}--color-dark`);
        });
    });

    it('should render as a button by default', () => {
        const { button } = setup();
        expect(button.tagName).toBe('BUTTON');
    });

    it('should render as a link when href is provided', () => {
        const { button } = setup({ href: 'https://example.com' });
        expect(button.tagName).toBe('A');
        expect(button).toHaveAttribute('href', 'https://example.com');
    });

    it('should call onClick when clicked', async () => {
        const onClick = vi.fn();
        const { button } = setup({ onClick });
        await userEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should apply the correct class for isSelected', () => {
        const { button } = setup({ isSelected: true });
        expect(button).toHaveClass(`${BUTTON_CLASSNAME}--is-selected`);
    });

    it('should apply the correct class for size', () => {
        const { button } = setup({ size: Size.s });
        expect(button).toHaveClass(`${BUTTON_CLASSNAME}--size-s`);
    });

    it('should apply the correct class for emphasis', () => {
        const { button } = setup({ emphasis: Emphasis.low });
        expect(button).toHaveClass(`${BUTTON_CLASSNAME}--emphasis-low`);
    });

    it('should apply the correct class for variant icon', () => {
        const { button } = setup({ variant: 'icon' });
        expect(button).toHaveClass(`${BUTTON_CLASSNAME}--variant-icon`);
    });

    it('should apply the correct class for fullWidth', () => {
        const { button } = setup({ fullWidth: true });
        expect(button).toHaveClass(`${BUTTON_CLASSNAME}--is-full-width`);
    });

    it('should forward aria-label', () => {
        const { button } = setup({ 'aria-label': 'Close' });
        expect(button).toHaveAttribute('aria-label', 'Close');
    });

    it('should render as a custom component when linkAs is provided', () => {
        const CustomLink = ({ children, ...props }: any) => (
            <a data-custom="true" {...props}>
                {children}
            </a>
        );
        const { button } = setup({ linkAs: CustomLink });
        expect(button.tagName).toBe('A');
        expect(button).toHaveAttribute('data-custom', 'true');
    });

    it('should render a wrapper when hasBackground is true', () => {
        render(<ButtonRoot variant="button" hasBackground />);
        const wrapper = document.querySelector(`.${BUTTON_WRAPPER_CLASSNAME}`);
        expect(wrapper).toBeInTheDocument();
        expect(wrapper).toHaveClass(`${BUTTON_WRAPPER_CLASSNAME}--variant-button`);
    });

    describe('Disabled state from context', () => {
        it('should render disabled button when context is disabled', async () => {
            const onClick = vi.fn();
            const { button } = setup(
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
            const { button } = setup(
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
    commonTestsSuiteRTL(setup, {
        baseClassName: BUTTON_CLASSNAME,
        forwardClassName: 'button',
        forwardAttributes: 'button',
        forwardRef: 'button',
    });
});
