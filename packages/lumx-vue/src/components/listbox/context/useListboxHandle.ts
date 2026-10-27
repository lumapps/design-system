import { computed, type Ref } from 'vue';
import type { ListboxHandle } from '@lumx/core/js/components/Listbox/types';
import { isListboxHandle } from '@lumx/core/js/components/Listbox/utils';
import { useCompositeContext } from '../../composite/CompositeContext';

/** The listbox handle of the composite context (null while there is none, or when it is not a listbox). */
export function useListboxHandle(): Readonly<Ref<ListboxHandle | null>> {
    const { handle } = useCompositeContext();
    return computed(() => (isListboxHandle(handle.value) ? handle.value : null));
}
