import { type ComputedRef, type InjectionKey, type Ref, computed, inject, onBeforeUnmount, onMounted } from 'vue';

import { type Action, type State, type TabState, type TabType } from '@lumx/core/js/components/Tabs/state';
import { useId } from '../../composables/useId';

export {
    type TabType,
    type State,
    INIT_STATE,
    type Action,
    reducer,
    type TabState,
} from '@lumx/core/js/components/Tabs/state';

export type TabProviderContextValue = {
    state: Ref<State>;
    dispatch: (action: Action) => void;
};

/** Injection key used by TabProvider (provide) and Tab/TabPanel (inject). */
export const TAB_PROVIDER_INJECT_KEY: InjectionKey<TabProviderContextValue> = Symbol('LumxTabProvider');

/**
 * Composable equivalent of React's useTabProviderContext.
 * Registers the tab/tabPanel with the provider on mount and unregisters on unmount.
 * Returns a computed ref with the derived tab state, or undefined if no provider is present.
 */
export const useTabProviderContext = (type: TabType, originalId?: string): ComputedRef<TabState | undefined> => {
    const context = inject(TAB_PROVIDER_INJECT_KEY, undefined);

    if (!context) {
        return computed(() => undefined);
    }

    const { state, dispatch } = context;
    const generatedId = useId();
    const id = originalId || generatedId;

    onMounted(() => {
        dispatch({ type: 'register', payload: { type, id } });
    });

    onBeforeUnmount(() => {
        dispatch({ type: 'unregister', payload: { type, id } });
    });

    return computed((): TabState | undefined => {
        const index = state.value.ids[type].indexOf(id);
        if (index === -1) return undefined;
        return {
            isLazy: state.value.isLazy,
            shouldActivateOnFocus: state.value.shouldActivateOnFocus,
            tabId: state.value.ids.tab[index] || '',
            tabPanelId: state.value.ids.tabPanel[index] || '',
            isActive: state.value.activeTabIndex === index,
            changeToTab: () => dispatch({ type: 'setActiveTabIndex', payload: index }),
        };
    });
};

/**
 * Returns the raw tab provider state ref, or undefined if no provider is present.
 */
export const useTabProviderContextState = (): Ref<State> | undefined => {
    return inject(TAB_PROVIDER_INJECT_KEY, undefined)?.state;
};
