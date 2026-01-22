import React from 'react';

import { MovingFocusContext } from '../../components/MovingFocusProvider/context';
import { NAV_KEYS } from '../../ducks/keyboard-navigation';

/**
 * Hook to use in a virtual focus parent (ex: `aria-activedescendant` on the input of a combobox).
 * * @returns the id of the currently active tab stop (virtual focus)
 */
export const useVirtualFocusParent = (ref: React.RefObject<HTMLElement>): string | undefined => {
    const { state, dispatch } = React.useContext(MovingFocusContext);

    React.useEffect(() => {
        const { current: element } = ref;
        if (!element) {
            return undefined;
        }

        function handleKeyDown(evt: KeyboardEvent) {
            const eventKey = evt.key as any;
            if (
                // Don't move if the current direction doesn't allow key
                !NAV_KEYS[state.direction].includes(eventKey) ||
                // Don't move if alt key is pressed
                evt.altKey ||
                // Don't move the focus if it hasn't been set yet and `firstFocusDirection` doesn't allow key
                (!state.allowFocusing &&
                    state.firstFocusDirection &&
                    !NAV_KEYS[state.firstFocusDirection].includes(eventKey))
            ) {
                return;
            }
            // If focus isn't allowed yet, simply enable it to stay on first item
            if (!state.allowFocusing && eventKey === 'ArrowDown') {
                dispatch({ type: 'SET_ALLOW_FOCUSING', payload: { allow: true, isKeyboardNavigation: true } });
            } else {
                dispatch({ type: 'KEY_NAV', payload: { key: eventKey, ctrlKey: evt.ctrlKey } });
            }

            evt.preventDefault();
        }
        element.addEventListener('keydown', handleKeyDown);
        return () => {
            element.removeEventListener('keydown', handleKeyDown);
        };
    }, [dispatch, ref, state.allowFocusing, state.direction, state.firstFocusDirection]);
    const focused = (state.allowFocusing && state.selectedId) || undefined;
    return focused;
};
