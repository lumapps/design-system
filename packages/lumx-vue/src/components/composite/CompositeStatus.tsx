import { defineComponent, ref } from 'vue';

import {
    CompositeStatus as UI,
    type CompositeStatusProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Composite/CompositeStatus';
import { subscribeListboxState } from '@lumx/core/js/components/Listbox/subscribeListboxState';

import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { GenericBlock } from '../generic-block';
import { Text } from '../text';
import { useCompositeContext } from './CompositeContext';
import { useCompositeEvent } from './useCompositeEvent';

export type CompositeStatusProps = VueToJSXProps<UIProps, 'state'>;

/**
 * CompositeStatus: the live region of a composite (list, grid or tree), exposed as `Combobox.State` and
 * `Listbox.State`. Displays the empty, loading, error and item count messages.
 *
 * @param props Component props.
 * @return Vue element.
 */
const CompositeStatus = defineComponent(
    (props: CompositeStatusProps) => {
        const { handle: list } = useCompositeContext();
        const optionsState = useCompositeEvent(list, 'optionsChange', undefined);
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
                { GenericBlock, Text },
            );
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<CompositeStatusProps>()(
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
export default CompositeStatus;
