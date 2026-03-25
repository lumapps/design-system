import { useComboboxContext } from './ComboboxContext';
import { useComboboxEvent } from './useComboboxEvent';

/**
 * Composable to subscribe to the combobox open/close state.
 */
export function useComboboxOpen() {
    const { handle } = useComboboxContext();
    const isOpen = useComboboxEvent('open', false);
    const setIsOpen = (open: boolean) => handle.value?.setIsOpen(open);
    return { isOpen, setIsOpen };
}
