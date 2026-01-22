import React from 'react';

import { INITIAL_STATE, reducer } from '../../ducks/slice';
import { MovingFocusOptions } from '../../types';
import { buildLoopAroundObject } from '../../utils';
import { MovingFocusContext } from './context';

export interface MovingFocusProviderProps {
    /**
     * The child content, which will include the DOM elements to rove between using the tab key.
     */
    children: React.ReactNode;
    /**
     * An optional object to customize the behaviour of the moving focus. It is fine to pass a new object every time
     * the containing component is rendered, and the options can be updated at any time.
     */
    options?: Partial<MovingFocusOptions>;
}

/**
 * Creates a roving tabindex context.
 */
export const MovingFocusProvider: React.FC<MovingFocusProviderProps> = ({ children, options }) => {
    const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE, (st) => ({
        ...st,
        ...options,
        direction: options?.direction || st.direction,
        loopAround: buildLoopAroundObject(options?.loopAround),
        selectedId: options?.defaultSelectedId || INITIAL_STATE.selectedId,
    }));
    const isMounted = React.useRef(false);

    // Update the options whenever they change:
    React.useEffect(() => {
        // Skip update on mount (already up to date)
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        dispatch({
            type: 'OPTIONS_UPDATED',
            payload: {
                direction: options?.direction || INITIAL_STATE.direction,
                loopAround: buildLoopAroundObject(options?.loopAround || INITIAL_STATE.loopAround),
                defaultSelectedId: options?.defaultSelectedId || INITIAL_STATE.defaultSelectedId,
                autofocus: options?.autofocus || INITIAL_STATE.autofocus,
                allowFocusing: options?.allowFocusing || INITIAL_STATE.allowFocusing,
                listKey: options?.listKey || INITIAL_STATE.listKey,
                firstFocusDirection: options?.firstFocusDirection || INITIAL_STATE.firstFocusDirection,
                gridJumpToShortcutDirection:
                    options?.gridJumpToShortcutDirection || INITIAL_STATE.gridJumpToShortcutDirection,
            },
        });
    }, [
        isMounted,
        options?.allowFocusing,
        options?.autofocus,
        options?.defaultSelectedId,
        options?.direction,
        options?.loopAround,
        options?.listKey,
        options?.firstFocusDirection,
        options?.gridJumpToShortcutDirection,
    ]);

    // Create a cached object to use as the context value:
    const context = React.useMemo(() => ({ state, dispatch }), [state]);

    return <MovingFocusContext.Provider value={context}>{children}</MovingFocusContext.Provider>;
};
