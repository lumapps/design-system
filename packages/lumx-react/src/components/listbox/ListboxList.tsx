import { useMemo, useRef } from 'react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import {
    ListboxList as UI,
    ListboxListProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxList';
import { setupListbox } from '@lumx/core/js/components/Listbox/setupListbox';
import type { ListboxHandle } from '@lumx/core/js/components/Listbox/types';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { CompositeContext, CompositeContextValue, useCompositeContext } from '../composite/CompositeContext';
import { useCompositeList } from '../composite/useCompositeList';
import { useOptionalComboboxContext } from '../combobox/context/ComboboxContext';
import { useListboxHandle } from './context/useListboxHandle';

/** Props of the list component (`Combobox.List` and `Listbox.List`). */
export interface ListboxListProps extends ReactToJSX<UIProps, 'aria-busy'> {}

/**
 * List component (`Combobox.List` and `Listbox.List`): the WAI-ARIA listbox pattern by default (`role="listbox"` with
 * `role="option"` items), or the grid pattern with `type="grid"` (`role="grid"` with one
 * `role="row"` per option, made of the option `role="gridcell"` and its action cells).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/grid/
 *
 * Mounts a listbox handle on its element:
 * - Inside a combobox (`Combobox.Provider`): creates the listbox handle with the combobox list options and
 *   registers it on the combobox. Renders its options only while the combobox is open. The trigger owns focus.
 * - Inside a `ListboxProvider`: a standalone list that owns focus (`tabindex="0"` +
 *   `aria-activedescendant`) and handles its own keyboard navigation. A `ListboxProvider` nested
 *   in a combobox wins (the list stays standalone and does not register on the combobox).
 */
export const ListboxList = forwardRef<ListboxListProps, HTMLUListElement>((props, ref) => {
    const { 'aria-label': ariaLabel, type = 'listbox', className, children, ...forwardedProps } = props;
    const { id: listboxId } = useCompositeContext();
    const providedList = useListboxHandle();
    const comboboxContext = useOptionalComboboxContext();
    const combobox = comboboxContext?.handle ?? null;

    // A nearer standalone listbox (`ListboxProvider` inside the combobox) wins over the combobox.
    // Inside a combobox, the provided handle is the registered list, which is linked (not standalone).
    const isStandalone = !!providedList?.isStandalone;

    const internalRef = useRef<HTMLUListElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);

    // Inside a combobox: create the listbox handle (linked to the trigger) and register it on the combobox.
    const {
        handle: list,
        isOpen,
        isLoading,
    } = useCompositeList<ListboxHandle>({
        elementRef: internalRef,
        combobox: comboboxContext && !isStandalone ? { handle: combobox, createList: setupListbox } : undefined,
        standaloneHandle: providedList,
    });

    const selectionType = String(forwardedProps['aria-multiselectable']) === 'true' ? 'multiple' : 'single';

    const contextValue = useMemo<CompositeContextValue>(
        () => ({ handle: list, id: listboxId, type, selectionType, level: 0 }),
        [list, listboxId, type, selectionType],
    );

    return (
        <CompositeContext.Provider value={contextValue}>
            {UI({
                ...forwardedProps,
                // Standalone: the list itself is the (single) tab stop.
                ...(list?.isStandalone ? { tabIndex: 0 } : {}),
                'aria-label': ariaLabel,
                'aria-busy': isLoading || undefined,
                className,
                ref: mergedRef,
                id: listboxId,
                type,
                children: isOpen ? children : null,
            } as UIProps)}
        </CompositeContext.Provider>
    );
});
ListboxList.displayName = COMPONENT_NAME;
ListboxList.className = CLASSNAME;
