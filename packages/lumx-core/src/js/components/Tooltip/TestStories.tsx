import { waitFor, expect, screen } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

/**
 * Setup Tooltip test stories (with play functions) for a specific framework (React or Vue).
 * Framework-specific components (Button) are injected via options.
 */
export function setup({
    component: Tooltip,
    components: { Button },
}: SetupStoriesOptions<{
    components: { Button: any };
}>) {
    /** Common render: Tooltip wrapping a Button anchor */
    const renderTooltipOnButton = ({ children, ...args }: any) => (
        <Tooltip {...args}>
            <Button>Anchor</Button>
        </Tooltip>
    );

    const meta = {
        component: Tooltip,
        tags: ['!snapshot'],
        parameters: { chromatic: { disableSnapshot: true } },
    };

    /** Test: tooltip activates on anchor hover and closes on unhover */
    const TestActivateOnHover = {
        render: renderTooltipOnButton,
        args: { label: 'Tooltip label' },
        async play({ canvas, userEvent }: any) {
            // Initially no tooltip
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

            const button = canvas.getByRole('button', { name: 'Anchor' });

            // Hover anchor button
            await userEvent.hover(button);
            const tooltip = await screen.findByRole('tooltip', { name: 'Tooltip label' });
            expect(tooltip).toBeInTheDocument();

            // Unhover anchor button
            await userEvent.unhover(button);
            await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
        },
    };

    /** Test: tooltip stays open when hovering from anchor to tooltip */
    const TestHoverAnchorThenTooltip = {
        render: renderTooltipOnButton,
        args: { label: 'Tooltip label' },
        async play({ canvas, userEvent }: any) {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

            const button = canvas.getByRole('button', { name: 'Anchor' });

            // Hover anchor button
            await userEvent.hover(button);
            const tooltip = await screen.findByRole('tooltip', { name: 'Tooltip label' });
            expect(tooltip).toBeInTheDocument();

            // Hover tooltip (should stay open)
            await userEvent.hover(tooltip);
            expect(tooltip).toBeInTheDocument();

            // Unhover tooltip
            await userEvent.unhover(tooltip);
            await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
        },
    };

    /** Test: tooltip activates on keyboard focus-visible and closes on escape */
    const TestFocusVisibleAndEscape = {
        render: renderTooltipOnButton,
        args: { label: 'Tooltip label' },
        async play({ canvas, userEvent }: any) {
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

            // Tab to focus the button (keyboard focus => focus-visible)
            await userEvent.tab();
            const button = canvas.getByRole('button', { name: 'Anchor' });
            expect(button).toHaveFocus();

            // Tooltip should open
            const tooltip = await screen.findByRole('tooltip', { name: 'Tooltip label' });
            expect(tooltip).toBeInTheDocument();

            // Tab away => tooltip closes
            await userEvent.tab();
            expect(button).not.toHaveFocus();
            await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());

            // Shift+tab back => tooltip opens again
            await userEvent.tab({ shift: true });
            await screen.findByRole('tooltip', { name: 'Tooltip label' });

            // Escape => tooltip closes
            await userEvent.keyboard('{Escape}');
            await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
        },
    };

    /** Test: click-focus (not focus-visible) should NOT activate tooltip */
    const TestNoActivateOnClickFocus = {
        render: renderTooltipOnButton,
        args: { label: 'Tooltip label' },
        async play({ canvas, userEvent }: any) {
            const button = canvas.getByRole('button', { name: 'Anchor' });

            // Click focuses the button (mouse focus, not :focus-visible)
            await userEvent.click(button);

            // Tooltip should NOT open (click-focus is not focus-visible)
            await expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        },
    };

    /** Test: closeMode="hide" keeps the tooltip in the DOM but visually hidden */
    const TestCloseModeHide = {
        render: renderTooltipOnButton,
        args: { label: 'Tooltip label', closeMode: 'hide' },
        async play({ canvas, userEvent }: any) {
            // Tooltip should be in DOM but not visible
            const tooltip = screen.getByRole('tooltip', { hidden: true });
            expect(tooltip).toBeInTheDocument();

            // Hover to open
            const button = canvas.getByRole('button', { name: 'Anchor' });
            await userEvent.hover(button);
            await waitFor(() => expect(tooltip).toBeVisible());
        },
    };

    /** Test: aria-describedby is set on button anchor when tooltip opens via hover */
    const TestAriaDescribedByOnHover = {
        render: ({ children, ...args }: any) => (
            <Tooltip {...args} label="Tooltip label">
                <Button aria-describedby=":description1:">Anchor</Button>
            </Tooltip>
        ),
        async play({ canvas, userEvent }: any) {
            const anchor = canvas.getByRole('button', { name: 'Anchor' });
            expect(anchor).toHaveAttribute('aria-describedby', ':description1:');

            await userEvent.hover(anchor);
            const tooltip = await screen.findByRole('tooltip');
            expect(anchor).toHaveAttribute('aria-describedby', `:description1: ${tooltip.id}`);
        },
    };

    /** Test: aria-describedby is set on wrapper anchor when tooltip opens via hover */
    const TestAriaDescribedByOnWrapperHover = {
        render(props: any) {
            return (
                <Tooltip {...props} label="Tooltip label">
                    Anchor
                </Tooltip>
            );
        },
        async play({ canvasElement, userEvent }: any) {
            const anchorWrapper = canvasElement.querySelector('.lumx-tooltip-anchor-wrapper');
            expect(anchorWrapper).toBeInTheDocument();
            expect(anchorWrapper).not.toHaveAttribute('aria-describedby');

            await userEvent.hover(anchorWrapper!);
            const tooltip = await screen.findByRole('tooltip');
            expect(anchorWrapper).toHaveAttribute('aria-describedby', tooltip.id);
        },
    };

    /** Test: aria-labelledby is set on button anchor when tooltip opens via hover */
    const TestAriaLabelledByOnHover = {
        render: ({ children, ...args }: any) => (
            <Tooltip {...args} label="Tooltip label" ariaLinkMode="aria-labelledby">
                <Button aria-labelledby=":label1:">Anchor</Button>
            </Tooltip>
        ),
        async play({ canvas, userEvent }: any) {
            const anchor = canvas.getByRole('button', { name: 'Anchor' });
            expect(anchor).toHaveAttribute('aria-labelledby', ':label1:');

            await userEvent.hover(anchor);
            const tooltip = await screen.findByRole('tooltip');
            expect(anchor).toHaveAttribute('aria-labelledby', `:label1: ${tooltip.id}`);
        },
    };

    /** Test: aria-labelledby is set on wrapper anchor when tooltip opens via hover */
    const TestAriaLabelledByOnWrapperHover = {
        render(props: any) {
            return (
                <Tooltip {...props} label="Tooltip label" ariaLinkMode="aria-labelledby">
                    Anchor
                </Tooltip>
            );
        },
        async play({ canvasElement, userEvent }: any) {
            const anchorWrapper = canvasElement.querySelector('.lumx-tooltip-anchor-wrapper');
            expect(anchorWrapper).toBeInTheDocument();
            expect(anchorWrapper).not.toHaveAttribute('aria-labelledby');

            await userEvent.hover(anchorWrapper!);
            const tooltip = await screen.findByRole('tooltip');
            expect(anchorWrapper).toHaveAttribute('aria-labelledby', tooltip.id);
        },
    };

    return {
        meta,
        TestActivateOnHover,
        TestHoverAnchorThenTooltip,
        TestFocusVisibleAndEscape,
        TestNoActivateOnClickFocus,
        TestCloseModeHide,
        TestAriaDescribedByOnHover,
        TestAriaDescribedByOnWrapperHover,
        TestAriaLabelledByOnHover,
        TestAriaLabelledByOnWrapperHover,
    };
}
