import React, { ReactNode, useEffect, useReducer } from 'react';
import { INIT_STATE, TabProviderContext, reducer } from '../tabs/state';

export interface ProgressTrackerProviderProps {
    /** Active step index. */
    activeStepIndex?: number;
    /** ProgressTrackerProvider children. */
    children: ReactNode;
    /** Step panel children should not render if the step panel is hidden. */
    isLazy?: boolean;
    /** Activate tabs on focus. */
    shouldActivateOnFocus?: boolean;
    /** Step change callback. */
    onChange?(index: number): void;
}

const DEFAULT_PROPS: Partial<ProgressTrackerProviderProps> = {
    isLazy: INIT_STATE.isLazy,
    shouldActivateOnFocus: INIT_STATE.shouldActivateOnFocus,
};

/**
 * This component provides a context in which steps can be defined and linked to their step panel.
 *
 * It does not produce any markup so you can wrap it around any React elements and then split the ProgressTracker and ProgressTrackerPanel
 * components in the react tree.
 *
 * This works exactly as TabProvider so it uses TabProviderContext and tabs state.
 *
 * @param  props React component props.
 * @return React element.
 */
export const ProgressTrackerProvider: React.FC<ProgressTrackerProviderProps> = (props) => {
    const { children, onChange, ...propState } = props;
    const [state, dispatch] = useReducer(reducer, INIT_STATE);

    // On prop state change => dispatch update.
    useEffect(
        () => {
            dispatch({
                type: 'update',
                payload: {
                    ...propState,
                    activeTabIndex: propState.activeStepIndex || INIT_STATE.activeTabIndex,
                },
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch, ...Object.values(propState)],
    );

    // On active tab index state change => send update to the onChange.
    useEffect(
        () => {
            if (state === INIT_STATE || !onChange || propState.activeStepIndex === state.activeTabIndex) {
                return;
            }
            onChange(state.activeTabIndex);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onChange, state.activeTabIndex],
    );

    return <TabProviderContext.Provider value={[state, dispatch]}>{children}</TabProviderContext.Provider>;
};
ProgressTrackerProvider.defaultProps = DEFAULT_PROPS;
