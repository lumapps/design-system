import { useState } from 'react';

/////////////////////////////

interface IUseChipGroupNavigation {
    /** the current active chip index */
    activeChip: number;
    /** callback to be executed when the backspace was pressed */
    onBackspacePressed(): void;
    /** function that allows to reset the navigation */
    resetChipNavigation(): void;
}

type useChipGroupNavigationType = (
    chips: object[],
    onChipDeleted: (object) => void,
    initialActiveChip?: number,
) => IUseChipGroupNavigation;

const INITIAL_STATE_ACTIVE_CHIP = -1;

/**
 * Hook that provides the necessary information to manage chips navigation.
 * @param chips             List of chips selected.
 * @param onChipDeleted     Callback executed when a chip must be eliminated.
 * @param initialActiveChip Initial active chip index.
 *
 * @return chip navigation tools.
 */
const useChipGroupNavigation: useChipGroupNavigationType = (
    chips,
    onChipDeleted,
    initialActiveChip = INITIAL_STATE_ACTIVE_CHIP,
) => {
    const [wasBackspacePressed, setWasBackspacePressed] = useState(false);
    const [activeChip, setActiveChip] = useState(initialActiveChip);

    /**
     * Resets the active index and backspace control to their initial state
     */
    const resetChipNavigation = (): void => {
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
    const onBackspacePressed = (): void => {
        if (chips.length === 0) {
            return;
        }

        if (wasBackspacePressed) {
            const chipDeleted: object = chips[chips.length - 1];
            // tslint:disable-next-line: no-inferred-empty-object-type
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

export { useChipGroupNavigation, useChipGroupNavigationType };
