import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { List, Grid } from './useRovingTabIndex.stories';

describe('useRovingTabIndex', () => {
    describe('List navigation', () => {
        it('should navigate list without start loop', async () => {
            const user = userEvent.setup({ delay: null });
            render(<List loopAround={false} />);
            const button1 = screen.getByRole('button', { name: /Button 1/i });

            await waitFor(() => {
                button1.focus();
                expect(button1).toHaveFocus();
            });

            // Try to move to previous, focus should not have changed.
            await user.keyboard('[ArrowLeft]');
            expect(button1).toHaveFocus();
        });

        it('should navigate list without end loop', async () => {
            const user = userEvent.setup({ delay: null });
            render(<List loopAround={false} />);
            const button4 = screen.getByRole('button', { name: /Button 4/i });

            await waitFor(() => {
                button4.focus();
                expect(button4).toHaveFocus();
            });

            // Try to move next, focus should not have changed.
            await user.keyboard('[ArrowRight]');
            expect(button4).toHaveFocus();
        });

        it('should navigate list with loop around', async () => {
            const user = userEvent.setup({ delay: null });
            render(<List loopAround />);
            const button1 = screen.getByRole('button', { name: /Button 1/i });
            const button4 = screen.getByRole('button', { name: /Button 4/i });

            await waitFor(() => {
                button1.focus();
                expect(button1).toHaveFocus();
            });

            // Move previous (loop around to the end)
            await user.keyboard('[ArrowLeft]');
            expect(button4).toHaveFocus();

            // Move next (loop around to the beginning)
            await user.keyboard('[ArrowRight]');
            expect(button1).toHaveFocus();
        });

        it('should navigate vertical list with loop around', async () => {
            const user = userEvent.setup({ delay: null });
            render(<List direction="vertical" loopAround />);
            const button1 = screen.getByRole('button', { name: /Button 1/i });
            const button2 = screen.getByRole('button', { name: /Button 2/i });
            const button4 = screen.getByRole('button', { name: /Button 4/i });

            await waitFor(() => {
                button1.focus();
                expect(button1).toHaveFocus();
            });

            // Move down (same as move right)
            await user.keyboard('[ArrowDown]');
            expect(button2).toHaveFocus();

            // Move up (same as move left)
            await user.keyboard('[ArrowUp]');
            expect(button1).toHaveFocus();

            // Move up (loop around)
            await user.keyboard('[ArrowUp]');
            expect(button4).toHaveFocus();

            // Move down (loop around)
            await user.keyboard('[ArrowDown]');
            expect(button1).toHaveFocus();
        });

        it('should focus correct element with autofocus', async () => {
            render(<List autofocusIndex={1} />);
            await waitFor(() => {
                expect(screen.getByRole('button', { name: /Button 2/i })).toHaveFocus();
            });
        });
    });

    describe('Grid navigation', () => {
        const getButton = (rowIndew: number, index: number) =>
            screen.getByRole('gridcell', { name: `Button ${rowIndew}-${index}` });

        it('should navigate incomplete grid with jump shortcuts', async () => {
            const user = userEvent.setup({ delay: null });
            render(<Grid complete={false} loopAround />);

            const focusBefore = screen.getByRole('button', { name: /Focus before/i });
            focusBefore.focus();

            const focusAfter = screen.getByRole('button', { name: /Focus after/i });

            // Focusing first element
            await user.tab();
            expect(getButton(0, 0)).toHaveFocus();

            // Move to end of row
            await user.keyboard('[End]');
            expect(getButton(0, 2)).toHaveFocus();

            // Move to end of grid
            await user.keyboard('[ControlRight>][End]');
            expect(getButton(2, 1)).toHaveFocus();

            // Release Control key
            await user.keyboard('[/ControlRight]');

            // Move to beginning of row
            await user.keyboard('[Home]');
            expect(getButton(2, 0)).toHaveFocus();

            // Move to beginning of grid
            await user.keyboard('[ControlRight>][Home]');
            expect(getButton(0, 0)).toHaveFocus();

            // Focus outside
            await user.keyboard('[ArrowRight][ArrowRight]');
            expect(getButton(0, 2)).toHaveFocus();
            await user.tab();
            expect(focusAfter).toHaveFocus();

            // Go back to last focused toolbar button
            await user.tab({ shift: true });
            expect(getButton(0, 2)).toHaveFocus();
        });

        it('should navigate incomplete grid with up arrow', async () => {
            const user = userEvent.setup({ delay: null });
            render(<Grid complete={false} loopAround />);

            // Focusing first element
            getButton(0, 0).focus();

            // Go through the whole grid with up arrow
            await user.keyboard('[ArrowUp]');
            expect(getButton(1, 2)).toHaveFocus();
            await user.keyboard('[ArrowUp]');
            expect(getButton(0, 2)).toHaveFocus();

            await user.keyboard('[ArrowUp]');
            expect(getButton(2, 1)).toHaveFocus();
            await user.keyboard('[ArrowUp]');
            expect(getButton(1, 1)).toHaveFocus();
            await user.keyboard('[ArrowUp]');
            expect(getButton(0, 1)).toHaveFocus();

            await user.keyboard('[ArrowUp]');
            expect(getButton(2, 0)).toHaveFocus();
            await user.keyboard('[ArrowUp]');
            expect(getButton(1, 0)).toHaveFocus();
            await user.keyboard('[ArrowUp]');
            expect(getButton(0, 0)).toHaveFocus();
        });

        it('should navigate incomplete grid with down arrow', async () => {
            const user = userEvent.setup({ delay: null });
            render(<Grid complete={false} loopAround />);

            // Focusing first element
            getButton(0, 0).focus();

            // Go through the whole grid with down arrow
            await user.keyboard('[ArrowDown]');
            expect(getButton(1, 0)).toHaveFocus();
            await user.keyboard('[ArrowDown]');
            expect(getButton(2, 0)).toHaveFocus();

            await user.keyboard('[ArrowDown]');
            expect(getButton(0, 1)).toHaveFocus();
            await user.keyboard('[ArrowDown]');
            expect(getButton(1, 1)).toHaveFocus();
            await user.keyboard('[ArrowDown]');
            expect(getButton(2, 1)).toHaveFocus();

            await user.keyboard('[ArrowDown]');
            expect(getButton(0, 2)).toHaveFocus();
            await user.keyboard('[ArrowDown]');
            expect(getButton(1, 2)).toHaveFocus();

            await user.keyboard('[ArrowDown]');
            expect(getButton(0, 0)).toHaveFocus();
        });

        it('should navigate incomplete grid with left arrow', async () => {
            const user = userEvent.setup({ delay: null });
            render(<Grid complete={false} loopAround />);

            // Focusing first element
            getButton(0, 0).focus();

            // Go through the whole grid with left arrow
            await user.keyboard('[ArrowLeft]');
            expect(getButton(2, 1)).toHaveFocus();
            await user.keyboard('[ArrowLeft]');
            expect(getButton(2, 0)).toHaveFocus();

            await user.keyboard('[ArrowLeft]');
            expect(getButton(1, 2)).toHaveFocus();
            await user.keyboard('[ArrowLeft]');
            expect(getButton(1, 1)).toHaveFocus();
            await user.keyboard('[ArrowLeft]');
            expect(getButton(1, 0)).toHaveFocus();

            await user.keyboard('[ArrowLeft]');
            expect(getButton(0, 2)).toHaveFocus();
            await user.keyboard('[ArrowLeft]');
            expect(getButton(0, 1)).toHaveFocus();
            await user.keyboard('[ArrowLeft]');
            expect(getButton(0, 0)).toHaveFocus();
        });

        it('should navigate incomplete grid with right arrow', async () => {
            const user = userEvent.setup({ delay: null });
            render(<Grid complete={false} loopAround />);

            // Focusing first element
            getButton(0, 0).focus();

            // Go through the whole grid with right arrow
            await user.keyboard('[ArrowRight]');
            expect(getButton(0, 1)).toHaveFocus();
            await user.keyboard('[ArrowRight]');
            expect(getButton(0, 2)).toHaveFocus();

            await user.keyboard('[ArrowRight]');
            expect(getButton(1, 0)).toHaveFocus();
            await user.keyboard('[ArrowRight]');
            expect(getButton(1, 1)).toHaveFocus();
            await user.keyboard('[ArrowRight]');
            expect(getButton(1, 2)).toHaveFocus();

            await user.keyboard('[ArrowRight]');
            expect(getButton(2, 0)).toHaveFocus();
            await user.keyboard('[ArrowRight]');
            expect(getButton(2, 1)).toHaveFocus();

            await user.keyboard('[ArrowRight]');
            expect(getButton(0, 0)).toHaveFocus();
        });

        it('should handle horizontal shortcut', async () => {
            const user = userEvent.setup({ delay: null });
            render(<Grid loopAround gridJumpToShortcutDirection="horizontal" />);

            await user.click(getButton(0, 0));

            /** Pressing End should focus the last item in the row  */
            await user.keyboard('{End}');
            expect(getButton(0, 2)).toHaveFocus();

            /** Pressing ArrowDown should focus the next item in the column  */
            await user.keyboard('{ArrowDown}');
            expect(getButton(1, 2)).toHaveFocus();

            /** Pressing Home should focus the first item in the row  */
            await user.keyboard('{Home}');
            expect(getButton(1, 0)).toHaveFocus();
        });

        it('should handle vertical shortcut', async () => {
            const user = userEvent.setup({ delay: null });
            render(<Grid loopAround gridJumpToShortcutDirection="vertical" />);

            await user.click(screen.getByRole('gridcell', { name: 'Button 0-0' }));

            /** Pressing End should focus the last item in the column  */
            await user.keyboard('{End}');
            expect(screen.getByRole('gridcell', { name: 'Button 2-0' })).toHaveFocus();

            /** Pressing ArrowRight should focus the next item in the row  */
            await user.keyboard('{ArrowRight}');
            expect(screen.getByRole('gridcell', { name: 'Button 2-1' })).toHaveFocus();

            /** Pressing Home should focus the first item in the column  */
            await user.keyboard('{Home}');
            expect(screen.getByRole('gridcell', { name: 'Button 0-1' })).toHaveFocus();
        });
    });
});
