import { Dispatch, createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { clamp } from '@lumx/react/utils/clamp';
import { uid } from 'uid';

type TabType = 'tab' | 'tabPanel';

export interface State {
    isLazy: boolean;
    shouldActivateOnFocus: boolean;
    activeTabIndex: number;
    ids: Record<TabType, string[]>;
}

export const INIT_STATE: State = {
    isLazy: true,
    shouldActivateOnFocus: false,
    activeTabIndex: 0,
    ids: { tab: [], tabPanel: [] },
};

export type Action =
    | { type: 'update'; payload: Partial<State> }
    | { type: 'setActiveTabIndex'; payload: number }
    | { type: 'register'; payload: { type: TabType; id: string } }
    | { type: 'unregister'; payload: { type: TabType; id: string } };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'update':
            return { ...state, ...action.payload };
        case 'setActiveTabIndex': {
            if (state.activeTabIndex === action.payload) {
                return state;
            }
            // Change active tab index.
            return { ...state, activeTabIndex: action.payload };
        }
        case 'register': {
            const { type, id } = action.payload;
            // Append tab/tabPanel id in state.
            return { ...state, ids: { ...state.ids, [type]: [...state.ids[type], id] } };
        }
        case 'unregister': {
            const { type, id } = action.payload;
            const index = state.ids[type].indexOf(id);
            if (index === -1) return state;
            // Remove tab & tab panel at index.
            const tabIds = [...state.ids.tab];
            tabIds.splice(index, 1);
            const tabPanelIds = [...state.ids.tabPanel];
            tabPanelIds.splice(index, 1);
            return {
                ...state,
                ids: { tab: tabIds, tabPanel: tabPanelIds },
            };
        }
        default:
            return state;
    }
};

export const TabProviderContext = createContext<[State, Dispatch<Action>] | null>(null);

export type TabState = Pick<Required<State>, 'isLazy' | 'shouldActivateOnFocus'> & {
    isActive: boolean;
    tabId: string;
    tabPanelId: string;
    changeToTab(): void;
};

/* eslint-disable react-hooks/rules-of-hooks */
export const useTabProviderContext = (type: TabType, originalId?: string): undefined | TabState => {
    const context = useContext(TabProviderContext);
    if (!context) {
        return undefined;
    }
    const [state, dispatch] = context;

    // Current tab or tab panel id.
    const id = useMemo(
        () => originalId || `${type}-${uid()}`,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );
    useEffect(
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
