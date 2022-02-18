import { RefObject, SetStateAction, useEffect, useState } from 'react';

import get from 'lodash/get';

type Listener = (evt: KeyboardEvent) => void;

interface UseKeyboardListNavigationType {
    /** the current active index */
    activeItemIndex: number;
    /** callback to be used when a key is pressed. usually used with the native prop `onKeyDown` */
    onKeyboardNavigation: Listener;
    /** Resets the active index to the initial state */
    resetActiveIndex(): void;
    /** Sets the active index to a given value */
    setActiveItemIndex(value: SetStateAction<number>): void;
}

export type useKeyboardListNavigationType = <I>(
    items: I[],
    ref: RefObject<HTMLElement>,
    onListItemSelected: (itemSelected: I) => void,
    onListItemNavigated?: (itemSelected: I) => void,
    onEnterPressed?: (itemSelected: string) => void,
    onBackspacePressed?: Listener,
    keepFocusAfterSelection?: boolean,
    initialIndex?: number,
    preventTabOnEnteredValue?: boolean,
) => UseKeyboardListNavigationType;

const INITIAL_INDEX = -1;

/**
 * This custom hook provides the necessary set of functions and values to properly navigate
 * a list using the keyboard.
 *
 * @param  items                    the list of items that will be navigated using the keyboard.
 * @param  ref                      A reference to the element that is controlling the navigation.
 * @param  onListItemSelected       callback to be executed when the ENTER key is pressed on an item.
 * @param  onListItemNavigated      callback to be executed when the Arrow keys are pressed.
 * @param  onEnterPressed           callback to be executed when the ENTER key is pressed.
 * @param  onBackspacePressed       callback to be executed when the BACKSPACE key is pressed.
 * @param  keepFocusAfterSelection  determines whether after selecting an item, the focus should be maintained on the current target or not.
 * @param  initialIndex             where should the navigation start from. it defaults to `-1`, so the first item navigated is the item on position `0`.
 * @param  preventTabOnEnteredValue determines whether upon TAB, if there is a value entered, the event is prevented or not.
 * @return useKeyboardListNavigation helpers.
 */
export const useKeyboardListNavigation: useKeyboardListNavigationType = (
    items,
    ref,
    onListItemSelected,
    onListItemNavigated,
    onEnterPressed,
    onBackspacePressed,
    keepFocusAfterSelection = false,
    initialIndex = INITIAL_INDEX,
    preventTabOnEnteredValue = true,
) => {
    const [activeItemIndex, setActiveItemIndex] = useState(initialIndex);

    /**
     * This function calculates the next index in the list to be highlighted
     * @param key - key code pressed
     * @return next active index
     */
    const calculateActiveIndex = (key: string): number => {
        switch (key) {
            case 'ArrowDown':
                return activeItemIndex + 1 < items.length ? activeItemIndex + 1 : 0;
            case 'ArrowUp':
                return activeItemIndex - 1 >= 0 ? activeItemIndex - 1 : items.length - 1;
            default:
                return initialIndex;
        }
    };

    /**
     * Resets the active index to the initial state
     */
    const resetActiveIndex = () => {
        setActiveItemIndex(initialIndex);
    };

    /**
     * Prevents the default event and stops the propagation of said event
     * @param evt - key pressed event
     */
    const preventDefaultAndStopPropagation: Listener = (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
    };

    /**
     * Handles navigation with the arrows using the keyboard
     * @param evt - key pressed event
     */
    const onArrowPressed: Listener = (evt) => {
        const { key } = evt;
        const nextActiveIndex = calculateActiveIndex(key);
        setActiveItemIndex(nextActiveIndex);
        preventDefaultAndStopPropagation(evt);
        if (onListItemNavigated) {
            const selectedItem = items[nextActiveIndex];
            onListItemNavigated(selectedItem);
        }
    };

    /**
     * Handles the event when the backspace key is pressed
     * @param evt - key pressed event
     */
    const onBackspaceKeyPressed: Listener = (evt) => {
        if (onBackspacePressed) {
            onBackspacePressed(evt);
        }
    };

    /**
     * Handles when the ENTER key is pressed
     * @param evt - key pressed event
     */
    const onEnterKeyPressed: Listener = (evt) => {
        if (!onListItemSelected) {
            return;
        }

        preventDefaultAndStopPropagation(evt);

        if (!keepFocusAfterSelection) {
            (evt.currentTarget as HTMLElement).blur();
        }

        const selectedItem = items[activeItemIndex];

        if (selectedItem) {
            onListItemSelected(selectedItem);
            resetActiveIndex();
        } else if (activeItemIndex === initialIndex && onEnterPressed) {
            const value = get(evt, 'target.value');
            onEnterPressed(value);
            resetActiveIndex();
        }
    };

    /**
     * Handles when the TAB key is pressed
     * @param evt - key pressed event
     */
    const onTabKeyPressed: Listener = (evt) => {
        const value = get(evt, 'target.value');

        if (preventTabOnEnteredValue && value && value.length > 0) {
            preventDefaultAndStopPropagation(evt);
        }
    };

    /**
     * In order to make it easier in the future to add new events depending on the key
     * a map was created to add these handlers. In the future, if there is another event
     * that we need to manage depending on a specific key, we just need to add the key code
     * here, and as a value, the handler for said key.
     */
    const eventsForKeyPressed: Record<string, Listener> = {
        ArrowDown: onArrowPressed,
        Tab: onTabKeyPressed,
        ArrowUp: onArrowPressed,
        Enter: onEnterKeyPressed,
        Backspace: onBackspaceKeyPressed,
    };

    /**
     * Calculates the next active item index depending on the key pressed.
     * If the key pressed was ENTER, the function executes the callback `onListItemSelected`
     * and resets the active index, since an item was selected.
     * @param evt - key pressed or key down event
     */
    const onKeyboardNavigation: Listener = (evt) => {
        const { key } = evt;
        const handler = eventsForKeyPressed[key];

        if (handler) {
            handler(evt);
        }
    };

    useEffect(() => {
        const { current: currentElement } = ref;
        if (!currentElement) {
            return undefined;
        }
        currentElement.addEventListener('focus', resetActiveIndex);
        currentElement.addEventListener('keydown', onKeyboardNavigation);
        return () => {
            currentElement.removeEventListener('focus', resetActiveIndex);
            currentElement.removeEventListener('keydown', onKeyboardNavigation);
        };
    });

    return {
        activeItemIndex,
        onKeyboardNavigation,
        resetActiveIndex,
        setActiveItemIndex,
    };
};
