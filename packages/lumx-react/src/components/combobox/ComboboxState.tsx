import { ReactNode, useEffect, useState } from 'react';

import {
    ComboboxState as UI,
    ComboboxStateProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxState';
import { subscribeComboboxState } from '@lumx/core/js/components/Combobox/subscribeComboboxState';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { GenericBlock } from '../generic-block';
import { Text } from '../text';
import { useComboboxEvent } from './context/useComboboxEvent';
import { useComboboxContext } from './context/ComboboxContext';

/**
 * Props for Combobox.State component.
 */
export interface ComboboxStateProps extends ReactToJSX<UIProps, 'state'> {
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
export const ComboboxState = (props: ComboboxStateProps) => {
    const { handle } = useComboboxContext();
    const optionsState = useComboboxEvent('optionsChange', undefined);

    const [isLoading, setIsLoading] = useState(false);
    const [shouldAnnounce, setShouldAnnounce] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!handle) return undefined;
        return subscribeComboboxState(handle, { setIsLoading, setShouldAnnounce, setIsOpen });
    }, [handle]);

    const state = { ...optionsState, isLoading, isOpen };

    // Only pass loadingMessage to core after the 500ms debounce threshold
    const loadingMessage = shouldAnnounce ? props.loadingMessage : undefined;

    return UI({ ...props, loadingMessage, state }, { GenericBlock, Text });
};

ComboboxState.displayName = COMPONENT_NAME;
ComboboxState.className = CLASSNAME;
