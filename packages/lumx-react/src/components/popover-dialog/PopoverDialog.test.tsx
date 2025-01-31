import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PopoverDialog } from './PopoverDialog';
import { WithButtonTrigger, WithIconButtonTrigger } from './PopoverDialog.stories';

jest.mock('@lumx/react/utils/browser/isFocusVisible');

describe(`<${PopoverDialog.displayName}>`, () => {
    it('should open and init focus', async () => {
        const label = 'Test Label';
        render(<WithButtonTrigger label={label} />);

        // Open popover
        const triggerElement = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(triggerElement);

        const dialog = await screen.findByRole('dialog', { name: label });

        // Focused the first button
        expect(within(dialog).getAllByRole('button')[0]).toHaveFocus();
    });

    it('should work with aria-label', async () => {
        const label = 'Test Label';
        render(<WithButtonTrigger aria-label={label} />);

        // Open popover
        const triggerElement = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(triggerElement);

        expect(await screen.findByRole('dialog', { name: label })).toBeInTheDocument();
    });

    it('should trap focus', async () => {
        const label = 'Test Label';
        render(<WithButtonTrigger label={label} />);

        // Open popover
        const triggerElement = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(triggerElement);

        const dialog = await screen.findByRole('dialog', { name: label });

        const dialogButtons = within(dialog).getAllByRole('button');

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
    });

    it('should close on escape and restore focus to trigger', async () => {
        const label = 'Test Label';
        render(<WithButtonTrigger label={label} />);

        // Open popover
        const triggerElement = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(triggerElement);

        const dialog = await screen.findByRole('dialog', { name: label });

        // Close the popover
        await userEvent.keyboard('{escape}');

        expect(dialog).not.toBeInTheDocument();

        // Focus restored to the trigger element
        expect(triggerElement).toHaveFocus();
    });

    it('should close externally and restore focus to trigger', async () => {
        const label = 'Test Label';
        render(<WithButtonTrigger label={label} />);

        // Open popover
        const triggerElement = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(triggerElement);

        const dialog = await screen.findByRole('dialog', { name: label });

        // Close the popover
        await userEvent.click(screen.getByRole('button', { name: 'Close' }));

        expect(dialog).not.toBeInTheDocument();

        // Focus restored to the trigger element
        expect(triggerElement).toHaveFocus();
    });

    it('should close on escape and restore focus to trigger having a tooltip', async () => {
        const label = 'Test Label';
        render(<WithIconButtonTrigger label={label} />);

        // Open popover
        const triggerElement = screen.getByRole('button', { name: 'Open popover' });
        await userEvent.click(triggerElement);

        const dialog = await screen.findByRole('dialog', { name: label });

        // Close the popover
        await userEvent.keyboard('{escape}');

        expect(dialog).not.toBeInTheDocument();

        // Focus restored to the trigger element
        expect(triggerElement).toHaveFocus();
    });
});
