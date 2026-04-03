import React from 'react';

import { CLASSNAME as CHIP_CLASSNAME } from '@lumx/core/js/components/Chip';
import { createSelectorTreeWalker } from '@lumx/core/js/utils/browser/createSelectorTreeWalker';
import { Selector } from '@lumx/core/js/types/Selector';
import { getWithSelector } from '@lumx/core/js/utils/selectors';

/** CSS selector for enabled chips (not aria-disabled). */
const ENABLED_CHIP_SELECTOR = `.${CHIP_CLASSNAME}:not([aria-disabled="true"])`;

/**
 * Find the chip index from an event target by traversing up to the closest chip element
 * and reading its `data-option-index` attribute.
 */
const getChipIndex = (target: EventTarget | null): number | undefined => {
    const chip = (target as HTMLElement | null)?.closest?.(`.${CHIP_CLASSNAME}`);
    const indexAttr = chip?.getAttribute('data-option-index');
    if (indexAttr == null) return undefined;
    const index = Number(indexAttr);
    return Number.isNaN(index) ? undefined : index;
};

export interface UseSelectionChipGroupEventsOptions<O> {
    /** Selected options array. */
    value?: O[];
    /** Option object id selector. */
    getOptionId: Selector<O>;
    /** Callback on option array change. */
    onChange?(newValue?: O[]): void;
    /** Reference to the chip group container element. */
    containerRef: React.RefObject<HTMLElement>;
    /** Reference to the associated input element (optional). */
    inputRef?: React.RefObject<HTMLInputElement>;
}

/**
 * Hook that manages all event handling for a SelectionChipGroup:
 * - Delegated click on the chip group container to remove a chip.
 * - Delegated keydown (Backspace/Enter) on the chip group container to remove a chip
 *   and move focus to the previous enabled chip or the input.
 * - Backspace on the input field (cursor at position 0) focuses the last enabled chip.
 *
 * Uses a TreeWalker over the container to find enabled chips in the DOM
 * instead of maintaining an array of individual chip refs.
 *
 * @param options - Hook options.
 * @returns Event handlers to spread on the ChipGroup.
 *
 * @example
 * ```tsx
 * const containerRef = useRef<HTMLElement>(null);
 * const { handleClick, handleKeyDown } = useSelectionChipGroupEvents({
 *     value,
 *     getOptionId,
 *     onChange,
 *     containerRef,
 *     inputRef,
 * });
 * ```
 */
export function useSelectionChipGroupEvents<O>({
    value,
    getOptionId,
    onChange,
    containerRef,
    inputRef,
}: UseSelectionChipGroupEventsOptions<O>) {
    const onRemove = React.useCallback(
        (index: number) => {
            if (!value) return;
            const id = getWithSelector(getOptionId, value[index]);
            const existingIndex = value.findIndex((item) => getWithSelector(getOptionId, item) === id);
            if (existingIndex === -1) return;

            const newValue = [...value];
            newValue.splice(existingIndex, 1);
            onChange?.(newValue);
        },
        [value, getOptionId, onChange],
    );

    /**
     * Finds the previous enabled chip before the given chip element
     * using a TreeWalker. If no chip is provided, returns the last enabled chip.
     */
    const findPreviousEnabledChip = React.useCallback(
        (currentChip?: HTMLElement | null) => {
            const container = containerRef.current;
            if (!container) return undefined;

            const walker = createSelectorTreeWalker(container, ENABLED_CHIP_SELECTOR);

            if (!currentChip) {
                // Find the last enabled chip by walking to the end.
                let last: HTMLElement | undefined;
                while (walker.nextNode()) {
                    last = walker.currentNode as HTMLElement;
                }
                return last;
            }

            // Walk forward until we reach the current chip, tracking the previous enabled chip.
            let previous: HTMLElement | undefined;
            while (walker.nextNode()) {
                const node = walker.currentNode as HTMLElement;
                if (node === currentChip) return previous;
                previous = node;
            }
            return undefined;
        },
        [containerRef],
    );

    // Input backspace handler: focus the last enabled chip when cursor is at position 0.
    React.useEffect(() => {
        const input = inputRef?.current;
        if (!input) {
            return undefined;
        }

        const onKeyDown = (evt: KeyboardEvent) => {
            const backspacePressed = evt.key === 'Backspace';
            const cursorAtStart = input.selectionStart === 0 && input.selectionEnd === 0;

            if (!backspacePressed || !cursorAtStart) {
                return;
            }

            evt.stopPropagation();
            evt.preventDefault();

            const lastChip = findPreviousEnabledChip();
            lastChip?.focus();
        };

        input.addEventListener('keydown', onKeyDown);
        return () => {
            input.removeEventListener('keydown', onKeyDown);
        };
    }, [inputRef, findPreviousEnabledChip]);

    // Delegated click handler on the chip group container.
    const handleClick = React.useCallback(
        (evt: React.MouseEvent) => {
            const index = getChipIndex(evt.target);
            if (index == null) return;
            onRemove(index);
        },
        [onRemove],
    );

    // Delegated keydown handler on the chip group container.
    const handleKeyDown = React.useCallback(
        (evt: React.KeyboardEvent) => {
            if (evt.key !== 'Backspace' && evt.key !== 'Enter') return;

            const index = getChipIndex(evt.target);
            if (index == null) return;

            // Find the chip element that triggered the event before removing it.
            const currentChip = (evt.target as HTMLElement)?.closest?.(`.${CHIP_CLASSNAME}`) as HTMLElement | null;
            const previousChip = findPreviousEnabledChip(currentChip);

            evt.preventDefault();
            onRemove(index);

            const input = inputRef?.current;
            (previousChip || input)?.focus();
        },
        [onRemove, findPreviousEnabledChip, inputRef],
    );

    return { handleClick, handleKeyDown };
}
