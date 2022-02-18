import { useState } from 'react';

interface UseChipGroupNavigation {
    /** the current active chip index */
    activeChip: number;

    /** callback to be executed when the backspace was pressed */
    onBackspacePressed(): void;

    /** function that allows to reset the navigation */
    resetChipNavigation(): void;
}

export type useChipGroupNavigationType<C = any> = (
    chips: C[],
    onChipDeleted: (chip: C) => void,
    initialActiveChip?: number,
) => UseChipGroupNavigation;

const INITIAL_STATE_ACTIVE_CHIP = -1;

/**
 * Hook that provides the necessary information to manage chips navigation.
 * @param chips             List of chips selected.
 * @param onChipDeleted     Callback executed when a chip must be eliminated.
 * @param initialActiveChip Initial active chip index.
 *
 * @return chip navigation tools.
 */
export const useChipGroupNavigation: useChipGroupNavigationType = (
    chips,
    onChipDeleted,
    initialActiveChip = INITIAL_STATE_ACTIVE_CHIP,
) => {
    const [wasBackspacePressed, setWasBackspacePressed] = useState(false);
    const [activeChip, setActiveChip] = useState(initialActiveChip);

    /**
     * Resets the active index and backspace control to their initial state
     */
    const resetChipNavigation = () => {
        setWasBackspacePressed(false);
        setActiveChip(initialActiveChip);
    };

    /**
     * Callback to be executed when the backspace was pressed. If there are no chips
     * selected, it will return immediately. If there are it will check if the
     * backspace was already pressed. if it was, it means that the user wants to eliminate
     * the chip, so we execute the `onChipDeleted` function and reset internal state.
     *
     * If it was not pressed before, we set the `wasBackspacePressed` flag to true and
     * highlight the last chip.
     */
    const onBackspacePressed = () => {
        if (chips.length === 0) {
            return;
        }

        if (wasBackspacePressed) {
            const chipDeleted: any = chips[chips.length - 1];
            onChipDeleted(chipDeleted);
            resetChipNavigation();
        } else {
            setActiveChip(chips.length - 1);
            setWasBackspacePressed(true);
        }
    };

    return {
        activeChip,
        onBackspacePressed,
        resetChipNavigation,
    };
};
