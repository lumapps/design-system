import { defineComponent, onWatcherCleanup, ref, shallowRef, useAttrs, watch } from 'vue';

import type { ComboboxHandle } from '@lumx/core/js/components/Combobox/types';

import { useId } from '../../composables/useId';
import { provideComboboxContext } from './context/ComboboxContext';

/**
 * Defines the props of the component.
 */
export interface ComboboxProviderProps {}

/**
 * Combobox.Provider component.
 *
 * Provides shared context to sub-components. The vanilla JS combobox handle is
 * created by the trigger sub-component (Combobox.Input or Combobox.Button) on mount.
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxProvider = defineComponent(
    (_props: ComboboxProviderProps, { slots, emit }) => {
        const attrs = useAttrs();
        const listboxId = useId();
        const anchorRef = ref<HTMLElement | null>(null);
        const handle = shallowRef<ComboboxHandle | null>(null);
        const setHandle = (h: ComboboxHandle | null) => {
            handle.value = h;
        };

        provideComboboxContext({ handle, setHandle, listboxId, anchorRef });

        // Subscribe to the combobox open event and forward to the onOpen callback.
        watch(handle, (handleValue) => {
            if (!handleValue) return;
            const unsubscribe = handleValue.subscribe('open', (isOpen) => {
                (attrs.onOpen as any)?.(isOpen);
                emit('open', isOpen);
            });
            onWatcherCleanup(unsubscribe);
        });

        return () => slots.default?.();
    },
    {
        name: 'LumxComboboxProvider',
        inheritAttrs: false,
        props: {},
        emits: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            open: (isOpen: boolean) => true,
        },
    },
);

export default ComboboxProvider;
