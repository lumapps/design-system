import { createContext, RefObject, useContext } from 'react';

import type { MenuHandle } from '@lumx/core/js/components/Menu/types';

/** Context value shared between Menu sub-components. */
export interface MenuContextValue {
    handle: MenuHandle;
    menuId: string;
    triggerId: string;
    anchorRef: RefObject<HTMLElement | null>;
}

export const MenuContext = createContext<MenuContextValue | undefined>(undefined);

/** Use Menu context. @throws if used outside `MenuProvider`. */
export function useMenuContext(): MenuContextValue {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('Menu sub-components must be used within a MenuProvider');
    }
    return context;
}
