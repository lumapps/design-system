export type TabType = 'tab' | 'tabPanel';

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
            return { ...state, activeTabIndex: action.payload };
        }
        case 'register': {
            const { type, id } = action.payload;
            return { ...state, ids: { ...state.ids, [type]: [...state.ids[type], id] } };
        }
        case 'unregister': {
            const { type, id } = action.payload;
            const index = state.ids[type].indexOf(id);
            if (index === -1) return state;
            const tabIds = [...state.ids.tab];
            tabIds.splice(index, 1);
            const tabPanelIds = [...state.ids.tabPanel];
            tabPanelIds.splice(index, 1);
            return { ...state, ids: { tab: tabIds, tabPanel: tabPanelIds } };
        }
        default:
            return state;
    }
};

export type TabState = Pick<Required<State>, 'isLazy' | 'shouldActivateOnFocus'> & {
    isActive: boolean;
    tabId: string;
    tabPanelId: string;
    changeToTab(): void;
};
