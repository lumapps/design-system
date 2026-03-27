import { ReactNode, useMemo, useRef, useState } from 'react';

import type { ComboboxHandle } from '@lumx/core/js/components/Combobox/types';
import { useId } from '@lumx/react/hooks/useId';

import { ComboboxContext } from './context/ComboboxContext';

/**
 * Defines the props of the component.
 */
export interface ComboboxProviderProps {
    /** Combobox content. */
    children?: ReactNode;
}

/**
 * Combobox.Provider component.
 *
 * Provides shared context to sub-components. The vanilla JS combobox handle is
 * created by the trigger sub-component (Combobox.Input or Combobox.Button) on mount.
 *
 * @param props Component props.
 * @return React element.
 */
export function ComboboxProvider(props: ComboboxProviderProps) {
    const { children } = props;
    const listboxId = useId();
    const anchorRef = useRef<HTMLElement>(null);
    const [handle, setHandle] = useState<ComboboxHandle | null>(null);
    const contextValue = useMemo(() => ({ handle, setHandle, listboxId, anchorRef }), [handle, listboxId]);

    return <ComboboxContext.Provider value={contextValue}>{children}</ComboboxContext.Provider>;
}

ComboboxProvider.displayName = 'Combobox.Provider';
