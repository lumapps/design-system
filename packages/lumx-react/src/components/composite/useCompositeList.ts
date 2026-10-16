import { RefObject, useEffect, useRef, useState } from 'react';

import type { ComboboxHandle } from '@lumx/core/js/components/Combobox/types';
import type { CompositeHandle, CompositeOptions } from '@lumx/core/js/components/Composite/types';
import { useCompositeEvent } from './useCompositeEvent';

/** Options of {@link useCompositeList}. */
export interface UseCompositeListOptions<H extends CompositeHandle> {
    /** The list element, mounted on the handle. */
    elementRef: RefObject<HTMLElement | null>;
    /**
     * The combobox the list belongs to: the list creates its handle with the combobox list options and
     * registers it on the combobox. Omit for a standalone list.
     */
    combobox?: {
        /** The combobox handle (null until the trigger mounts). */
        handle: ComboboxHandle | null;
        /** Create the list handle (e.g. `setupListbox` or `setupTreeList`) from the combobox list options. */
        createList(options: CompositeOptions): H;
    };
    /** The handle of a standalone list (used when `combobox` is omitted). */
    standaloneHandle?: H | null;
}

/** Result of {@link useCompositeList}. */
export interface UseCompositeListResult<H extends CompositeHandle> {
    /** The list handle (null inside a combobox until the trigger mounts). */
    handle: H | null;
    /** Whether the items are visible (standalone: always; combobox: while open). */
    isOpen: boolean;
    /** Whether root skeletons are registered (`aria-busy` on the list). */
    isLoading: boolean;
}

/**
 * Set up the handle of a list component (`Combobox.List`, `TreeList`):
 * - Inside a combobox: create the handle (linked to the trigger) when the combobox handle exists, register it
 *   on the combobox, then unregister and destroy it on unmount or when the combobox handle changes.
 * - Mount the list element on the handle.
 * - Replay the pending keyboard navigation after the items commit on open.
 */
export function useCompositeList<H extends CompositeHandle>(
    options: UseCompositeListOptions<H>,
): UseCompositeListResult<H> {
    const { elementRef, combobox, standaloneHandle = null } = options;
    const comboboxHandle = combobox?.handle ?? null;
    // Latest factory (the registration only depends on the combobox handle).
    const createListRef = useRef(combobox?.createList);
    createListRef.current = combobox?.createList;

    const [comboboxList, setComboboxList] = useState<H | null>(null);
    useEffect(() => {
        const createList = createListRef.current;
        if (!comboboxHandle || !createList) return undefined;
        const newList = createList(comboboxHandle.listOptions);
        const unregister = comboboxHandle.registerList(newList);
        setComboboxList(newList);
        return () => {
            unregister();
            newList.destroy();
            setComboboxList(null);
        };
    }, [comboboxHandle]);
    const handle = combobox ? comboboxList : standaloneHandle;

    const isOpen = useCompositeEvent(handle, 'open', false);
    const optionsState = useCompositeEvent(handle, 'optionsChange', undefined);
    const visibleCount = optionsState?.optionsLength ?? 0;
    const isLoading = useCompositeEvent(handle, 'loadingChange', false);

    // Mount the list element on the handle.
    useEffect(() => {
        const element = elementRef.current;
        if (!element) return undefined;
        return handle?.mount(element);
    }, [handle, elementRef]);

    // Replay the pending keyboard navigation after the items commit on open.
    useEffect(() => {
        if (isOpen) handle?.flushPendingNavigation();
    }, [isOpen, visibleCount, handle]);

    return { handle, isOpen, isLoading };
}
