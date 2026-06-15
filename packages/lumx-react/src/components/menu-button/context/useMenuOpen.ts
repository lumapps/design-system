import { useCallback } from 'react';

import { useMenuContext } from './MenuContext';
import { useMenuEvent } from './useMenuEvent';

/**
 * Subscribe to the menu open state.
 *
 * @returns `[isOpen, setIsOpen]` — open state and a setter that proxies to `handle.setOpen`.
 */
export function useMenuOpen(): [boolean, (open: boolean) => void] {
    const { handle } = useMenuContext();
    const isOpen = useMenuEvent('open', false);
    const setIsOpen = useCallback((open: boolean) => handle.setOpen(open), [handle]);
    return [isOpen, setIsOpen];
}
