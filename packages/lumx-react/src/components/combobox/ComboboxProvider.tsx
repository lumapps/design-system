import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import type { ComboboxEventMap, ComboboxHandle } from '@lumx/core/js/components/Combobox/types';
import { useId } from '@lumx/react/hooks/useId';

import { ComboboxContext } from './context/ComboboxContext';
import { CompositeContext, CompositeContextValue } from '../composite/CompositeContext';
import { useCompositeEvent } from '../composite/useCompositeEvent';

/**
 * Defines the props of the component.
 */
export interface ComboboxProviderProps {
    /** Combobox content. */
    children?: ReactNode;
    /** Callback fired when the combobox open state changes. */
    onOpen?: (isOpen: boolean) => void;
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
 * @return React element.
 */
export function ComboboxProvider(props: ComboboxProviderProps) {
    const { children, onOpen, alwaysOpen } = props;
    const listboxId = useId();
    const anchorRef = useRef<HTMLElement>(null);
    const [handle, setHandle] = useState<ComboboxHandle | null>(null);
    // The list registered on the combobox (updated when the list component registers or unregisters it).
    const list = useCompositeEvent<ComboboxEventMap, 'composite'>(handle, 'composite', null);
    const contextValue = useMemo(() => ({ handle, setHandle, listboxId, anchorRef }), [handle, listboxId]);
    // The list of the combobox: shared with the list, the options and the state through the composite context.
    // No `type`: the list element provides it (the registered list may be any composite).
    const compositeContextValue = useMemo<CompositeContextValue>(
        () => ({ handle: list, id: listboxId, comboboxListId: listboxId }),
        [list, listboxId],
    );

    // Force the always open state (`undefined`: the core detects the inline listbox).
    useEffect(() => {
        handle?.setAlwaysOpen(alwaysOpen);
    }, [handle, alwaysOpen]);

    // Subscribe to the open event and forward to the onOpen callback.
    const onOpenRef = useRef(onOpen);
    onOpenRef.current = onOpen;
    useEffect(() => {
        if (!handle) return undefined;
        return handle.subscribe('open', (isOpen) => {
            onOpenRef.current?.(isOpen);
        });
    }, [handle]);

    return (
        <ComboboxContext.Provider value={contextValue}>
            <CompositeContext.Provider value={compositeContextValue}>{children}</CompositeContext.Provider>
        </ComboboxContext.Provider>
    );
}

ComboboxProvider.displayName = 'Combobox.Provider';
