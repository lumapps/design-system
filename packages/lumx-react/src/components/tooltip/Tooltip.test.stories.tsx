import { useState, useRef } from 'react';
import range from 'lodash/range';
import { waitFor, expect, screen } from 'storybook/test';
import { Button, Dialog, Dropdown, FlexBox } from '@lumx/react';
import type { GenericStory } from '@lumx/react/stories/utils/types';

import { Tooltip } from '.';

export default {
    title: 'LumX components/tooltip/Tooltip/Tests',
    component: Tooltip,
    tags: ['!snapshot'],
    parameters: { chromatic: { disableSnapshot: true } },
};

/** Tooltip should hide when a dropdown opens and should work in a scroll context */
export const TestTooltipWithDropdownAndScroll = (props: any) => {
    const anchorRef = useRef<HTMLButtonElement>(null);
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            {range(200).map((i) => (
                <br key={i} />
            ))}
            <FlexBox style={{ position: 'fixed', top: 20 }} orientation="horizontal" gap="big">
                <Tooltip label={!isOpen && 'Tooltip'} {...props} placement="bottom">
                    <Button ref={anchorRef} onClick={() => setOpen((o) => !o)}>
                        Anchor
                    </Button>
                </Tooltip>
                <small>
                    Tooltips should close when attached popover/dropdown opens. <br />
                    It should also keep displaying while scrolling (here on a position: fixed button)
                </small>
            </FlexBox>
            <Dropdown anchorRef={anchorRef} isOpen={isOpen} onClose={() => setOpen(false)}>
                Dropdown
            </Dropdown>
        </>
    );
};

/** Tooltip should hide when the anchor is hidden */
export const HideTooltipOnHiddenAnchor = () => {
    const [isOpen, setOpen] = useState(false);
    return (
        <>
            The tooltip should show when the button is hovered but it should disappear when the dialog get in-between
            the mouse and the button
            <br />
            <Tooltip label="Tooltip label">
                <Button onClick={() => setOpen((wasOpen) => !wasOpen)}>Open dialog</Button>
            </Tooltip>
            <Dialog isOpen={isOpen} onClose={() => setOpen(false)}>
                Dialog
            </Dialog>
        </>
    );
};

/** Test focusing a tooltip anchor programmatically */
export const TestProgrammaticFocus = () => {
    const anchorRef = useRef<HTMLButtonElement>(null);
    return (
        <>
            <p>The tooltip should open on keyboard focus but not on programmatic focus (ex: after a click)</p>
            <Tooltip label="label">
                <Button ref={anchorRef}>button with label</Button>
            </Tooltip>
            <Button onClick={() => anchorRef.current?.focus()}>focus the button</Button>
        </>
    );
};

