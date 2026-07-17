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
     * Opens the dropdown and verifies that:
     * - `onLoadMore` does NOT fire just from mounting/opening (the initial list overflows
     *   the popover, so the sentinel isn't in view yet) — regression test for a bug where an
     *   unstable `callback`/`options` reference caused the IntersectionObserver to be torn down
     *   and recreated on every render, spuriously re-firing on the sentinel's current state.
     * - Scrolling to the bottom loads more options, and triggers `onLoadMore` exactly once
     *   (not a runaway loop from the same instability).
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

            // onLoadMore should not fire just from mounting/opening: the sentinel isn't in
            // view since the initial list overflows the popover.
            const counter = within(canvasElement).getByTestId('load-more-count');
            await new Promise((resolve) => {
                setTimeout(resolve, 300);
            });
            expect(counter.textContent).toBe('0');

            // Scroll the popover to the bottom to trigger the IntersectionObserver sentinel
            const scrollContainer = listbox.closest('.lumx-combobox-popover__scroll')!;
            expect(scrollContainer).toBeTruthy();
            scrollContainer.scrollTop = scrollContainer.scrollHeight;

            // Wait for more options to be loaded after scroll
            await waitFor(() => {
                const options = within(listbox).getAllByRole('option');
                expect(options.length).toBeGreaterThan(initialCount);
            });

            // A single scroll-to-bottom should trigger onLoadMore exactly once, not a runaway loop.
            await waitFor(() => {
                expect(counter.textContent).toBe('1');
            });
        },
    };

    // ─── Typeahead (options unmounted while closed) ──────────────

    const TYPEAHEAD_FRUITS = [
        { id: '0', name: 'Apricot' },
        { id: '1', name: 'Apple' },
        { id: '2', name: 'Banana' },
        { id: '3', name: 'Blueberry' },
        { id: '4', name: 'Cherry' },
        { id: '5', name: 'Orange' },
    ];

    const typeaheadTemplate = (props: any) => (
        <SelectButton
            label="Select a fruit"
            options={TYPEAHEAD_FRUITS}
            getOptionId="id"
            getOptionName="name"
            {...props}
        />
    );

    const getActiveOptionId = (button: HTMLElement) => button.getAttribute('aria-activedescendant');

    const TypeaheadWhileOpen = {
        render: () => renderWithState(typeaheadTemplate),
        play: async ({ canvasElement }: any) => {
            const button = within(canvasElement).getByRole('combobox');

            // Open via click (mouse), like the user does.
            await userEvent.click(button);
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                expect(screen.getAllByRole('option').length).toBeGreaterThan(0);
            });

            // Type a printable character: active descendant lands on the first match
            // by visible label ("Banana"), even though its id ("2") does not start with "b".
            await userEvent.keyboard('b');
            await waitFor(() => {
                const banana = screen.getAllByRole('option').find((o) => o.textContent === 'Banana');
                expect(banana).toBeTruthy();
                expect(getActiveOptionId(button)).toBe(banana!.id);
            });
        },
    };

    const TypeaheadFromClosed = {
        render: () => renderWithState(typeaheadTemplate),
        play: async ({ canvasElement }: any) => {
            const button = within(canvasElement).getByRole('combobox');
            button.focus();
            await expect(button).toHaveAttribute('aria-expanded', 'false');

            // First keystroke opens AND lands on the first match once options commit.
            await userEvent.keyboard('b');
            await waitFor(() => {
                expect(button).toHaveAttribute('aria-expanded', 'true');
                const banana = screen.getAllByRole('option').find((o) => o.textContent === 'Banana');
                expect(banana).toBeTruthy();
                expect(getActiveOptionId(button)).toBe(banana!.id);
            });
        },
    };

    return {
        meta,
        ClickOutsideCloses,
        SelectionUpdates,
        WithInfiniteScroll,
        TypeaheadWhileOpen,
        TypeaheadFromClosed,
    };
}
