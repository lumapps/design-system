import { defineComponent, ref } from 'vue';

import {
    ComboboxState as UI,
    type ComboboxStateProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxState';
import { subscribeComboboxState } from '@lumx/core/js/components/Combobox/subscribeComboboxState';

import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { GenericBlock } from '../generic-block';
import { Text } from '../text';
import { useComboboxContext } from './context/ComboboxContext';
import { useComboboxEvent } from './context/useComboboxEvent';

/**
 * Adapter: maps core's `className` prop to Vue's `class` prop for GenericBlock.
 * Also maps hAlign/vAlign to GenericBlock's horizontalAlign/verticalAlign props.
 * Children are received as Vue slots and forwarded to the GenericBlock component.
 */
const GenericBlockAdapter = (p: any, { slots }: any) => {
    const { className, hAlign, vAlign, ...rest } = p;
    return (
        <GenericBlock class={className} horizontalAlign={hAlign} verticalAlign={vAlign} {...rest}>
            {{ default: slots.default }}
        </GenericBlock>
    );
};

export type ComboboxStateProps = VueToJSXProps<UIProps, 'state'>;

/**
 * Combobox.State component - displays empty and error states for the combobox list.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxState = defineComponent(
    (props: ComboboxStateProps) => {
        const { handle } = useComboboxContext();
        const emptyState = useComboboxEvent('emptyChange', undefined);
        const isLoading = ref(false);
        const shouldAnnounce = ref(false);
        const isOpen = ref(false);

        useWatchDisposable(handle, (h) => {
            if (h) {
                return subscribeComboboxState(h, {
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
            const state = { ...emptyState.value, isLoading: isLoading.value, isOpen: isOpen.value };
            // Only pass loadingMessage to core after the 500ms debounce threshold
            const loadingMessage = shouldAnnounce.value ? props.loadingMessage : undefined;

            return UI(
                {
                    emptyMessage: props.emptyMessage,
                    errorMessage: props.errorMessage,
                    errorTryReloadMessage: props.errorTryReloadMessage,
                    loadingMessage,
                    state,
                },
                { GenericBlock: GenericBlockAdapter, Text: Text as any },
            );
        };
    },
    {
        name: 'LumxComboboxState',
        inheritAttrs: false,
        props: keysOf<ComboboxStateProps>()(
            'emptyMessage',
            'errorMessage',
            'errorTryReloadMessage',
            'loadingMessage',
            'class',
        ),
    },
);

export { COMPONENT_NAME, CLASSNAME };
export default ComboboxState;
