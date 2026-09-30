import { defineComponent, onBeforeUnmount, shallowRef } from 'vue';
import { setupListbox } from '@lumx/core/js/components/Listbox/setupListbox';

import { useId } from '../../composables/useId';
import { getName } from '../../utils/VueToJSX';
import { provideListboxContext } from './context/ListboxContext';

/**
 * Internal standalone listbox provider.
 *
 * Creates the standalone listbox handle (the list owns focus) and shares it with the list,
 * the options and the list state rendered inside.
 */
const ListboxProvider = defineComponent(
    (_props: object, { slots, emit }) => {
        const listboxId = useId();
        // The handle does not need the DOM element: the list mounts it.
        const list = shallowRef(setupListbox({ onSelect: (option) => emit('select', option) }));
        provideListboxContext({ list, listboxId, type: 'listbox' });
        // Tear down the handle (pending timers, subscribers) on unmount.
        onBeforeUnmount(() => list.value.destroy());
        return () => slots.default?.();
    },
    {
        name: getName('ListboxProvider'),
        inheritAttrs: false,
        props: {},
        emits: {
            select: (option: { value: string }) => !!option,
        },
    },
);

export default ListboxProvider;
