import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { Combobox, WithGrid } from './useVirtualFocus.stories';

describe('useVirtualFocus', () => {
    it('should navigate combobox', async () => {
        const user = userEvent.setup();
        render(<Combobox />);

        const focusBefore = screen.getByRole('button', { name: /Focus before/i });
        focusBefore.focus();

        const focusAfter = screen.getByRole('button', { name: /Focus after/i });

        const combobox = screen.getByRole('combobox');

        // Focusing combobox
        await user.tab();
        expect(combobox).toHaveFocus();
        expect(combobox).toHaveAttribute('aria-expanded', 'false');
        expect(combobox).toHaveAttribute('aria-activedescendant');

        // Open combobox
        await user.keyboard('[Enter]');
        expect(combobox).toHaveFocus();
        await screen.findByText('Option 1');
        expect(combobox).toHaveAttribute('aria-expanded', 'true');
        expect(combobox).not.toHaveAttribute('aria-activedescendant');

        // Move down
        await user.keyboard('[ArrowDown]');
        await waitFor(() => {
            expect(combobox).toHaveAttribute('aria-activedescendant', 'option-1');
        });

        // Select option
        expect(combobox).toHaveAttribute('aria-activedescendant', 'option-1');

        // Move down
        await user.keyboard('[ArrowDown]');
        await waitFor(() => {
            expect(combobox).toHaveAttribute('aria-activedescendant', 'option-2');
        });

        // Select option
        await user.keyboard('[Enter]');
        expect(combobox).toHaveFocus();
        expect(combobox).toHaveTextContent('Option 2');
        expect(combobox).toHaveAttribute('aria-expanded', 'false');
        expect(combobox).toHaveAttribute('aria-activedescendant');

        // Re-Open combobox
        await user.keyboard('[Space]');
        expect(combobox).toHaveAttribute('aria-expanded', 'true');
        expect(combobox).toHaveAttribute('aria-activedescendant', 'option-2');
        expect(screen.queryByRole('option', { name: 'Option 2' })).toHaveAttribute('aria-selected', 'true');

        // Focus after
        await user.tab();
        expect(focusAfter).toHaveFocus();
    });

    it('should handle grid first focus', async () => {
        const user = userEvent.setup();
        render(<WithGrid />);

        const input = screen.getByRole('combobox');

        await user.type(input, 'test');
        /** Moving left and right should not set an active descendant */
        await user.keyboard('{ArrowLeft>3}');
        expect(input).toHaveAttribute('aria-activedescendant', '');
        await user.keyboard('{ArrowRight>3}');
        expect(input).toHaveAttribute('aria-activedescendant', '');

        /** Moving down should start highlighting descendants  */
        await user.keyboard('{ArrowDown}');
        await waitFor(() => {
            expect(input).toHaveAttribute('aria-activedescendant', 'option-1');
        });

        /** Moving left and right should now move within the descendants  */
        await user.keyboard('{ArrowRight}');
        await waitFor(() => {
            expect(input).toHaveAttribute('aria-activedescendant', 'option-2');
        });

        await user.keyboard('{ArrowLeft}');
        await waitFor(() => {
            expect(input).toHaveAttribute('aria-activedescendant', 'option-1');
        });
    });
});
