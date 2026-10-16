/**
 * Browser-only test stories for SelectTextField.
 *
 * These tests require a real browser environment (Playwright via Vitest browser mode)
 * because they rely on blur/focus interactions with outside elements and click-away
 * detection that do not work reliably in jsdom.
 *
 * The majority of SelectTextField tests have been migrated to jsdom in Tests.tsx.
 */
import { expect, screen, userEvent, within, waitFor } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { createTemplates, MULTI_TRANSLATIONS } from './Tests';

// Test fruits — local to test stories (include descriptions for blur-reset tests).
const FRUITS = [
    { id: 'apple', name: 'Apple', category: 'Pome', description: 'A sweet red fruit' },
    { id: 'apricot', name: 'Apricot', category: 'Stone', description: 'A soft orange fruit' },
    { id: 'banana', name: 'Banana', category: 'Tropical', description: 'A long yellow fruit' },
    { id: 'blueberry', name: 'Blueberry', category: 'Berry', description: 'A small blue fruit' },
    { id: 'cherry', name: 'Cherry', category: 'Stone', description: 'A small red fruit' },
    { id: 'grape', name: 'Grape', category: 'Berry', description: 'A small purple fruit' },
    { id: 'lemon', name: 'Lemon', category: 'Citrus', description: 'A sour yellow fruit' },
    { id: 'orange', name: 'Orange', category: 'Citrus', description: 'A citrus fruit' },
    { id: 'peach', name: 'Peach', category: 'Stone', description: 'A soft fuzzy fruit' },
    { id: 'strawberry', name: 'Strawberry', category: 'Berry', description: 'A sweet red berry' },
];

/**
 * Build a list of `count` fruit options by repeating the base `FRUITS` list with unique ids.
 * Shared between React and Vue `WithManyOptions` test stories.
 */
export function createManyOptions(count: number) {
    return Array.from({ length: Math.ceil(count / FRUITS.length) })
        .flatMap((_, page) => FRUITS.map((f, i) => ({ ...f, id: `${f.id}-${page * FRUITS.length + i}` })))
        .slice(0, count);
}

/**
 * Setup test stories
 */
