import { RefObject, useEffect, useRef, useState } from 'react';

import type { CompositeHandle, CompositeOptions } from '@lumx/core/js/components/Composite/types';
import { useOptionalComboboxContext } from '../combobox/context/ComboboxContext';
import { useOptionalCompositeContext } from './CompositeContext';
import { useCompositeEvent } from './useCompositeEvent';

/** Options of {@link useCompositeList}. */
export interface UseCompositeListOptions<H extends CompositeHandle> {
    /** The list element, mounted on the handle. */
    elementRef: RefObject<HTMLElement | null>;
    /** Create the list handle (e.g. `setupListbox`): with the combobox list options, or as a standalone list. */
    createList(options: CompositeOptions): H;
    /**
     * Standalone list: the handle of the list provider above the list (e.g. `ListboxProvider`). When undefined,
     * the hook creates the standalone handle with `createList` (and destroys it on unmount).
     */
    standaloneHandle?: H | null;
    /** Standalone list created by the hook: called on a selection. */
    onSelect?(option: { value: string }): void;
}

/** Result of {@link useCompositeList}. */
export interface UseCompositeListResult<H extends CompositeHandle> {
    /** The list handle (null inside a combobox until the trigger mounts). */
    handle: H | null;
    /** The combobox list ID when the list is the combobox list (the trigger `aria-controls` it), else undefined. */
    comboboxListId?: string;
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
 * - Standalone list: the handle of the list provider, or a handle created on the first render.
 * - Mount the list element on the handle.
 * - Replay the pending keyboard navigation after the items commit on open.
 */
export function useCompositeList<H extends CompositeHandle>(
    options: UseCompositeListOptions<H>,
): UseCompositeListResult<H> {
    const { elementRef, createList, standaloneHandle, onSelect } = options;
    const comboboxContext = useOptionalComboboxContext();
    const parent = useOptionalCompositeContext();
    const [comboboxListId] = useState(() => parent?.comboboxListId);
    const isInCombobox = comboboxListId !== undefined;
    const comboboxHandle = isInCombobox ? comboboxContext?.handle ?? null : null;

    // Latest callbacks (the handles are created once).
    const latest = useRef({ createList, onSelect });
    latest.current = { createList, onSelect };

    // Standalone list without a list provider: create its own handle.
    const [ownHandle] = useState(() =>
        isInCombobox || standaloneHandle !== undefined
            ? null
            : createList({ onSelect: (option) => latest.current.onSelect?.(option) }),
    );
    useEffect(() => () => ownHandle?.destroy(), [ownHandle]);

    const [comboboxList, setComboboxList] = useState<H | null>(null);
    useEffect(() => {
        if (!comboboxHandle) return undefined;
        const { list, detach } = comboboxHandle.attachList(latest.current.createList);
        setComboboxList(list);
        return () => {
            detach();
            setComboboxList(null);
        };
    }, [comboboxHandle]);
    const handle = isInCombobox ? comboboxList : standaloneHandle ?? ownHandle;

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

    return { handle, comboboxListId, isOpen, isLoading };
}
