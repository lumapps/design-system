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

    return {
        meta,
        ClickOutsideCloses,
        BlurResetsToSelectedValue,
        BlurResetsToEmpty,
        MultiBlurResetsSearch,
        WithInfiniteScroll,
    };
}
