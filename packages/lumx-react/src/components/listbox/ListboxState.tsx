import { ReactNode, useEffect, useState } from 'react';

import {
    ListboxState as UI,
    ListboxStateProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxState';
import { subscribeListboxState } from '@lumx/core/js/components/Listbox/subscribeListboxState';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { GenericBlock } from '../generic-block';
import { Text } from '../text';
import { useListboxEvent } from './context/useListboxEvent';
import { useListboxContext } from './context/ListboxContext';

/**
 * Props for Combobox.State component.
 */
export interface ListboxStateProps extends ReactToJSX<UIProps, 'state'> {
    /** Additional content rendered after the state message. */
    children?: ReactNode;
}

/**
 * Combobox.State component - displays empty and error states for the combobox list.
 *
 * Place this component as a sibling to `Combobox.List` inside a `Combobox.Popover`:
 *
 * ```tsx
 * <Combobox.Popover>
 *   <Combobox.List aria-label="Options">{options}</Combobox.List>
 *   <Combobox.State
 *     emptyMessage="No results"
 *     errorMessage={isError ? 'Service unavailable' : undefined}
 *     errorTryReloadMessage="Please try again"
 *   />
 * </Combobox.Popover>
 * ```
 *
 * Activation rules (in priority order):
 * - **Error state**: active when `errorMessage` is provided (presence-based).
 *   Takes priority over all other states.
 * - **Loading state**: active when `loadingMessage` is provided and skeletons have been
 *   mounted for at least 500ms. Suppresses the empty state while loading.
 * - **Empty state**: active when `emptyMessage` is provided and the list has no visible options
 *   and is not loading.
 * - **Option count**: active when `nbOptionMessage` is provided and the list is not empty,
 *   not loading, and not in error.
 *
 * @param props Component props.
 * @return React element.
 */
export const ListboxState = (props: ListboxStateProps) => {
    const { list } = useListboxContext();
    const optionsState = useListboxEvent(list, 'optionsChange', undefined);

    const [isLoading, setIsLoading] = useState(false);
    const [shouldAnnounce, setShouldAnnounce] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!list) return undefined;
        return subscribeListboxState(list, { setIsLoading, setShouldAnnounce, setIsOpen });
    }, [list]);

    const state = { ...optionsState, isLoading, isOpen };

    // Only pass loadingMessage to core after the 500ms debounce threshold
    const loadingMessage = shouldAnnounce ? props.loadingMessage : undefined;

    return UI({ ...props, loadingMessage, state }, { GenericBlock, Text });
};

ListboxState.displayName = COMPONENT_NAME;
ListboxState.className = CLASSNAME;
