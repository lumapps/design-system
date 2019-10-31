import { useState } from 'react';

/////////////////////////////

interface IUseChipGroupNavigation {
    activeChip: number;
    onBackspacePressed(): void;
    resetChipNavigation(): void;
}

type useChipGroupNavigationType = (
    chips: [],
    onChipDeleted: () => {},
    initialActiveChip: number,
) => IUseChipGroupNavigation;

const INITIAL_STATE_ACTIVE_CHIP = -1;

const useChipGroupNavigation: useChipGroupNavigationType = (
    chips: [],
    onChipDeleted: (chipDeleted: object) => {},
    initialActiveChip: number = INITIAL_STATE_ACTIVE_CHIP,
): IUseChipGroupNavigation => {
    const [wasBackspacePressed, setWasBackspacePressed] = useState(false);
    const [activeChip, setActiveChip] = useState(initialActiveChip);

    const resetChipNavigation = (): void => {
        setWasBackspacePressed(false);
        setActiveChip(initialActiveChip);
    };

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
