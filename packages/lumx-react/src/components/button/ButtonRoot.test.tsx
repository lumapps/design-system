import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DisabledStateProvider } from '@lumx/react/utils/disabled';

import Tests, { setup } from '@lumx/core/js/components/Button/ButtonRootTests';

import { ButtonRoot, ButtonRootProps, BUTTON_CLASSNAME } from './ButtonRoot';

describe('<ButtonRoot />', () => {
    const renderComponent = (props: ButtonRootProps, options?: SetupRenderOptions) =>
        render(<ButtonRoot {...props} />, options);

    Tests({ render: renderComponent, screen });

    const setupComponent = (props: Partial<ButtonRootProps> = {}, options: SetupRenderOptions = {}) =>
        setup(props, { ...options, render: renderComponent, screen });

    it('should render as a custom component when linkAs is provided', () => {
        const CustomLink = ({ children, ...props }: any) => (
            <a data-custom="true" {...props}>
                {children}
            </a>
        );
        const { button } = setupComponent({ linkAs: CustomLink });
        expect(button.tagName).toBe('A');
        expect(button).toHaveAttribute('data-custom', 'true');
    });

    it('should call onClick when clicked', async () => {
        const onClick = vi.fn();
        const { button } = setupComponent({ onClick });
        await userEvent.click(button);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    describe('Disabled state from context', () => {
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
        baseClassName: BUTTON_CLASSNAME,
        forwardClassName: 'button',
        forwardAttributes: 'button',
        forwardRef: 'button',
    });
});
