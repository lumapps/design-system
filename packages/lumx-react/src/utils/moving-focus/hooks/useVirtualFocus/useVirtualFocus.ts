import React, { useEffect } from 'react';

import { MovingFocusContext } from '../../components/MovingFocusProvider/context';
import { BaseHookOptions } from '../../types';
import { getPointerTypeFromEvent } from '../../utils';

/**
 * Hook options
 */
type Options = [
    /** The DOM id of the tab stop. */
    id: string,
    ...baseOptions: BaseHookOptions,
];

/**
 * Hook to use in tab stop element of a virtual focus (ex: options of a listbox in a combobox).
 *
 * @returns true if the current tab stop has virtual focus
 */
export const useVirtualFocus: (...args: Options) => boolean = (
    id,
    domElementRef,
    disabled = false,
    rowKey = null,
    autofocus = false,
) => {
    const isMounted = React.useRef(false);
    const { state, dispatch } = React.useContext(MovingFocusContext);

    // Register the tab stop on mount and unregister it on unmount:
    React.useEffect(
        () => {
            const { current: domElement } = domElementRef;
            if (!domElement) {
                return undefined;
            }
            // Select tab stop on click
            const onClick = (event?: PointerEvent | Event) => {
                dispatch({
                    type: 'SELECT_TAB_STOP',
                    payload: { id, type: getPointerTypeFromEvent(event) },
                });
            };
            domElement.addEventListener('click', onClick);

            // Register tab stop in context
            dispatch({ type: 'REGISTER_TAB_STOP', payload: { id, domElementRef, rowKey, disabled: !!disabled, autofocus } });

            return () => {
                domElement.removeEventListener('click', onClick);
                dispatch({ type: 'UNREGISTER_TAB_STOP', payload: { id } });
            };
        },
        /**
         * Pass the list key as dependency to make tab stops
         * re-register when it changes.
         */
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [state.listKey],
    );

    /*
     * Update the tab stop data if `rowKey` or `disabled` change.
     * The isMounted flag is used to prevent this effect running on mount, which is benign but redundant (as the
     * REGISTER_TAB_STOP action would have just been dispatched).
     */
    React.useEffect(
        () => {
            if (isMounted.current) {
                dispatch({ type: 'UPDATE_TAB_STOP', payload: { id, rowKey, disabled: !!disabled } });
            } else {
                isMounted.current = true;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [disabled, rowKey],
    );

    const isActive = id === state.selectedId;

    // Scroll element into view when highlighted
    useEffect(() => {
        const { current } = domElementRef;
        if (isActive && current && current.scrollIntoView) {
            /**
             * In some cases, the selected item is contained in a popover
             * that won't be immediately set in the correct position.
             * Setting a small timeout before scroll the item into view
             * leaves it time to settle at the correct position.
             */
            const timeout = setTimeout(() => {
                current.scrollIntoView({ block: 'nearest' });
            }, 10);

            return () => {
                clearTimeout(timeout);
            };
        }

        return undefined;
    }, [domElementRef, isActive]);

    const focused = isActive && state.allowFocusing;

    // Determine if the current tab stop is the currently active one:
    return focused;
};
