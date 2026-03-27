import { defineComponent, provide, ref, useSlots, watch } from 'vue';

import {
    INIT_STATE,
    reducer,
    type Action,
    type State,
} from '@lumx/core/js/components/Tabs/state';

import { TAB_PROVIDER_INJECT_KEY } from './state';

export interface TabProviderProps {
    /** Active tab index (controlled mode). */
    activeTabIndex?: number;
    /** Tab panel children should not render if the tab panel is hidden. */
    isLazy?: boolean;
    /** Activate tabs on focus. */
    shouldActivateOnFocus?: boolean;
}

const DEFAULT_PROPS: Partial<TabProviderProps> = {
    isLazy: INIT_STATE.isLazy,
    shouldActivateOnFocus: INIT_STATE.shouldActivateOnFocus,
};

export const emitSchema = {
    change: (index: number) => typeof index === 'number',
};

/**
 * This component provides a context in which tabs can be defined and linked to their tab panel.
 *
 * It does not produce any markup so you can wrap it around any Vue elements and then split
 * the TabList and TabPanel components in the component tree.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const TabProvider = defineComponent(
    (props: TabProviderProps, { emit, slots }) => {
        const state = ref<State>({
            ...INIT_STATE,
            isLazy: props.isLazy ?? INIT_STATE.isLazy,
            shouldActivateOnFocus: props.shouldActivateOnFocus ?? INIT_STATE.shouldActivateOnFocus,
            ...(props.activeTabIndex !== undefined ? { activeTabIndex: props.activeTabIndex } : {}),
        });

        const dispatch = (action: Action) => {
            state.value = reducer(state.value, action);
        };

        provide(TAB_PROVIDER_INJECT_KEY, { state, dispatch });

        // On prop change → sync internal state (mirrors React's useEffect on propState).
        watch(
            [() => props.activeTabIndex, () => props.isLazy, () => props.shouldActivateOnFocus],
            () => {
                dispatch({
                    type: 'update',
                    payload: {
                        isLazy: props.isLazy ?? DEFAULT_PROPS.isLazy,
                        shouldActivateOnFocus: props.shouldActivateOnFocus ?? DEFAULT_PROPS.shouldActivateOnFocus,
                        ...(props.activeTabIndex !== undefined ? { activeTabIndex: props.activeTabIndex } : {}),
                    },
                });
            },
        );

        // On internal active tab index change → emit change event (for controlled mode).
        watch(
            () => state.value.activeTabIndex,
            (newIndex) => {
                if (props.activeTabIndex !== newIndex) {
                    emit('change', newIndex);
                }
            },
        );

        return () => slots.default?.();
    },
    {
        name: 'LumxTabProvider',
        props: {
            activeTabIndex: { required: false },
            isLazy: { required: false },
            shouldActivateOnFocus: { required: false },
        },
        emits: emitSchema,
    },
);

export default TabProvider;
