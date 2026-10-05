import { defineComponent, ref } from 'vue';

import {
    ListboxState as UI,
    type ListboxStateProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxState';
import { subscribeListboxState } from '@lumx/core/js/components/Listbox/subscribeListboxState';

import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { GenericBlock } from '../generic-block';
import { Text } from '../text';
import { useListboxEvent } from './context/useListboxEvent';
import { useListboxContext } from './context/ListboxContext';

export type ListboxStateProps = VueToJSXProps<UIProps, 'state'>;

/**
 * Combobox.State component - displays empty and error states for the combobox list.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ListboxState = defineComponent(
    (props: ListboxStateProps) => {
        const { list } = useListboxContext();
        const optionsState = useListboxEvent(list, 'optionsChange', undefined);
        const isLoading = ref(false);
        const shouldAnnounce = ref(false);
        const isOpen = ref(false);

        useWatchDisposable(list, (listValue) => {
            if (listValue) {
                return subscribeListboxState(listValue, {
                    setIsLoading: (v) => {
                        isLoading.value = v;
                    },
                    setShouldAnnounce: (v) => {
                        shouldAnnounce.value = v;
                    },
                    setIsOpen: (v) => {
                        isOpen.value = v;
                    },
                });
            }
        });

        return () => {
            const state = { ...optionsState.value, isLoading: isLoading.value, isOpen: isOpen.value };
            // Only pass loadingMessage to core after the 500ms debounce threshold
            const loadingMessage = shouldAnnounce.value ? props.loadingMessage : undefined;

            return UI(
                {
                    emptyMessage: props.emptyMessage,
                    nbOptionMessage: props.nbOptionMessage,
                    errorMessage: props.errorMessage,
                    errorTryReloadMessage: props.errorTryReloadMessage,
                    loadingMessage,
                    state,
                },
                { GenericBlock, Text: Text as any },
            );
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<ListboxStateProps>()(
            'emptyMessage',
            'nbOptionMessage',
            'errorMessage',
            'errorTryReloadMessage',
            'loadingMessage',
            'class',
        ),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ListboxState;
