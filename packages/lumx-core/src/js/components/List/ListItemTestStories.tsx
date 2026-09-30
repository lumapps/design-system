/* eslint-disable react/no-children-prop */
/**
 * Browser-only test stories for ListItem.
 *
 * These tests require a real browser environment (Playwright via Vitest browser mode)
 * because they rely on CSS hit-testing (`document.elementFromPoint`) of the action area overlay.
 */
import { expect, fn, screen, userEvent } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';

/**
 * Setup ListItem test stories for a specific framework (React or Vue).
 */
export function setup({
    component,
    render: ListItem = component,
    components: { List, ListItemAction, Button },
}: SetupStoriesOptions<{
    components: {
        List: any;
        ListItemAction: any;
        Button: any;
    };
}>) {
    const meta = {
        component,
        tags: ['!snapshot'],
        parameters: { chromatic: { disable: true } },
    };

    /** List item with an action area, non-interactive content in the slots and a secondary button. */
    const actionAreaStory = {
        args: { onActionClick: fn(), onSecondaryClick: fn() },
        render: ({ onActionClick, onSecondaryClick }: any) => (
            <List>
                <ListItem
                    before={<span data-testid="before-content">Before</span>}
                    after={
                        <>
                            <span data-testid="after-content">After</span>
                            <Button size="s" emphasis="low" onClick={onSecondaryClick}>
                                Secondary
                            </Button>
                        </>
                    }
                    children={<ListItemAction onClick={onActionClick}>Main action</ListItemAction>}
                />
            </List>
        ),
    };

    /** Click on non-interactive content of the `before` slot triggers the main action. */
    const ClickOnBeforeSlotTriggersAction = {
        ...actionAreaStory,
        play: async ({ args }: any) => {
            // Click the element hit at the slot content center (real browser hit-testing).
            const rect = screen.getByTestId('before-content').getBoundingClientRect();
            const hitElement = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
            expect(hitElement).toBe(screen.getByRole('button', { name: 'Main action' }));
            await userEvent.click(hitElement!);

            expect(args.onActionClick).toHaveBeenCalledTimes(1);
            expect(args.onSecondaryClick).not.toHaveBeenCalled();
        },
    };

    /** Click on non-interactive content of the `after` slot triggers the main action. */
    const ClickOnAfterSlotTriggersAction = {
        ...actionAreaStory,
        play: async ({ args }: any) => {
            // Click the element hit at the slot content center (real browser hit-testing).
            const rect = screen.getByTestId('after-content').getBoundingClientRect();
            const hitElement = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
            expect(hitElement).toBe(screen.getByRole('button', { name: 'Main action' }));
            await userEvent.click(hitElement!);

            expect(args.onActionClick).toHaveBeenCalledTimes(1);
            expect(args.onSecondaryClick).not.toHaveBeenCalled();
        },
    };

    /** Click on an interactive element of a slot triggers this element only (not the main action). */
    const ClickOnSlotButtonTriggersButton = {
        ...actionAreaStory,
        play: async ({ args }: any) => {
            // Click the element hit at the secondary button center (real browser hit-testing).
            const secondaryButton = screen.getByRole('button', { name: 'Secondary' });
            const rect = secondaryButton.getBoundingClientRect();
            const hitElement = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
            expect(secondaryButton.contains(hitElement)).toBe(true);
            await userEvent.click(hitElement!);

            expect(args.onSecondaryClick).toHaveBeenCalledTimes(1);
            expect(args.onActionClick).not.toHaveBeenCalled();
        },
    };

    return { meta, ClickOnBeforeSlotTriggersAction, ClickOnAfterSlotTriggersAction, ClickOnSlotButtonTriggersButton };
}
