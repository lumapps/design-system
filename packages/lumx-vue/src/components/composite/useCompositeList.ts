import { type Ref, type ShallowRef, shallowRef, watch } from 'vue';

import type { ComboboxHandle } from '@lumx/core/js/components/Combobox/types';
import type { CompositeHandle, CompositeOptions } from '@lumx/core/js/components/Composite/types';

import { useWatchDisposable } from '../../composables/useWatchDisposable';
import { useCompositeEvent } from './useCompositeEvent';

/** Options of {@link useCompositeList}. */
export interface UseCompositeListOptions<H extends CompositeHandle> {
    /** The list element, mounted on the handle. */
    elementRef: Readonly<Ref<HTMLElement | null>>;
    /**
     * The combobox the list belongs to: the list creates its handle with the combobox list options and
     * registers it on the combobox. Omit for a standalone list.
     */
    combobox?: {
        /** The combobox handle (null until the trigger mounts). */
        handle: Readonly<Ref<ComboboxHandle | null>>;
        /** Create the list handle (e.g. `setupListbox` or `setupTreeList`) from the combobox list options. */
        createList(options: CompositeOptions): H;
    };
    /** The handle of a standalone list (used when `combobox` is omitted). */
    standaloneHandle?: Readonly<Ref<H | null>>;
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
 * Set up the handle of a list component (`Combobox.List`, `TreeList`):
 * - Inside a combobox: create the handle (linked to the trigger) when the combobox handle exists, register it
 *   on the combobox, then unregister and destroy it on unmount or when the combobox handle changes.
 * - Mount the list element on the handle.
 * - Replay the pending keyboard navigation after the items render on open.
 */
export function useCompositeList<H extends CompositeHandle>(
    options: UseCompositeListOptions<H>,
): UseCompositeListResult<H> {
    const { elementRef, combobox, standaloneHandle } = options;

    let handle: Readonly<Ref<H | null>> = standaloneHandle ?? shallowRef<H | null>(null);
    if (combobox) {
        const comboboxList: ShallowRef<H | null> = shallowRef(null);
        useWatchDisposable(combobox.handle, (comboboxHandle) => {
            if (!comboboxHandle) return undefined;
            const newList = combobox.createList(comboboxHandle.listOptions);
            const unregister = comboboxHandle.registerList(newList);
            comboboxList.value = newList;
            return () => {
                unregister();
                newList.destroy();
                if (comboboxList.value === newList) comboboxList.value = null;
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
