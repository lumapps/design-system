import { type Ref, type ShallowRef, shallowRef, watch } from 'vue';

import type { CompositeHandle, CompositeOptions } from '@lumx/core/js/components/Composite/types';

import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { useOptionalComboboxContext } from '../combobox/context/ComboboxContext';
import { useOptionalCompositeContext } from './CompositeContext';
import { useCompositeEvent } from './useCompositeEvent';

/** Options of {@link useCompositeList}. */
export interface UseCompositeListOptions<H extends CompositeHandle> {
    /** The list element, mounted on the handle. */
    elementRef: Readonly<Ref<HTMLElement | null>>;
    /** Create the list handle (e.g. `setupListbox`) with the combobox list options. */
    createList(options: CompositeOptions): H;
    /** Standalone list: the handle of the list provider above the list (e.g. `ListboxProvider`). */
    standaloneHandle: Readonly<Ref<H | null>>;
}

/** Result of {@link useCompositeList}. */
export interface UseCompositeListResult<H extends CompositeHandle> {
    /** The list handle (null inside a combobox until the trigger mounts). */
    handle: Readonly<Ref<H | null>>;
    /** Whether the items are visible (standalone: always; combobox: while open). */
    isOpen: Readonly<Ref<boolean>>;
    /** Whether root skeletons are registered (`aria-busy` on the list). */
    isLoading: Readonly<Ref<boolean>>;
}

/**
 * Set up the handle of a list component (e.g. `Combobox.List`, `Listbox.List`):
 * - The list is the combobox list when its nearest composite context is the one of `Combobox.Provider` (it
 *   carries `comboboxListId`). Set on setup.
 * - Combobox list: attach the handle (linked to the trigger) when the combobox handle exists, then detach it on
 *   unmount or when the combobox handle changes.
 * - Standalone list: the handle of the list provider.
 * - Mount the list element on the handle.
 * - Replay the pending keyboard navigation after the items render on open.
 */
export function useCompositeList<H extends CompositeHandle>(
    options: UseCompositeListOptions<H>,
): UseCompositeListResult<H> {
    const { elementRef, createList, standaloneHandle } = options;
    const comboboxContext = useOptionalComboboxContext();
    const isInCombobox = useOptionalCompositeContext()?.comboboxListId !== undefined;

    let handle: Readonly<Ref<H | null>> = standaloneHandle;
    if (isInCombobox && comboboxContext) {
        const comboboxList: ShallowRef<H | null> = shallowRef(null);
        useWatchDisposable(comboboxContext.handle, (comboboxHandle) => {
            if (!comboboxHandle) return undefined;
            const { list, detach } = comboboxHandle.attachList(createList);
            comboboxList.value = list;
            return () => {
                detach();
                if (comboboxList.value === list) comboboxList.value = null;
            };
        });
        handle = comboboxList;
    }

    // Mount the list element on the handle.
    useWatchDisposable([handle, elementRef], ([handleValue, element]) => {
        if (!handleValue || !element) return undefined;
        return handleValue.mount(element);
    });

    const isLoading = useCompositeEvent(handle, 'loadingChange', false);
    const isOpen = useCompositeEvent(handle, 'open', false);
    const optionsState = useCompositeEvent(handle, 'optionsChange', undefined);

    // Replay the pending keyboard navigation (that could not run while hidden) after the items render.
    watch(
        [isOpen, () => optionsState.value?.optionsLength],
        () => {
            if (isOpen.value) handle.value?.flushPendingNavigation();
        },
        { flush: 'post' },
    );

    return { handle, isOpen, isLoading };
}
