/* eslint-disable react-hooks/rules-of-hooks */
import { useRef } from 'react';

import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { mdiClose, mdiMenuDown } from '@lumx/icons';
import { Heading, HeadingLevelProvider } from '@lumx/react';
import { expect, screen, within } from 'storybook/test';
import type { GenericStory } from '@lumx/react/stories/utils/types';

import { PopoverDialog } from '.';
import { Button, IconButton } from '../button';

const IconButtonTrigger = ({ children, ...props }: any) => {
    const anchorRef = useRef(null);
    const [isOpen, close, open] = useBooleanState(false);

    return (
        <>
            <IconButton label="Open popover" ref={anchorRef} onClick={open} icon={mdiMenuDown} />
            <PopoverDialog
                anchorRef={anchorRef}
                isOpen={isOpen}
                onClose={close}
                placement="bottom"
                className="lumx-spacing-padding-huge"
                {...props}
            >
                <IconButton emphasis="low" onClick={close} icon={mdiClose} label="Close" />
                <Button emphasis="medium">Other button</Button>
                {children}
            </PopoverDialog>
        </>
    );
};

export default {
    title: 'LumX components/popover-dialog/PopoverDialog/Tests',
    component: PopoverDialog,
    tags: ['!snapshot'],
    parameters: { chromatic: { disable: true } },
    render: IconButtonTrigger,
};

/** Test: popover dialog opens and focuses the first button */
export const TestOpenAndInitFocus = {
    args: { label: 'Test Label' },
    async play({ userEvent }) {
        const trigger = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(trigger);

        const dialog = await screen.findByRole('dialog', { name: 'Test Label' });
        expect(within(dialog).getAllByRole('button')[0]).toHaveFocus();
    },
} satisfies GenericStory;

/** Test: popover dialog works with aria-label */
export const TestAriaLabel = {
    args: { 'aria-label': 'Custom Label' },
    async play({ userEvent }) {
        await userEvent.click(screen.getByRole('button', { name: 'Open popover' }));
        expect(await screen.findByRole('dialog', { name: 'Custom Label' })).toBeInTheDocument();
    },
} satisfies GenericStory;

/** Test: focus is trapped within the popover dialog */
export const TestTrapFocus = {
    args: { label: 'Test Label' },
    async play({ userEvent }) {
        await userEvent.click(screen.getByRole('button', { name: 'Open popover' }));
        const dialog = await screen.findByRole('dialog', { name: 'Test Label' });
        const dialogButtons = within(dialog).getAllByRole('button');

        // First button should have focus
        expect(dialogButtons[0]).toHaveFocus();

        // Tab to next button
        await userEvent.tab();
        expect(dialogButtons[1]).toHaveFocus();

        // Tab again: focus should loop back to first button
        await userEvent.tab();
        expect(dialogButtons[0]).toHaveFocus();
    },
} satisfies GenericStory;

/** Test: escape closes the dialog and restores focus to trigger */
export const TestCloseOnEscape = {
    args: { label: 'Test Label' },
    async play({ userEvent }) {
        const trigger = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(trigger);

        const dialog = await screen.findByRole('dialog', { name: 'Test Label' });

        await userEvent.keyboard('{Escape}');
        expect(dialog).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    },
} satisfies GenericStory;

/** Test: closing via the Close button restores focus to trigger */
export const TestCloseExternally = {
    args: { label: 'Test Label' },
    async play({ userEvent }) {
        const trigger = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(trigger);

        await screen.findByRole('dialog', { name: 'Test Label' });

        await userEvent.click(screen.getByRole('button', { name: 'Close' }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    },
} satisfies GenericStory;

/** Test: escape closes dialog with icon button trigger and restores focus */
export const TestCloseEscapeWithTooltip = {
    args: { label: 'Test Label' },
    async play({ userEvent }) {
        const trigger = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(trigger);

        const dialog = await screen.findByRole('dialog', { name: 'Test Label' });

        await userEvent.keyboard('{Escape}');
        expect(dialog).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    },
} satisfies GenericStory;

/** Test: heading level context is reset inside the popover dialog */
export const TestHeadingLevelReset = {
    render({ children, ...props }: any) {
        return (
            <HeadingLevelProvider level={3}>
                <IconButtonTrigger {...props}>{children}</IconButtonTrigger>
            </HeadingLevelProvider>
        );
    },
    args: {
        children: <Heading>Title</Heading>,
    },
    async play({ userEvent }) {
        await userEvent.click(screen.getByRole('button', { name: 'Open popover' }));
        // Heading inside the popover dialog should use level 2 (reset from context level 3)
        expect(screen.getByRole('heading', { name: 'Title', level: 2 })).toBeInTheDocument();
    },
} satisfies GenericStory;
