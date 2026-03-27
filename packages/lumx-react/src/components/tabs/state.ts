import { Dispatch, createContext, useCallback, useContext, useMemo } from 'react';
import { useId } from '@lumx/react/hooks/useId';
import { useIsomorphicLayoutEffect } from '@lumx/react/hooks/useIsomorphicLayoutEffect';
import { type TabType, type State, type Action, type TabState } from '@lumx/core/js/components/Tabs/state';

export {
    type TabType,
    type State,
    INIT_STATE,
    type Action,
    reducer,
    type TabState,
} from '@lumx/core/js/components/Tabs/state';

export const TabProviderContext = createContext<[State, Dispatch<Action>] | null>(null);

/* eslint-disable react-hooks/rules-of-hooks */
export const useTabProviderContext = (type: TabType, originalId?: string): undefined | TabState => {
    const context = useContext(TabProviderContext);
    if (!context) {
        return undefined;
    }
    const [state, dispatch] = context;

    // Current tab or tab panel id.
    const generatedId = useId();
    const id = originalId || generatedId;

    useIsomorphicLayoutEffect(
        () => {
            // On mount: register tab or tab panel id.
            dispatch({ type: 'register', payload: { type, id } });
            return () => {
                // On unmount: unregister tab or tab panel id.
                dispatch({ type: 'unregister', payload: { type, id } });
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    // Find tab/tabPanel index using it's id.
    const index = useMemo(() => state.ids[type].indexOf(id), [state.ids, type, id]);
    const tabId = useMemo(() => state.ids.tab[index] || '', [state, index]);
    const tabPanelId = useMemo(() => state.ids.tabPanel[index] || '', [state, index]);
    const isActive = useMemo(() => state.activeTabIndex === index, [state, index]);
    const changeToTab = useCallback(() => dispatch({ type: 'setActiveTabIndex', payload: index }), [dispatch, index]);
    return {
        isLazy: state.isLazy,
        shouldActivateOnFocus: state.shouldActivateOnFocus,
        tabId,
        tabPanelId,
        isActive,
        changeToTab,
    };
};

export const useTabProviderContextState = (): State | undefined => {
    const context = useContext(TabProviderContext);
    return context?.[0];
};
