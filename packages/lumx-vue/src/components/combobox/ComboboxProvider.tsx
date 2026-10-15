import { computed, defineComponent, onWatcherCleanup, ref, shallowRef, useAttrs, watch } from 'vue';

import { COMBOBOX_PROVIDER_COMPONENT_NAME } from '@lumx/core/js/components/Combobox/constants';
import type { ComboboxHandle } from '@lumx/core/js/components/Combobox/types';

import { useId } from '../../composables/useId';
import { getName } from '../../utils/VueToJSX';
import { provideComboboxContext } from './context/ComboboxContext';
import { provideListboxContext } from '../listbox/context/ListboxContext';

/**
 * Defines the props of the component.
 */
export interface ComboboxProviderProps {
    /**
     * Keep the listbox always open (inline listbox).
     * By default, the listbox is always open when the combobox contains no `Combobox.Popover`.
     */
    alwaysOpen?: boolean;
}

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
    (props: ComboboxProviderProps, { slots, emit }) => {
        const attrs = useAttrs();
        const listboxId = useId();
        const anchorRef = ref<HTMLElement | null>(null);
        const handle = shallowRef<ComboboxHandle | null>(null);
        const setHandle = (h: ComboboxHandle | null) => {
            handle.value = h;
        };

        provideComboboxContext({ handle, setHandle, listboxId, anchorRef });
        // The listbox of the combobox: shared with the list, the options and the state through the listbox context.
        provideListboxContext({ list: computed(() => handle.value?.list ?? null), listboxId, type: 'listbox' });

        // Force the always open state (`undefined`: the core detects the inline listbox).
        watch([handle, () => props.alwaysOpen], ([handleValue, alwaysOpen]) => {
            handleValue?.setAlwaysOpen(alwaysOpen);
        });

        // Subscribe to the open event and forward to the onOpen callback.
        watch(handle, (handleValue) => {
            if (!handleValue) return;
            const unsubscribe = handleValue.list.subscribe('open', (isOpen) => {
                (attrs.onOpen as any)?.(isOpen);
                emit('open', isOpen);
            });
            onWatcherCleanup(unsubscribe);
        });

        return () => slots.default?.();
    },
    {
        name: getName(COMBOBOX_PROVIDER_COMPONENT_NAME),
        inheritAttrs: false,
        props: {
            // `undefined` by default (Vue casts a missing boolean prop to `false`).
            alwaysOpen: { type: Boolean, default: undefined },
        },
        emits: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            open: (isOpen: boolean) => true,
        },
    },
);

export default ComboboxProvider;
