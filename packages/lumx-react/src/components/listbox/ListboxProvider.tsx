import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { setupListbox } from '@lumx/core/js/components/Listbox/setupListbox';
import { useId } from '@lumx/react/hooks/useId';
import { ListboxContext, ListboxContextValue } from './context/ListboxContext';

/**
 * Defines the props of the component.
 */
export interface ListboxProviderProps {
    /** Listbox content (the list and its state). */
    children?: ReactNode;
    /** Called when an option is selected (click, Enter or Space). */
    onSelect?(option: { value: string }): void;
}

/**
 * Internal standalone listbox provider.
 *
 * Creates the standalone listbox handle (the list owns focus) and shares it with the list,
 * the options and the list state rendered inside.
 *
 * @param props Component props.
 * @return React element.
 */
export function ListboxProvider(props: ListboxProviderProps) {
    const { children, onSelect } = props;
    const listboxId = useId();

    const onSelectRef = useRef(onSelect);
    onSelectRef.current = onSelect;
    // The handle does not need the DOM element: the list mounts it.
    const [list] = useState(() => setupListbox({ onSelect: (option) => onSelectRef.current?.(option) }));
    // Tear down the handle (pending timers, subscribers) on unmount.
    useEffect(() => () => list.destroy(), [list]);

    const contextValue = useMemo<ListboxContextValue>(() => ({ list, listboxId, type: 'listbox' }), [list, listboxId]);
    return <ListboxContext.Provider value={contextValue}>{children}</ListboxContext.Provider>;
}
ListboxProvider.displayName = 'ListboxProvider';
