import React, { ReactNode, useEffect, useReducer } from 'react';
import { INIT_STATE, TabProviderContext, reducer } from './state';

export interface TabProviderProps {
    /** Active tab index. */
    activeTabIndex?: number;
    /** Tab provider children. */
    children: ReactNode;
    /** Tab panel children should not render if the tab panel is hidden. */
    isLazy?: boolean;
    /** Activate tabs on focus. */
    shouldActivateOnFocus?: boolean;

    /** Tab change callback. */
    onChange?(index: number): void;
}

const DEFAULT_PROPS: Partial<TabProviderProps> = {
    isLazy: INIT_STATE.isLazy,
    shouldActivateOnFocus: INIT_STATE.shouldActivateOnFocus,
};

/**
 * This component provides a context in which tabs can be defined and linked to their tab panel.
 *
 * It does not produce any markup so you can wrap it around any React elements and then split the TabList and TabPanel
 * components in the react tree.
 *
 * @param  props React component props.
 * @return React element.
 */
export const TabProvider: React.FC<TabProviderProps> = (props) => {
    const { children, onChange, ...propState } = props;
    const [state, dispatch] = useReducer(reducer, INIT_STATE);

    // On prop state change => dispatch update.
    useEffect(
        () => {
            dispatch({ type: 'update', payload: propState });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch, ...Object.values(propState)],
    );

    // On active tab index state change => send update to the onChange.
    useEffect(
        () => {
            if (state === INIT_STATE || !onChange || propState.activeTabIndex === state.activeTabIndex) {
                return;
            }
            onChange(state.activeTabIndex);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onChange, state.activeTabIndex],
    );

    return <TabProviderContext.Provider value={[state, dispatch]}>{children}</TabProviderContext.Provider>;
};
TabProvider.defaultProps = DEFAULT_PROPS;
