import { useEffect, useMemo, useRef } from 'react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import {
    ListboxList as UI,
    ListboxListProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxList';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { CompositeContext, CompositeContextValue, useCompositeContext } from '../composite/CompositeContext';
import { useCompositeEvent } from '../composite/useCompositeEvent';
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
 * Mounts the listbox handle of the enclosing provider on its element:
 * - Inside a combobox (`Combobox.Provider`): renders its options only while the combobox is open.
 *   The trigger owns focus.
 * - Inside a `ListboxProvider`: a standalone list that owns focus (`tabindex="0"` +
 *   `aria-activedescendant`) and handles its own keyboard navigation.
 */
export const ListboxList = forwardRef<ListboxListProps, HTMLUListElement>((props, ref) => {
    const { 'aria-label': ariaLabel, type = 'listbox', className, children, ...forwardedProps } = props;
    const { id: listboxId } = useCompositeContext();
    const list = useListboxHandle();

    const internalRef = useRef<HTMLUListElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);

    const selectionType = String(forwardedProps['aria-multiselectable']) === 'true' ? 'multiple' : 'single';

    const contextValue = useMemo<CompositeContextValue>(
        () => ({ handle: list, id: listboxId, type, selectionType, level: 0 }),
        [list, listboxId, type, selectionType],
    );

    // Options are rendered only while visible (standalone: always; combobox: while open).
    const isOpen = useCompositeEvent(list, 'open', false);
    const options = useCompositeEvent(list, 'optionsChange', undefined);
    const visibleCount = options?.optionsLength ?? 0;
    const isLoading = useCompositeEvent(list, 'loadingChange', false);

    // Mount the list element on the handle.
    useEffect(() => {
        const element = internalRef.current;
        if (!element) return undefined;
        return list?.mount(element);
    }, [list]);

    // Flush pending keyboard navigation after options commit on open.
    useEffect(() => {
        if (isOpen) list?.flushPendingNavigation();
    }, [isOpen, visibleCount, list]);

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
