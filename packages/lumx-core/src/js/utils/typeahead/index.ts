/** Typeahead interface. */
export interface Typeahead {
    /**
     * Handle a printable character keypress.
     * @param key The character typed.
     * @param currentItem The currently active item.
     * @returns The matched item, or null.
     */
    handle(key: string, currentItem: HTMLElement | null): HTMLElement | null;

    /** Reset the accumulated search string. */
    reset(): void;
}

/** Timeout in ms after which the accumulated search string is cleared. */
const SEARCH_TIMEOUT = 500;

/**
 * Create a typeahead controller for keyboard navigation in list-like widgets
 * (combobox, menu, listbox, tree, etc.).
 *
 * Accumulates typed characters and matches them against item labels.
 * Supports single-char cycling (e.g. pressing "a" repeatedly cycles through
 * items starting with "a") and multi-char prefix matching.
 *
 * Uses a {@link TreeWalker} for lazy DOM traversal — items are visited one
 * at a time without materializing the full list.
 *
 * @param getWalker Callback returning a fresh TreeWalker over navigable items, or null if unavailable.
 * @param getItemValue Callback extracting the text label from an item element.
 * @param signal AbortSignal for cleanup.
 * @returns Typeahead instance.
 */
export function createTypeahead(
    getWalker: () => TreeWalker | null,
    getItemValue: (item: HTMLElement) => string,
    signal: AbortSignal,
): Typeahead {
    let searchString = '';
    let searchTimeout: ReturnType<typeof setTimeout> | undefined;

    // Reset timeout
    function reset() {
        searchString = '';
        if (searchTimeout !== undefined) {
            clearTimeout(searchTimeout);
            searchTimeout = undefined;
        }
    }
    signal.addEventListener('abort', reset);

    // Handle typeahead keys
    function handle(key: string, currentItem: HTMLElement | null): HTMLElement | null {
        // Clear any pending reset timeout.
        if (searchTimeout !== undefined) {
            clearTimeout(searchTimeout);
        }

        // Accumulate the character.
        searchString += key.toLowerCase();

        // Schedule clearing the search string after inactivity.
        searchTimeout = setTimeout(reset, SEARCH_TIMEOUT);

        const walker = getWalker();
        if (!walker) return null;

        // Check if the walker has any items at all.
        const firstItem = walker.nextNode() as HTMLElement | null;
        if (!firstItem) return null;

        // Determine if all typed characters are the same (e.g. "aaa").
        const allSameChar = searchString.split('').every((ch) => ch === searchString[0]);

        // When all characters are the same, search by single char and cycle.
        // Otherwise, search by the full accumulated string.
        const searchText = allSameChar ? searchString[0] : searchString;

        // Position the walker at the starting point for the search.
        // For same-char cycling, start from the item AFTER currentItem.
        // For multi-char matching, start from currentItem's position.
        // If currentItem is not within the walker's root, treat as null.
        const validCurrent = currentItem && (walker.root as HTMLElement).contains(currentItem) ? currentItem : null;
        let startItem: HTMLElement;
        if (validCurrent) {
            walker.currentNode = validCurrent;
            if (allSameChar) {
                // Advance past current for cycling; if at end, wrap to first.
                const next = walker.nextNode() as HTMLElement | null;
                startItem = next ?? firstItem;
            } else {
                startItem = validCurrent;
            }
        } else {
            startItem = firstItem;
        }

        // Walk forward from startItem, wrapping around, until we either
        // find a match or complete a full cycle back to startItem.
        walker.currentNode = startItem;
        let candidate: HTMLElement = startItem;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const itemText = getItemValue(candidate).toLowerCase();
            if (itemText.startsWith(searchText)) {
                return candidate;
            }

            const next = walker.nextNode() as HTMLElement | null;
            if (next) {
                candidate = next;
            } else {
                // Wrap around to the first item.
                walker.currentNode = walker.root;
                const wrapped = walker.nextNode() as HTMLElement | null;
                if (!wrapped) return null;
                candidate = wrapped;
            }

            // Full cycle — no match found.
            if (candidate === startItem) {
                return null;
            }
        }
    }

    return { handle, reset };
}
