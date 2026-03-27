import { expect, screen, userEvent, within, waitFor } from 'storybook/test';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { createTemplates } from './Tests';

/**
 * Setup SelectButton test stories
 */
export function setup({
    components: { SelectButton },
    renderWithState,
}: SetupStoriesOptions<{
    components: { SelectButton: any };
    decorators: 'withValueOnChange';
}> & {
    renderWithState: (template: (props: any) => any) => any;
}) {
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
            const button = within(canvasElement).getByRole('combobox');

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

    // ─── Selection updates button display ────────────────────────

    const SelectionUpdates = {
        render: () => renderWithState(defaultTemplate),
        play: async ({ canvasElement }: any) => {
            const button = within(canvasElement).getByRole('combobox');

            expect(button.textContent).toContain('Select a fruit');

            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
            });

            const options = screen.getAllByRole('option');
            await userEvent.click(options[2]); // Banana

            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'false');
            });

            await waitFor(() => {
                expect(button.textContent).toContain('Banana');
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
            const button = within(canvasElement).getByRole('combobox');

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
        SelectionUpdates,
        WithInfiniteScroll,
    };
}
