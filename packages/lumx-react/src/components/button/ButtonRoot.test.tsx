import { commonTestsSuiteRTL, SetupRenderOptions } from '@lumx/react/testing/utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getByClassName } from '@lumx/react/testing/utils/queries';
import { DisabledStateProvider } from '@lumx/react/utils/disabled';

import { ButtonRoot, ButtonRootProps, BUTTON_CLASSNAME } from './ButtonRoot';

type SetupProps = Partial<ButtonRootProps>;

/**
 * Mounts the component and returns common DOM elements / data needed in multiple tests further down.
 */
const setup = (propsOverride: SetupProps = {}, { wrapper }: SetupRenderOptions = {}) => {
    const props: any = { ...propsOverride };
    render(<ButtonRoot {...props} variant="button" />, { wrapper });
    const button = getByClassName(document.body, BUTTON_CLASSNAME);
    return { props, button };
};

describe(`<${ButtonRoot.displayName}>`, () => {
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