/** Test: tooltip activates on anchor hover and closes on unhover */
export const TestActivateOnHover = {
    args: {
        label: 'Tooltip label',
        children: <Button>Anchor</Button>,
    },
    async play({ canvas, userEvent }) {
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
} satisfies GenericStory;

/** Test: tooltip stays open when hovering from anchor to tooltip */
export const TestHoverAnchorThenTooltip = {
    args: {
        label: 'Tooltip label',
        children: <Button>Anchor</Button>,
    },
    async play({ canvas, userEvent }) {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

        const button = canvas.getByRole('button', { name: 'Anchor' });

        // Hover anchor button
        await userEvent.hover(button);
        const tooltip = await screen.findByRole('tooltip', { name: 'Tooltip label' });
        expect(tooltip).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-describedby', tooltip.id);

        // Hover tooltip (should stay open)
        await userEvent.hover(tooltip);
        expect(tooltip).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-describedby', tooltip.id);

        // Unhover tooltip
        await userEvent.unhover(tooltip);
        await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    },
} satisfies GenericStory;

/** Test: tooltip activates on keyboard focus-visible and closes on escape */
export const TestFocusVisibleAndEscape = {
    args: {
        label: 'Tooltip label',
        children: <Button>Anchor</Button>,
    },
    async play({ canvas, userEvent }) {
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

        // Tab to focus the button (keyboard focus => focus-visible)
        await userEvent.tab();
        const button = canvas.getByRole('button', { name: 'Anchor' });
        expect(button).toHaveFocus();

        // Tooltip should open
        const tooltip = await screen.findByRole('tooltip', { name: 'Tooltip label' });
        expect(tooltip).toBeInTheDocument();
        expect(button).toHaveAttribute('aria-describedby', tooltip.id);

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
} satisfies GenericStory;

/** Test: click-focus (not focus-visible) should NOT activate tooltip */
export const TestNoActivateOnClickFocus = {
    args: {
        label: 'Tooltip label',
        children: <Button>Anchor</Button>,
    },
    async play({ canvas, userEvent }) {
        const button = canvas.getByRole('button', { name: 'Anchor' });

        // Click focuses the button (mouse focus, not :focus-visible)
        await userEvent.click(button);

        // Tooltip should NOT open (click-focus is not focus-visible)
        await expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    },
} satisfies GenericStory;

/** Test: closeMode="hide" keeps the tooltip in the DOM but visually hidden */
export const TestCloseModeHide = {
    args: {
        label: 'Tooltip label',
        children: <Button>Anchor</Button>,
        closeMode: 'hide',
    },
    async play({ canvas, userEvent }) {
        // Tooltip should be in DOM but not visible
        const tooltip = screen.getByRole('tooltip', { hidden: true });
        expect(tooltip).toBeInTheDocument();

        // Hover to open
        const button = canvas.getByRole('button', { name: 'Anchor' });
        await userEvent.hover(button);
        await waitFor(() => expect(tooltip).toBeVisible());
    },
} satisfies GenericStory;

/** Test: aria-describedby is set on button anchor when tooltip opens via hover */
export const TestAriaDescribedByOnHover = {
    args: {
        label: 'Tooltip label',
        children: <Button aria-describedby=":description1:">Anchor</Button>,
    },
    async play({ canvas, userEvent }) {
        const anchor = canvas.getByRole('button', { name: 'Anchor' });
        expect(anchor).toHaveAttribute('aria-describedby', ':description1:');

        await userEvent.hover(anchor);
        const tooltip = await screen.findByRole('tooltip');
        expect(anchor).toHaveAttribute('aria-describedby', `:description1: ${tooltip.id}`);
    },
} satisfies GenericStory;

/** Test: aria-describedby is set on wrapper anchor when tooltip opens via hover */
export const TestAriaDescribedByOnWrapperHover = {
    render(props: any) {
        return (
            <Tooltip {...props} label="Tooltip label">
                Anchor
            </Tooltip>
        );
    },
    async play({ canvasElement, userEvent }) {
        const anchorWrapper = canvasElement.querySelector('.lumx-tooltip-anchor-wrapper');
        expect(anchorWrapper).toBeInTheDocument();
        expect(anchorWrapper).not.toHaveAttribute('aria-describedby');

        await userEvent.hover(anchorWrapper!);
        const tooltip = await screen.findByRole('tooltip');
        expect(anchorWrapper).toHaveAttribute('aria-describedby', tooltip.id);
    },
} satisfies GenericStory;

/** Test: aria-labelledby is set on button anchor when tooltip opens via hover */
export const TestAriaLabelledByOnHover = {
    args: {
        label: 'Tooltip label',
        children: <Button aria-labelledby=":label1:">Anchor</Button>,
        ariaLinkMode: 'aria-labelledby',
    },
    async play({ canvas, userEvent }) {
        const anchor = canvas.getByRole('button', { name: 'Anchor' });
        expect(anchor).toHaveAttribute('aria-labelledby', ':label1:');

        await userEvent.hover(anchor);
        const tooltip = await screen.findByRole('tooltip');
        expect(anchor).toHaveAttribute('aria-labelledby', `:label1: ${tooltip.id}`);
    },
} satisfies GenericStory;

/** Test: aria-labelledby is set on wrapper anchor when tooltip opens via hover */
export const TestAriaLabelledByOnWrapperHover = {
    render(props: any) {
        return (
            <Tooltip {...props} label="Tooltip label" ariaLinkMode="aria-labelledby">
                Anchor
            </Tooltip>
        );
    },
    async play({ canvasElement, userEvent }) {
        const anchorWrapper = canvasElement.querySelector('.lumx-tooltip-anchor-wrapper');
        expect(anchorWrapper).toBeInTheDocument();
        expect(anchorWrapper).not.toHaveAttribute('aria-labelledby');

        await userEvent.hover(anchorWrapper!);
        const tooltip = await screen.findByRole('tooltip');
        expect(anchorWrapper).toHaveAttribute('aria-labelledby', tooltip.id);
    },
} satisfies GenericStory;
