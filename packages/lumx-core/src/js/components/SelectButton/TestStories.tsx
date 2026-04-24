/**
 * Browser-only test stories for SelectButton.
 *
 * These tests require a real browser environment (Playwright via Vitest browser mode)
 * because they rely on click-away detection and IntersectionObserver behavior that does
 * not work reliably in jsdom.
 *
 * The majority of SelectButton tests have been migrated to jsdom in Tests.tsx.
 */
import { expect, screen, userEvent, within, waitFor } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { createTemplates } from './Tests';

// ─── Helpers ─────────────────────────────────────────────────────

function getButton(canvasElement: HTMLElement): HTMLButtonElement {
    return within(canvasElement).getByRole('combobox') as HTMLButtonElement;
}

// ═══════════════════════════════════════════════════════════════════
// Setup
// ═══════════════════════════════════════════════════════════════════

export function setup({
    components: { SelectButton },
}: SetupStoriesOptions<{
    components: { SelectButton: any };
}>) {
    const { defaultTemplate } = createTemplates(SelectButton);

    const meta = {
        component: SelectButton,
        tags: ['!snapshot'],
        parameters: { chromatic: { disable: true } },
    };

    // ─── Click-away (requires real browser event bubbling) ───────

    const ClickOutsideCloses = {
        render: (args: any) => (
            <div>
                {defaultTemplate(args)}
                <button type="button" data-testid="outside-button">
                    Outside
                </button>
            </div>
        ),
        args: { value: undefined, onChange: () => {} },
        play: async ({ canvasElement }: any) => {
            const button = getButton(canvasElement);

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const outsideButton = within(canvasElement).getByTestId('outside-button');
            await userEvent.click(outsideButton);

            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
            });
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
        async play({ canvasElement }: any) {
            const button = getButton(canvasElement);

            // Open the dropdown
            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
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
        WithInfiniteScroll,
    };
}
