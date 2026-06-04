import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import {
    ComboboxList as UI,
    ComboboxListProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxList';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { useComboboxContext } from './context/ComboboxContext';
import { ComboboxListContext } from './context/ComboboxListContext';
import { useComboboxOpen } from './context/useComboboxOpen';
import { useComboboxEvent } from './context/useComboboxEvent';

/** Props for Combobox.List component. */
export interface ComboboxListProps extends ReactToJSX<UIProps, 'aria-busy'> {}

/**
 * Combobox.List component - wraps List with listbox ARIA attributes.
 * Registers itself as the combobox listbox on mount.
 *
 * To render the list inside a popover, wrap it with Combobox.Popover.
 *
 * @param props Component props.
 * @param ref   Component ref.
 * @return React element.
 */
export const ComboboxList = forwardRef<ComboboxListProps, HTMLUListElement>((props, ref) => {
    const { listboxId, handle } = useComboboxContext();
    const { 'aria-label': ariaLabel, type = 'listbox', className, children, ...forwardedProps } = props;
    const internalRef = useRef<HTMLUListElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);
    const listContextValue = useMemo(() => ({ type }), [type]);
    const [isOpen] = useComboboxOpen();
    const options = useComboboxEvent('optionsChange', undefined);
    const visibleCount = options?.optionsLength ?? 0;

    // Register list as listbox when handle is available.
    useEffect(() => {
        const list = internalRef.current;
        if (!list) return undefined;
        return handle?.registerListbox(list);
    }, [handle]);

    // Track loading state for aria-busy
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (!handle) return undefined;
        // Read current state synchronously (catches registrations before subscription).
        setIsLoading(handle.isLoading);
        return handle.subscribe('loadingChange', setIsLoading);
    }, [handle]);

    // Flush pending keyboard navigation after options commit on open.
    useLayoutEffect(() => {
        if (isOpen) handle?.flushPendingNavigation();
    }, [isOpen, visibleCount, handle]);

    return (
        <ComboboxListContext.Provider value={listContextValue}>
            {UI({
                ...forwardedProps,
                'aria-label': ariaLabel,
                'aria-busy': isLoading || undefined,
                className,
                ref: mergedRef,
                id: listboxId,
                type,
                children: isOpen ? children : null,
            })}
        </ComboboxListContext.Provider>
    );
});

ComboboxList.displayName = COMPONENT_NAME;
ComboboxList.className = CLASSNAME;
