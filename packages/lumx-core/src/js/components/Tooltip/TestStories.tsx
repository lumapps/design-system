import { waitFor, expect, screen } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { TOOLTIP_HOVER_DELAY } from '@lumx/core/js/constants';

const LONG_TEXT = 'Some very very very very very very very very very very long label';

const waitLongerThanOpenDelay = () =>
    new Promise<void>((resolve) => {
        setTimeout(resolve, TOOLTIP_HOVER_DELAY.open + 300);
    });

/**
 * Setup Tooltip test stories (with play functions) for a specific framework (React or Vue).
 * Framework-specific components are injected via options.
 */
export function setup({
    component: Tooltip,
    components: { Button, ToggleTooltip, OverflowTooltip },
}: SetupStoriesOptions<{
    components: { Button: any; ToggleTooltip: any; OverflowTooltip: any };
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

    /** Test: with the keyboard, a function label follows the state that the anchor toggles, and Escape closes it */
    const TestFunctionLabelFollowsKeyboardToggle = {
        render: () => (
            <ToggleTooltip
                getLabel={(isExpanded: boolean) => (isExpanded ? 'Collapse sidebar' : 'Expand sidebar')}
                isFunction
            />
        ),
        async play({ userEvent }: any) {
            await userEvent.tab();
            await screen.findByRole('tooltip', { name: 'Expand sidebar' });

            await userEvent.keyboard('{Enter}');
            await screen.findByRole('tooltip', { name: 'Collapse sidebar' });

            await userEvent.keyboard('{Escape}');
            await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
        },
    };

    /** Test: a string label that empties then comes back (the anchor detaches) */
    const TestStringLabelBackAfterKeyboardToggle = {
        render: () => <ToggleTooltip getLabel={(isExpanded: boolean) => (isExpanded ? '' : 'Publish')} />,
        async play({ canvas, userEvent }: any) {
            await userEvent.tab();
            await screen.findByRole('tooltip', { name: 'Publish' });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());

            await userEvent.tab();
            expect(canvas.getByRole('button', { name: 'Collapse' })).toHaveFocus();
            await userEvent.keyboard('{Enter}');
            await waitLongerThanOpenDelay();
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

            await userEvent.tab({ shift: true });
            await screen.findByRole('tooltip', { name: 'Publish' });
            await userEvent.keyboard('{Escape}');
            await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
        },
    };

    /** Test: a function label that empties then comes back */
    const TestFunctionLabelBackAfterKeyboardToggle = {
        render: () => <ToggleTooltip getLabel={(isExpanded: boolean) => (isExpanded ? '' : 'Publish')} isFunction />,
        async play({ canvas, userEvent }: any) {
            await userEvent.tab();
            await screen.findByRole('tooltip', { name: 'Publish' });

            await userEvent.keyboard('{Enter}');
            await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());

            await userEvent.tab();
            expect(canvas.getByRole('button', { name: 'Collapse' })).toHaveFocus();
            await userEvent.keyboard('{Enter}');
            await waitLongerThanOpenDelay();
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

            await userEvent.tab({ shift: true });
            await screen.findByRole('tooltip', { name: 'Publish' });
            await userEvent.keyboard('{Escape}');
            await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
        },
    };

    const renderOverflowTooltip = ({ text, isHidden }: any) => (
        <div data-testid="container" style={{ width: '150px', display: isHidden ? 'none' : undefined }}>
            <OverflowTooltip text={text} />
        </div>
    );

    /** Test: a truncated label shows its full text in the tooltip */
    const TestOverflowLabel = {
        render: renderOverflowTooltip,
        args: { text: LONG_TEXT },
        async play({ canvas, userEvent }: any) {
            await userEvent.hover(canvas.getByRole('button'));
            expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_TEXT);
        },
    };

    /** Test: a label that fits shows no tooltip */
    const TestNoOverflowLabel = {
        render: renderOverflowTooltip,
        args: { text: 'Short' },
        async play({ canvas, userEvent }: any) {
            await userEvent.hover(canvas.getByRole('button'));
            await waitLongerThanOpenDelay();
            expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
        },
    };

    /** Test: a label that mounts hidden, then shows truncated, gets its tooltip on the first hover */
    const TestOverflowLabelHiddenMount = {
        render: renderOverflowTooltip,
        args: { text: LONG_TEXT, isHidden: true },
        async play({ canvas, userEvent }: any) {
            const container = canvas.getByTestId('container');
            container.style.display = 'block';

            await userEvent.hover(canvas.getByRole('button'));
            expect(await screen.findByRole('tooltip')).toHaveTextContent(LONG_TEXT);
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
        TestFunctionLabelFollowsKeyboardToggle,
        TestStringLabelBackAfterKeyboardToggle,
        TestFunctionLabelBackAfterKeyboardToggle,
        TestOverflowLabel,
        TestNoOverflowLabel,
        TestOverflowLabelHiddenMount,
    };
}
