import { ReactNode, useEffect, useMemo, useRef } from 'react';

import { setupMenu } from '@lumx/core/js/components/Menu/setupMenu';
import { useId } from '@lumx/react/hooks/useId';

import { MenuContext } from './context/MenuContext';

/** MenuProvider props. */
export interface MenuProviderProps {
    /** Menu content (Trigger, Popover, Menu, …). */
    children?: ReactNode;
    /** Callback fired when the menu open state changes. */
    onOpen?: (isOpen: boolean) => void;
}

/**
 * MenuProvider component.
 *
 * @param  props Component props.
 * @return React element.
 */
export function MenuProvider(props: MenuProviderProps) {
    const { children, onOpen } = props;
    const menuId = useId();
    const triggerId = useId();
    const anchorRef = useRef<HTMLElement>(null);
    const handle = useMemo(() => setupMenu({ menuId }), [menuId]);

    // Forward 'open' events to the consumer callback via a ref to avoid stale closures.
    const onOpenRef = useRef(onOpen);
    onOpenRef.current = onOpen;
    useEffect(() => {
        const unsubscribe = handle.subscribe('open', (isOpen) => onOpenRef.current?.(isOpen));
        // Cleanup
        return () => {
            unsubscribe();
            handle.destroy();
        };
    }, [handle]);

    const contextValue = useMemo(() => ({ handle, menuId, triggerId, anchorRef }), [handle, menuId, triggerId]);

    return <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>;
}

MenuProvider.displayName = 'Menu.Provider';