export function setup({
    components: { SelectTextField },
}: SetupStoriesOptions<{
    components: { SelectTextField: any; Combobox?: any };
}>) {
    const { defaultTemplate, multiTemplate } = createTemplates(SelectTextField);

    const meta = {
        component: SelectTextField as any,
        tags: ['!snapshot'],
        parameters: { chromatic: { disable: true } },
    };

    /** Test click-away */
    const ClickOutsideCloses = {
        render: (args: any) => (
            <div>
                {defaultTemplate(args)}
                <button type="button" data-testid="outside-button">
                    Outside
                </button>
            </div>
        ),
        async play({ canvas }: any) {
            const input = canvas.getByRole('combobox') as HTMLInputElement;

            await userEvent.click(input);
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const outsideButton = canvas.getByTestId('outside-button');
            await userEvent.click(outsideButton);

            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'false');
            });
        },
    };

    /** Test blur reset to selected value */
    const BlurResetsToSelectedValue = {
        render: (args: any) => (
            <div>
                {defaultTemplate({ value: FRUITS[0], ...args })}
                <button type="button" data-testid="outside-button">
                    Outside
                </button>
            </div>
        ),
        async play({ canvas }: any) {
            const input = canvas.getByRole('combobox') as HTMLInputElement;

            await expect(input).toHaveValue('Apple');

            await userEvent.clear(input);
            await userEvent.type(input, 'xyz');
            await expect(input).toHaveValue('xyz');

            const outsideButton = canvas.getByTestId('outside-button');
            await userEvent.click(outsideButton);

            await waitFor(() => {
                expect(input).toHaveValue('Apple');
            });
        },
    };

    /** Test blur reset to empty */
    const BlurResetsToEmpty = {
        render: (args: any) => (
            <div>
                {defaultTemplate(args)}
                <button type="button" data-testid="outside-button">
                    Outside
                </button>
            </div>
        ),
        async play({ canvas }: any) {
            const input = canvas.getByRole('combobox') as HTMLInputElement;

            await userEvent.type(input, 'xyz');
            await expect(input).toHaveValue('xyz');

            const outsideButton = canvas.getByTestId('outside-button');
            await userEvent.click(outsideButton);

            await waitFor(() => {
                expect(input).toHaveValue('');
            });
        },
    };

    /** Test blur reset to empty (multi select) */
    const MultiBlurResetsSearch = {
        render: (args: any) => (
            <div>
                {multiTemplate({ value: [FRUITS[0]], translations: MULTI_TRANSLATIONS, ...args })}
                <button type="button" data-testid="outside-button">
                    Outside
                </button>
            </div>
        ),
        async play({ canvas }: any) {
            const input = canvas.getByRole('combobox') as HTMLInputElement;

            await userEvent.type(input, 'xyz');
            await expect(input).toHaveValue('xyz');

            const outsideButton = canvas.getByTestId('outside-button');
            await userEvent.click(outsideButton);

            await waitFor(() => {
                expect(input).toHaveValue('');
            });

            const chipGroup = canvas.getByRole('listbox', { name: 'Selected fruits' });
            const chipButtons = within(chipGroup).getAllByRole('option');
            expect(chipButtons).toHaveLength(1);
        },
    };

    /**
     * Test story for WithInfiniteScroll.
     * Opens the dropdown and verifies that the infinite scroll sentinel triggers
     * loading additional options.
     *
     * The render function is framework-specific (React hooks / Vue SFC),
     * so each framework consumer overrides `render` and keeps this `play`.
     */
    const WithInfiniteScroll = {
        async play({ canvas }: any) {
            const input = canvas.getByRole('combobox') as HTMLInputElement;

            // Open the dropdown
            await userEvent.click(input);
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            // Verify the listbox is rendered (portal content, use screen)
            const listbox = await screen.findByRole('listbox', { name: 'Select a fruit' });

            // Capture the initial number of options once render settles.
            // The render is expected to provide enough items to overflow the popover
            // so the IntersectionObserver sentinel does not fire before scroll.
            let initialCount = 0;
            await waitFor(() => {
                const options = within(listbox).getAllByRole('option');
                expect(options.length).toBeGreaterThan(0);
                initialCount = options.length;
            });

            // Scroll the popover to the bottom to trigger the IntersectionObserver sentinel
            const scrollContainer = listbox.closest('.lumx-combobox-popover__scroll')!;
            expect(scrollContainer).toBeTruthy();
            scrollContainer.scrollTop = scrollContainer.scrollHeight;

            // Wait for more options to be loaded after scroll
            await waitFor(() => {
                const options = within(listbox).getAllByRole('option');
                expect(options.length).toBeGreaterThan(initialCount);
            });
        },
    };

    /**
     * Test story for WithManyOptions.
     * Opens the dropdown and verifies that a large static option list renders fully.
     *
     * The number of options is controlled via the `optionsCount` arg (Storybook control),
     * so it can be tweaked without editing the story. The render function is
     * framework-specific (React hooks / Vue SFC), so each framework consumer overrides
     * `render` and keeps this `args`/`argTypes`/`play`.
     */
    const WithManyOptions = {
        args: { optionsCount: 200 },
        argTypes: {
            optionsCount: { control: { type: 'number', min: 1 } },
        },
        async play({ canvas, args }: any) {
            const input = canvas.getByRole('combobox') as HTMLInputElement;

            await userEvent.click(input);
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });

            const listbox = await screen.findByRole('listbox', { name: 'Select a fruit' });

            await waitFor(() => {
                const options = within(listbox).getAllByRole('option');
                expect(options.length).toBe(args.optionsCount);
            });
        },
    };

    /**
     * Test story for the inline list (`popoverProps={false}`) composed in a popover dialog
     * (button + popover dialog + inline select text field) that closes on selection, with infinite scroll.
     *
     * The render function is framework-specific (React hooks / Vue SFC),
     * so each framework consumer overrides `render` and keeps this `play`.
     * The render must open a `role="dialog"` popover named "Pick a fruit" from a button
     * (`aria-haspopup="dialog"`, `aria-expanded`) that shows "Pick a fruit" and the selected value,
     * with a bounded height, and start with enough options to overflow the list.
     * The select text field has no label: its input is labelled by the "Pick a fruit" text of the button.
     * Opening the dialog focuses the input. Selecting an option closes the dialog. The field has no clear button (`hasClearButton={false}`).
     */
    const InlineInPopoverDialog = {
        async play({ canvas }: any) {
            const trigger = canvas.getByRole('button', { name: 'Pick a fruit' });
            expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
            expect(trigger).toHaveAttribute('aria-expanded', 'false');

            await userEvent.click(trigger);
            const dialog = await screen.findByRole('dialog', { name: 'Pick a fruit' });
            expect(trigger).toHaveAttribute('aria-expanded', 'true');
            // No visible label: the input and the listbox are labelled by the button label.
            const input = within(dialog).getByRole('combobox', { name: 'Pick a fruit' }) as HTMLInputElement;
            // The focus moves into the dialog, on the input.
            await waitFor(() => {
                expect(input).toHaveFocus();
            });

            // The list is inline and open with no user interaction.
            await waitFor(() => {
                expect(input).toHaveAttribute('aria-expanded', 'true');
            });
            const listbox = within(dialog).getByRole('listbox', { name: 'Pick a fruit' });
            let initialCount = 0;
            await waitFor(() => {
                initialCount = within(listbox).getAllByRole('option').length;
                expect(initialCount).toBeGreaterThan(0);
            });

            // The scroll box is bounded by the dialog: it scrolls, and the sentinel does not load more by itself.
            const scrollBox = listbox.closest<HTMLElement>('.lumx-scroll-box')!;
            expect(scrollBox).toBeTruthy();
            expect(scrollBox.scrollHeight).toBeGreaterThan(scrollBox.clientHeight);
            await new Promise((resolve) => {
                setTimeout(resolve, 300);
            });
            expect(within(listbox).getAllByRole('option')).toHaveLength(initialCount);

            // Scroll to the bottom: load more.
            scrollBox.scrollTop = scrollBox.scrollHeight;
            await waitFor(() => {
                expect(within(listbox).getAllByRole('option').length).toBeGreaterThan(initialCount);
            });

            // Select an option: the dialog closes, the focus goes back to the button, which shows the value.
            await userEvent.click(within(listbox).getAllByRole('option')[1]);
            await waitFor(() => {
                expect(screen.queryByRole('dialog', { name: 'Pick a fruit' })).toBeNull();
            });
            expect(trigger).toHaveAccessibleName('Pick a fruit: Apricot');
            expect(trigger).toHaveAttribute('aria-expanded', 'false');
            await waitFor(() => {
                expect(trigger).toHaveFocus();
            });

            // Open the dialog again: the selected value is kept.
            await userEvent.click(trigger);
            const reopenedDialog = await screen.findByRole('dialog', { name: 'Pick a fruit' });
            const reopenedInput = within(reopenedDialog).getByRole('combobox', { name: 'Pick a fruit' });
            expect(reopenedInput).toHaveValue('Apricot');
            // No clear button, even with a selected value.
            expect(within(reopenedDialog).queryByRole('button', { name: 'Clear' })).toBeNull();

            // Escape in the input: propagates and closes the dialog (the selected value is not cleared).
            await userEvent.click(reopenedInput);
            await userEvent.keyboard('{Escape}');
            await waitFor(() => {
                expect(screen.queryByRole('dialog', { name: 'Pick a fruit' })).toBeNull();
            });
            expect(trigger).toHaveAccessibleName('Pick a fruit: Apricot');
        },
    };

    return {
        meta,
        InlineInPopoverDialog,
        ClickOutsideCloses,
        BlurResetsToSelectedValue,
        BlurResetsToEmpty,
        MultiBlurResetsSearch,
        WithInfiniteScroll,
        WithManyOptions,
    };
}
