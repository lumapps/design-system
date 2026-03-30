import { useCallback } from 'react';

import { useComboboxContext } from './ComboboxContext';
import { useComboboxEvent } from './useComboboxEvent';

/**
 * Hook to subscribe to the combobox open/close state.
 */
export function useComboboxOpen(): [boolean, (open: boolean) => void] {
    const { handle } = useComboboxContext();
    const isOpen = useComboboxEvent('open', false);
    const setIsOpen = useCallback((open: boolean) => handle?.setIsOpen(open), [handle]);
    return [isOpen, setIsOpen];
}
