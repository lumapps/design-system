import { Children, ReactNode, useEffect, useRef, useState } from 'react';

import {
    ListboxSection as UI,
    ListboxSectionProps as UIProps,
    ListboxSectionPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxSection';
import { GenericProps } from '@lumx/core/js/types';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { ListSection } from '../list/ListSection';
import { useListboxContext } from './context/ListboxContext';

/**
 * Props for Combobox.Section component.
 */
export interface ListboxSectionProps extends GenericProps, ReactToJSX<UIProps, ListboxSectionPropsToOverride> {
    /** Section content (should be Combobox.Option elements). */
    children: ReactNode;
}

/**
 * Combobox.Section component - groups Combobox.Option items under a labelled section.
 * Delegates rendering to the core ListboxSection template, injecting the React ListSection.
 *
 * Returns null when children is empty so the section header is not rendered as an orphan.
 *
 * When filter="auto" is active, the section registers itself with the combobox handle.
 * The handle monitors registered options within this section and notifies when all
 * are filtered out. When hidden, the core template renders a bare `<li hidden>` wrapper
 * so children (options) stay mounted and registered.
 *
 * @param props Component props.
 * @param ref   Component ref.
 * @return React element.
 */
export const ListboxSection = forwardRef<ListboxSectionProps, HTMLLIElement>((props, ref) => {
    const { list } = useListboxContext();
    const internalRef = useRef<HTMLLIElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);
    const [sectionState, setSectionState] = useState({ hidden: false, 'aria-hidden': false });

    // Register with the combobox handle for section state notifications.
    useEffect(() => {
        const element = internalRef.current;
        if (!element || !list) return undefined;
        return list.registerSection(element, setSectionState);
    }, [list]);

    if (Children.count(props.children) === 0) return null;

    return UI(
        {
            ...props,
            ref: mergedRef,
            hidden: sectionState.hidden,
            'aria-hidden': sectionState['aria-hidden'] || undefined,
        },
        { ListSection },
    );
});

ListboxSection.displayName = COMPONENT_NAME;
ListboxSection.className = CLASSNAME;
