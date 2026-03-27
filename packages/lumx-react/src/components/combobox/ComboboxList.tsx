import { useEffect, useMemo, useRef, useState } from 'react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import {
    ComboboxList as UI,
    COMPONENT_NAME,
    CLASSNAME,
    type ComboboxListType,
} from '@lumx/core/js/components/Combobox/ComboboxList';
import { ListProps } from '@lumx/react/components/list';
import { useComboboxContext } from './context/ComboboxContext';
import { ComboboxListContext } from './context/ComboboxListContext';

/**
 * Props for Combobox.List component.
 * Note: role, id are set internally and cannot be overridden.
 */
export interface ComboboxListProps extends ListProps {
    /** Accessible label for the listbox (required for accessibility). */
    'aria-label': string;
    /**
     * The popup type. Set to "grid" when options have action buttons (Combobox.OptionAction).
     * Enables 2D keyboard navigation and switches ARIA roles from listbox/option to grid/gridcell.
     * @default 'listbox'
     */
    type?: ComboboxListType;
}

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

    // Register the list as the listbox when the handle becomes available
    useEffect(() => {
        const list = internalRef.current;
        if (!list) return undefined;
        return handle?.registerListbox(list);
    }, [handle]);

    // Track loading state for aria-busy (auto-derived from skeleton registrations).
    // Uses both the handle's synchronous getter (for initial state) and the loadingChange event
    // (for subsequent updates), because child useEffects (skeleton registration) run before
    // parent subscriptions — relying on events alone would miss the initial notification.
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (!handle) return undefined;
        // Read current state synchronously (catches registrations that happened before subscription)
        setIsLoading(handle.isLoading);
        return handle.subscribe('loadingChange', setIsLoading);
    }, [handle]);

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
                children,
            })}
        </ComboboxListContext.Provider>
    );
});

ComboboxList.displayName = COMPONENT_NAME;
ComboboxList.className = CLASSNAME;
