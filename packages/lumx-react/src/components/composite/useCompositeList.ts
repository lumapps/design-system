import { RefObject, useEffect, useRef, useState } from 'react';

import type { CompositeHandle, CompositeOptions } from '@lumx/core/js/components/Composite/types';
import { useOptionalComboboxContext } from '../combobox/context/ComboboxContext';
import { useOptionalCompositeContext } from './CompositeContext';
import { useCompositeEvent } from './useCompositeEvent';

/** Options of {@link useCompositeList}. */
export interface UseCompositeListOptions<H extends CompositeHandle> {
    /** The list element, mounted on the handle. */
    elementRef: RefObject<HTMLElement | null>;
    /** Create the list handle (e.g. `setupListbox`) with the combobox list options. */
    createList(options: CompositeOptions): H;
    /** Standalone list: the handle of the list provider above the list (e.g. `ListboxProvider`). */
    standaloneHandle: H | null;
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
 * Set up the handle of a list component (e.g. `Combobox.List`, `Listbox.List`):
 * - The list is the combobox list when its nearest composite context is the one of `Combobox.Provider` (it
 *   carries `comboboxListId`). Set on the first render.
 * - Combobox list: attach the handle (linked to the trigger) when the combobox handle exists, then detach it on
 *   unmount or when the combobox handle changes.
 * - Standalone list: the handle of the list provider.
 * - Mount the list element on the handle.
 * - Replay the pending keyboard navigation after the items commit on open.
 */
export function useCompositeList<H extends CompositeHandle>(
    options: UseCompositeListOptions<H>,
): UseCompositeListResult<H> {
    const { elementRef, createList, standaloneHandle } = options;
    const comboboxContext = useOptionalComboboxContext();
    const parent = useOptionalCompositeContext();
    const [isInCombobox] = useState(() => parent?.comboboxListId !== undefined);
    const comboboxHandle = isInCombobox ? comboboxContext?.handle ?? null : null;

    // Latest factory (the handle is created once per combobox handle).
    const createListRef = useRef(createList);
    createListRef.current = createList;

    const [comboboxList, setComboboxList] = useState<H | null>(null);
    useEffect(() => {
        if (!comboboxHandle) return undefined;
        const { list, detach } = comboboxHandle.attachList(createListRef.current);
        setComboboxList(list);
        return () => {
            detach();
            setComboboxList(null);
        };
    }, [comboboxHandle]);
    const handle = isInCombobox ? comboboxList : standaloneHandle;

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
