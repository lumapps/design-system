import React, { SetStateAction, useState } from 'react';

import { DOWN_KEY_CODE, ENTER_KEY_CODE, TAB_KEY_CODE, UP_KEY_CODE } from 'LumX/core/constants';

/////////////////////////////

type useKeyboardListNavigationType = (
    /** the list of items that will be navigated using the keyboard */
    items: object[],
    /** callback to be executed when the ENTER key is pressed on an item */
    onListItemSelected: (itemSelected: object) => {},
    /** where should the navigation start from. it defaults to `-1`, so the first item navigated is the item on position `0` */
    initialIndex: number,
) => {
    /** the current active index */
    activeItemIndex: number;
    /** callback to be used when a key is pressed. usually used with the native prop `onKeyDown` */
    onKeyboardNavigation(evt: React.KeyboardEvent): void;
    /** Resets the active index to the initial state */
    resetActiveIndex(): void;
    /** Sets the active index to a given value */
    setActiveItemIndex(value: SetStateAction<number>): void;
};

/////////////////////////////

const INITIAL_INDEX = -1;

/////////////////////////////

/**
 * This custom hook provides the necessary set of functions and values to properly navigate
 * a list using the keyboard.
 * @param items - the list of items that will be navigated using the keyboard
 * @param onListItemSelected - callback to be executed when the ENTER key is pressed on an item
 * @param initialIndex - where should the navigation start from. it defaults to `-1`, so the first item navigated is the item on position `0`
 */
const useKeyboardListNavigation: useKeyboardListNavigationType = (
    items: object[],
    onListItemSelected?: (itemSelected: object) => {},
    initialIndex: number = INITIAL_INDEX,
): {
    activeItemIndex: number;
    onKeyboardNavigation(evt: React.KeyboardEvent): void;
    resetActiveIndex(): void;
    setActiveItemIndex(value: SetStateAction<number>): void;
} => {
    const [activeItemIndex, setActiveItemIndex] = useState(initialIndex);

    /**
     * This function calculates the next index in the list to be highlighted
     * @param keyPressed - key code pressed
     * @return next active index
     */
    const calculateActiveIndex = (keyPressed: number): number => {
        switch (keyPressed) {
            case DOWN_KEY_CODE:
                return activeItemIndex + 1 < items.length ? activeItemIndex + 1 : 0;
            case UP_KEY_CODE:
                return activeItemIndex - 1 >= 0 ? activeItemIndex - 1 : items.length - 1;
            default:
                return initialIndex;
        }
    };

    /**
     * Resets the active index to the initial state
     */
    const resetActiveIndex = (): void => {
        setActiveItemIndex(initialIndex);
    };

    /**
     * Calculates the next active item index depending on the key pressed.
     * If the key pressed was ENTER, the function executes the callback `onListItemSelected`
     * and resets the active index, since an item was selected.
     * @param evt - key pressed or key down event
     */
    const onKeyboardNavigation = (evt: React.KeyboardEvent): void => {
        const { keyCode } = evt;

        if (keyCode === DOWN_KEY_CODE || evt.keyCode === UP_KEY_CODE) {
            setActiveItemIndex(calculateActiveIndex(keyCode));
            evt.nativeEvent.preventDefault();
            evt.nativeEvent.stopPropagation();
        } else if (keyCode === TAB_KEY_CODE) {
            evt.nativeEvent.preventDefault();
            evt.nativeEvent.stopPropagation();
        } else if (keyCode === ENTER_KEY_CODE && onListItemSelected) {
            evt.nativeEvent.preventDefault();
            evt.nativeEvent.stopPropagation();
            (evt.currentTarget as HTMLElement).blur();

            const selectedItem: object = items[activeItemIndex];

            if (selectedItem) {
                // tslint:disable-next-line: no-inferred-empty-object-type
                onListItemSelected(selectedItem);
                resetActiveIndex();
            }
        }
    };

    return {
        activeItemIndex,
        onKeyboardNavigation,
        resetActiveIndex,
        setActiveItemIndex,
    };
};

export { useKeyboardListNavigation, useKeyboardListNavigationType };
