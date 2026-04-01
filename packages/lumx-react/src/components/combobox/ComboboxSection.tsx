import { Children, ReactNode, useEffect, useRef, useState } from 'react';

import {
    ComboboxSection as UI,
    ComboboxSectionProps as UIProps,
    ComboboxSectionPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxSection';
import { GenericProps } from '@lumx/core/js/types';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { ListSection } from '../list/ListSection';
import { useComboboxContext } from './context/ComboboxContext';

/**
 * Props for Combobox.Section component.
 */
export interface ComboboxSectionProps extends GenericProps, ReactToJSX<UIProps, ComboboxSectionPropsToOverride> {
    /** Section content (should be Combobox.Option elements). */
    children: ReactNode;
}

/**
 * Combobox.Section component - groups Combobox.Option items under a labelled section.
 * Delegates rendering to the core ComboboxSection template, injecting the React ListSection.
 *
 * Returns null when children is empty so the section header is not rendered as an orphan.
 *
 * When autoFilter is active, the section registers itself with the combobox handle.
 * The handle monitors registered options within this section and notifies when all
 * are filtered out. When hidden, the core template renders a bare `<li hidden>` wrapper
 * so children (options) stay mounted and registered.
 *
 * @param props Component props.
 * @param ref   Component ref.
 * @return React element.
 */
export const ComboboxSection = forwardRef<ComboboxSectionProps, HTMLLIElement>((props, ref) => {
    const { handle } = useComboboxContext();
    const internalRef = useRef<HTMLLIElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);
    const [sectionState, setSectionState] = useState({ hidden: false, 'aria-hidden': false });

    // Register with the combobox handle for section state notifications.
    useEffect(() => {
        const element = internalRef.current;
        if (!element || !handle) return undefined;
        return handle.registerSection(element, setSectionState);
    }, [handle]);

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

ComboboxSection.displayName = COMPONENT_NAME;
ComboboxSection.className = CLASSNAME;
