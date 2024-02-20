import React, { useRef, useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { WithIconButtonTrigger } from './PopoverDialog.stories';
import { PopoverDialog } from './PopoverDialog';

const DialogWithButton = (forwardedProps: any) => {
    const anchorRef = useRef(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <button type="button" ref={anchorRef} onClick={() => setIsOpen((current) => !current)}>
                Open popover
            </button>

            <PopoverDialog {...forwardedProps} anchorRef={anchorRef} isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <button type="button">Button 1</button>
                <button type="button">Button 2</button>
            </PopoverDialog>
            {/* This should never have focus while popover is opened */}
            <button type="button">External button</button>
        </>
    );
};

describe(`<${PopoverDialog.displayName}>`, () => {
    it('should behave like a dialog', async () => {
        const label = 'Test Label';

        render(<DialogWithButton label={label} />);

        /** Open the popover */
        const triggerElement = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(triggerElement);

        const dialog = await screen.findByRole('dialog', { name: label });
        const withinDialog = within(dialog);

        /** Get buttons within dialog */
        const dialogButtons = withinDialog.getAllByRole('button');

        // First button should have focus by default on opening
        expect(dialogButtons[0]).toHaveFocus();

        // Tab to next button
        await userEvent.tab();

        // Second button should have focus
        expect(dialogButtons[1]).toHaveFocus();

        // Tab to next button
        await userEvent.tab();

        // As there is no more button, focus should loop back to first button.
        expect(dialogButtons[0]).toHaveFocus();

        // Close the popover
        await userEvent.keyboard('{escape}');

        expect(screen.queryByRole('dialog', { name: label })).not.toBeInTheDocument();
        /** Anchor should retrieve the focus */
        expect(triggerElement).toHaveFocus();
    });

    it('should work on icon button', async () => {
        const label = 'Open popover';
        render(<WithIconButtonTrigger />);

        /** Open the popover */
        const triggerElement = screen.getByRole('button', { name: label });
        await userEvent.click(triggerElement);

        const dialog = await screen.findByRole('dialog', { name: label });
        const withinDialog = within(dialog);

        /** Get buttons within dialog */
        const dialogButtons = withinDialog.getAllByRole('button');

        // First button should have focus by default on opening
        expect(dialogButtons[0]).toHaveFocus();

        // Close the popover
        await userEvent.keyboard('{escape}');

        expect(screen.queryByRole('dialog', { name: label })).not.toBeInTheDocument();
        /** Anchor should retrieve the focus */
        expect(triggerElement).toHaveFocus();
    });
});
