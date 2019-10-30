import { RefObject, SetStateAction, useEffect, useState } from 'react';

import { BACKSPACE_KEY_CODE, DOWN_KEY_CODE, ENTER_KEY_CODE, UP_KEY_CODE } from 'LumX/core/constants';

import get from 'lodash/get';

/////////////////////////////

interface IUseKeyboardListNavigation {
    /** the current active index */
    activeItemIndex: number;
    /** callback to be used when a key is pressed. usually used with the native prop `onKeyDown` */
    onKeyboardNavigation(evt: KeyboardEvent): void;
    /** Resets the active index to the initial state */
    resetActiveIndex(): void;
    /** Sets the active index to a given value */
    setActiveItemIndex(value: SetStateAction<number>): void;
}

/////////////////////////////

const INITIAL_INDEX = -1;

/////////////////////////////

/**
 * This custom hook provides the necessary set of functions and values to properly navigate
 * a list using the keyboard.
 * @param items - the list of items that will be navigated using the keyboard
 * @param ref - A reference to the element that is controlling the navigation.
 * @param onListItemSelected - callback to be executed when the ENTER key is pressed on an item
 * @param onListItemNavigated - callback to be executed when the Arrow keys are pressed
 * @param onEnterPressed - callback to be executed when the ENTER key is pressed
 * @param onBackspacePressed - callback to be executed when the BACKSPACE key is pressed
 * @param keepFocusAfterSelection - determines whether after selecting an item, the focus should be maintained on the current target or not
 * @param initialIndex - where should the navigation start from. it defaults to `-1`, so the first item navigated is the item on position `0`
 */
function useKeyboardListNavigation<T>(
    items: T[],
    ref: RefObject<HTMLElement>,
    onListItemSelected: (itemSelected: T) => {},
    onListItemNavigated: (itemSelected: T) => {},
    onEnterPressed: (itemSelected: T) => {},
    onBackspacePressed: (evt: KeyboardEvent) => {},
    keepFocusAfterSelection: boolean = false,
    initialIndex: number = INITIAL_INDEX,
): IUseKeyboardListNavigation {
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
     * Prevents the default event and stops the propagation of said event
     * @param evt - key pressed event
     */
    const preventDefaultAndStopPropagation = (evt: KeyboardEvent): void => {
        evt.preventDefault();
        evt.stopPropagation();
    };

    /**
     * Handles navigation with the arrows using the keyboard
     * @param evt - key pressed event
     */
    const onArrowPressed = (evt: KeyboardEvent): void => {
        // tslint:disable-next-line: deprecation
        const { keyCode } = evt;
        const nextActiveIndex = calculateActiveIndex(keyCode);
        setActiveItemIndex(nextActiveIndex);
        preventDefaultAndStopPropagation(evt);
        if (onListItemNavigated) {
            const selectedItem: T = items[nextActiveIndex];
            // tslint:disable-next-line: no-inferred-empty-object-type
            onListItemNavigated(selectedItem);
        }
    };

    /**
     * Handles the event when the backspace key is pressed
     * @param evt - key pressed event
     */
    const onBackspaceKeyPressed = (evt: KeyboardEvent): void => {
        if (onBackspacePressed) {
            // tslint:disable-next-line: no-inferred-empty-object-type
            onBackspacePressed(evt);
        }
    };

    /**
     * Handles when the ENTER key is pressed
     * @param evt - key pressed event
     */
    const onEnterKeyPressed = (evt: KeyboardEvent): void => {
        if (!onListItemSelected) {
            return;
        }

        preventDefaultAndStopPropagation(evt);

        if (!keepFocusAfterSelection) {
            (evt.currentTarget as HTMLElement).blur();
        }

        const selectedItem: T = items[activeItemIndex];

        if (selectedItem) {
            // tslint:disable-next-line: no-inferred-empty-object-type
            onListItemSelected(selectedItem);
            resetActiveIndex();
        } else if (activeItemIndex === initialIndex && onEnterPressed) {
            const value = get(evt, 'target.value');
            // tslint:disable-next-line: no-inferred-empty-object-type
            onEnterPressed(value);
            resetActiveIndex();
        }
    };

    /**
     * In order to make it easier in the future to add new events depending on the key
     * a map was created to add these handlers. In the future, if there is another event
     * that we need to manage depending on a specific key, we just need to add the key code
     * here, and as a value, the handler for said key.
     */
    const eventsForKeyPressed = {
        [DOWN_KEY_CODE]: onArrowPressed,
        [UP_KEY_CODE]: onArrowPressed,
        [ENTER_KEY_CODE]: onEnterKeyPressed,
        [BACKSPACE_KEY_CODE]: onBackspaceKeyPressed,
    };

    /**
     * Calculates the next active item index depending on the key pressed.
     * If the key pressed was ENTER, the function executes the callback `onListItemSelected`
     * and resets the active index, since an item was selected.
     * @param evt - key pressed or key down event
     */
    const onKeyboardNavigation = (evt: KeyboardEvent): void => {
        // tslint:disable-next-line: deprecation
        const { keyCode } = evt;
        const handler = eventsForKeyPressed[keyCode];

        if (handler) {
            handler(evt);
        }
    };

    useEffect(() => {
        if (ref && ref.current) {
            const textFieldRefCurrent = ref.current;
            textFieldRefCurrent.addEventListener('focus', resetActiveIndex);
            textFieldRefCurrent.addEventListener('keydown', onKeyboardNavigation);

            return (): void => {
                textFieldRefCurrent.removeEventListener('focus', resetActiveIndex);
                textFieldRefCurrent.removeEventListener('keydown', onKeyboardNavigation);
            };
        }

        return undefined;
    });

    return {
        activeItemIndex,
        onKeyboardNavigation,
        resetActiveIndex,
        setActiveItemIndex,
    };
}

export { useKeyboardListNavigation };
