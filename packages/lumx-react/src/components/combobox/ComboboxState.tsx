import { ReactNode, useEffect, useState } from 'react';

import {
    ComboboxState as UI,
    ComboboxStateProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Combobox/ComboboxState';
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
 *
 * @param props Component props.
 * @return React element.
 */
export const ComboboxState = (props: ComboboxStateProps) => {
    const { handle } = useComboboxContext();
    const emptyState = useComboboxEvent('emptyChange', undefined);

    // Track loading state with both initial read and event subscription
    // (same pattern as ComboboxList for aria-busy)
    const [isLoading, setIsLoading] = useState(false);
    const [shouldAnnounce, setShouldAnnounce] = useState(false);

    useEffect(() => {
        if (!handle) return undefined;
        // Read current state synchronously
        setIsLoading(handle.isLoading);
        const unsub1 = handle.subscribe('loadingChange', setIsLoading);
        const unsub2 = handle.subscribe('loadingAnnouncement', setShouldAnnounce);
        return () => {
            unsub1();
            unsub2();
        };
    }, [handle]);

    const state = { ...emptyState, isLoading };

    // Only pass loadingMessage to core after the 500ms debounce threshold
    const loadingMessage = shouldAnnounce ? props.loadingMessage : undefined;

    return UI({ ...props, loadingMessage, state }, { GenericBlock, Text });
};

ComboboxState.displayName = COMPONENT_NAME;
ComboboxState.className = CLASSNAME;
