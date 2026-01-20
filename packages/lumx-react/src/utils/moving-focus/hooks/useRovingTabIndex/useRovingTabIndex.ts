import React from 'react';

import isNil from 'lodash/isNil';
import uniqueId from 'lodash/uniqueId';

import { MovingFocusContext } from '../../components/MovingFocusProvider/context';
import { NAV_KEYS } from '../../ducks/keyboard-navigation';
import { BaseHookOptions } from '../../types';
import { getPointerTypeFromEvent } from '../../utils';

/**
 * A tuple of values to be applied by the containing component for the roving tabindex to work correctly.
 */
type Output = [
    /** The tabIndex value to apply to the tab stop element. */
    tabIndex: number,
    /** Whether focus() should be invoked on the tab stop element. */
    focused: boolean,
    /**
     * The onKeyDown callback to apply to the tab stop element. If the key press is relevant to the hook then
     * event.preventDefault() will be invoked on the event.
     */
    handleKeyDown: (event: React.KeyboardEvent) => void,
    /** The onClick callback to apply to the tab stop element. */
    handleClick: () => void,
];

/**
 * Includes the given DOM element in the current roving tabindex.
 */
export const useRovingTabIndex: (...args: BaseHookOptions) => Output = (
    ref,
    disabled = false,
    rowKey = null,
    autofocus = false,
) => {
    // Create a stable ID for the lifetime of the component:
    const idRef = React.useRef<string | null>(null);

    function getId() {
        if (!idRef.current) {
            idRef.current = uniqueId('rti_');
        }
        return idRef.current;
    }

    const isMounted = React.useRef(false);
    const { dispatch, state } = React.useContext(MovingFocusContext);
    const { direction } = state;

    // Register the tab stop on mount and unregister it on unmount:
    React.useEffect(
        () => {
            const id = getId();
            dispatch({ type: 'REGISTER_TAB_STOP', payload: { id, domElementRef: ref, rowKey, disabled, autofocus } });
            return () => {
                dispatch({ type: 'UNREGISTER_TAB_STOP', payload: { id } });
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state.listKey],
    );

    /*
     * Update the tab stop data if `rowIndex` or `disabled` change.
     * The isMounted flag is used to prevent this effect running on mount, which is benign but redundant (as the
     * REGISTER_TAB_STOP action would have just been dispatched).
     */
    React.useEffect(
        () => {
            if (isMounted.current) {
                dispatch({ type: 'UPDATE_TAB_STOP', payload: { id: getId(), rowKey, disabled } });
            } else {
                isMounted.current = true;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rowKey, disabled],
    );

    // Create a stable callback function for handling key down events:
    const handleKeyDown = React.useCallback<React.KeyboardEventHandler>(
        (evt) => {
            const trueDirection = !isNil(rowKey) ? 'both' : direction;
            if (!NAV_KEYS[trueDirection].includes(evt.key as any)) {
                return;
            }
            dispatch({ type: 'KEY_NAV', payload: { id: getId(), key: evt.key, ctrlKey: evt.ctrlKey } });
            evt.preventDefault();
            evt.stopPropagation();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    // Create a stable callback function for handling click events:
    const handleClick = React.useCallback(
        (event?: PointerEvent | Event) => {
            dispatch({
                type: 'SELECT_TAB_STOP',
                payload: {
                    id: getId(),
                    type: getPointerTypeFromEvent(event),
                },
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    // Determine if the current tab stop is the currently active one:
    const selected = getId() === state.selectedId;

    const tabIndex = selected ? 0 : -1;
    const focused = selected && state.allowFocusing;

    return [tabIndex, focused, handleKeyDown, handleClick];
};
