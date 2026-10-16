import { defineComponent, ref, shallowRef, watch } from 'vue';

import { COMBOBOX_PROVIDER_COMPONENT_NAME } from '@lumx/core/js/components/Combobox/constants';
import type { ComboboxEventMap, ComboboxHandle } from '@lumx/core/js/components/Combobox/types';

import { useId } from '../../composables/useId';
import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { getName } from '../../utils/VueToJSX';
import { provideComboboxContext } from './context/ComboboxContext';
import { provideCompositeContext } from '../composite/CompositeContext';
import { useCompositeEvent } from '../composite/useCompositeEvent';

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
 * The list handle is created by the list component, which registers it on the combobox handle:
 * the provider shares the registered list with the sub-components (composite context).
 *
 * @param props Component props.
 * @return Vue element.
 */
const ComboboxProvider = defineComponent(
    (props: ComboboxProviderProps, { slots, emit }) => {
        const listboxId = useId();
        const anchorRef = ref<HTMLElement | null>(null);
        const handle = shallowRef<ComboboxHandle | null>(null);
        const setHandle = (h: ComboboxHandle | null) => {
            handle.value = h;
        };

        // The list registered on the combobox (updated when the list component registers or unregisters it).
        const list = useCompositeEvent<ComboboxEventMap, 'composite'>(handle, 'composite', null);

        provideComboboxContext({ handle, setHandle, listboxId, anchorRef });
        // The list of the combobox: shared with the list, the options and the state through the composite context.
        // No `type`: the list element provides it (the registered list may be any composite).
        provideCompositeContext({ handle: list, id: listboxId, comboboxListId: listboxId });

        // Force the always open state (`undefined`: the core detects the inline listbox).
        watch([handle, () => props.alwaysOpen], ([handleValue, alwaysOpen]) => {
            handleValue?.setAlwaysOpen(alwaysOpen);
        });

        // Subscribe to the open event and forward it as the `open` event.
        useWatchDisposable(handle, (handleValue) => handleValue?.subscribe('open', (isOpen) => emit('open', isOpen)));

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
