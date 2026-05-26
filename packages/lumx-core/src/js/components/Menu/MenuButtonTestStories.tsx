import { expect, fn, userEvent, within, waitFor } from 'storybook/test';

export function setup({ components: { MenuButton, MenuItem } }: { components: { MenuButton: any; MenuItem: any } }) {
    const meta = {
        tags: ['!snapshot'],
        args: {
            onOne: fn().mockName('one'),
            onTwo: fn().mockName('two'),
            onThree: fn().mockName('three'),
        },
        render: (args: any) => (
            <>
                <button type="button" data-testid="link-before">
                    Link before
                </button>
                <MenuButton label="Open menu">
                    <MenuItem onClick={args.onOne}>One</MenuItem>
                    <MenuItem onClick={args.onTwo}>Two</MenuItem>
                    <MenuItem onClick={args.onThree}>Three</MenuItem>
                </MenuButton>
                <button type="button" data-testid="link-after">
                    Link after
                </button>
            </>
        ),
    };

    /** Tab from the last enabled item closes the menu and moves focus to the next page focusable. */
    const TabFromLastItemClosesAndMovesFocus = {
        play: async ({ canvasElement }: any) => {
            const canvas = within(canvasElement);
            const trigger = canvas.getByRole('button', { name: 'Open menu' });

            await userEvent.click(trigger);

            const last = canvas.getByRole('button', { name: 'Three' });
            await waitFor(() => expect(last.ownerDocument.activeElement).not.toBe(trigger));

            last.focus();
            await waitFor(() => expect(last).toHaveFocus());
            await userEvent.tab();

            await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
            await waitFor(() => expect(trigger).not.toHaveFocus());
            const linkAfter = canvas.getByTestId('link-after');
            await waitFor(() => expect(linkAfter).toHaveFocus());
        },
    };

    /** Shift+Tab from the first enabled item closes the menu; native Tab returns focus to the trigger. */
    const ShiftTabFromFirstItemClosesAndReturnsToTrigger = {
        play: async ({ canvasElement }: any) => {
            const canvas = within(canvasElement);
            const trigger = canvas.getByRole('button', { name: 'Open menu' });

            await userEvent.click(trigger);

            const first = canvas.getByRole('button', { name: 'One' });
            await waitFor(() => expect(first).toHaveFocus());

            await userEvent.tab({ shift: true });

            await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
            await waitFor(() => expect(trigger).toHaveFocus());
        },
    };

    /** Escape closes the menu AND restores focus to the trigger (via Popover.focusAnchorOnClose). */
    const EscapeRestoresFocusToTrigger = {
        play: async ({ canvasElement }: any) => {
            const canvas = within(canvasElement);
            const trigger = canvas.getByRole('button', { name: 'Open menu' });

            await userEvent.click(trigger);
            const first = canvas.getByRole('button', { name: 'One' });
            await waitFor(() => expect(first).toHaveFocus());

            await userEvent.keyboard('{Escape}');

            await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
            await waitFor(() => expect(trigger).toHaveFocus());
        },
    };

    /** Clicking an item activates it, closes the menu, and restores focus to the trigger. */
    const ItemActivationRestoresFocusToTrigger = {
        play: async ({ canvasElement, args }: any) => {
            const canvas = within(canvasElement);
            const trigger = canvas.getByRole('button', { name: 'Open menu' });

            await userEvent.click(trigger);
            const second = canvas.getByRole('button', { name: 'Two' });
            await waitFor(() => expect(second).toBeInTheDocument());

            await userEvent.click(second);

            expect(args.onTwo).toHaveBeenCalledTimes(1);
            await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
            await waitFor(() => expect(trigger).toHaveFocus());
        },
    };

    /** Clicking outside the menu closes it and leaves focus where the user clicked. */
    const ClickAwayClosesMenu = {
        play: async ({ canvasElement }: any) => {
            const canvas = within(canvasElement);
            const trigger = canvas.getByRole('button', { name: 'Open menu' });
            const linkAfter = canvas.getByTestId('link-after');

            await userEvent.click(trigger);
            await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'));

            await userEvent.click(linkAfter);

            await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'));
            await waitFor(() => expect(trigger).not.toHaveFocus());
        },
    };

    return {
        meta,
        TabFromLastItemClosesAndMovesFocus,
        ShiftTabFromFirstItemClosesAndReturnsToTrigger,
        EscapeRestoresFocusToTrigger,
        ItemActivationRestoresFocusToTrigger,
        ClickAwayClosesMenu,
    };
}
