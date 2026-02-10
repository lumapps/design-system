import React from 'react';

/**
 * Hook that enables keyboard navigation from an input field to chips.
 * When the user presses Backspace at the start of the input field (cursor at position 0),
 * it automatically focuses the last enabled chip in the list.
 *
 * @param chipRefs - Reference to an array of chip element refs
 * @param inputRef - Reference to the input element (optional)
 * @returns An object containing the `findPreviousEnabledChip` helper function
 *
 * @example
 * ```tsx
 * const chipRefs = useRef<React.RefObject<HTMLElement>[]>([]);
 * const inputRef = useRef<HTMLInputElement>(null);
 * const { findPreviousEnabledChip } = useFocusLastChipOnBackspace(chipRefs, inputRef);
 * ```
 */
export function useFocusLastChipOnBackspace(
    chipRefs: React.RefObject<React.RefObject<HTMLElement>[]>,
    inputRef?: React.RefObject<HTMLInputElement>,
) {
    /**
     * Finds the previous enabled chip starting from a given index.
     * Skips chips with `aria-disabled="true"`.
     *
     * @param startIndex - The index to start searching from (defaults to last chip)
     * @returns The enabled chip element or undefined if none found
     */
    const findPreviousEnabledChip = React.useCallback(
        (startIndex: number | null = null) => {
            const { current: chips } = chipRefs;
            if (!chips) {
                return undefined;
            }
            // Iterate backwards from startIndex (or last chip) to find an enabled chip
            for (let i = startIndex ?? chips.length - 1; i >= 0; i--) {
                const chip = chips[i]?.current;
                // Check if chip exists and is not disabled
                if (chip && chip?.getAttribute('aria-disabled') !== 'true') {
                    return chip;
                }
            }
            return undefined;
        },
        [chipRefs],
    );

    React.useEffect(() => {
        const input = inputRef?.current;
        if (!input) {
            return undefined;
        }

        const onKeyDown = (evt: KeyboardEvent) => {
            const backspacePressed = evt.key === 'Backspace';
            const cursorAtStart = input.selectionStart === 0 && input.selectionEnd === 0;

            // Only handle backspace when cursor is at the start of the input
            if (!backspacePressed || !cursorAtStart) {
                return;
            }

            // Prevent default backspace behavior and event bubbling
            evt.stopPropagation();
            evt.preventDefault();

            // Focus the last enabled chip (if any exists)
            const lastChip = findPreviousEnabledChip();
            lastChip?.focus();
        };

        // Attach keyboard event listener
        input.addEventListener('keydown', onKeyDown);

        // Cleanup listener on unmount
        return () => {
            input.removeEventListener('keydown', onKeyDown);
        };
    }, [inputRef, findPreviousEnabledChip]);

    return { findPreviousEnabledChip };
}
