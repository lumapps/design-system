import { type InjectionKey, type Ref, inject, provide } from 'vue';

import type { MenuHandle } from '@lumx/core/js/components/Menu/types';

/** Shared context value passed from MenuProvider to all Menu sub-components. */
export interface MenuContextValue {
    handle: MenuHandle;
    menuId: string;
    triggerId: string;
    anchorRef: Ref<HTMLElement | null>;
}

const MENU_CONTEXT_KEY: InjectionKey<MenuContextValue> = Symbol('LumxMenuContext');

/** Provides the Menu context to all descendant Menu sub-components. */
export function provideMenuContext(value: MenuContextValue) {
    provide(MENU_CONTEXT_KEY, value);
}

/** Injects and returns the Menu context; throws if used outside a MenuProvider. */
export function useMenuContext(): MenuContextValue {
    const context = inject(MENU_CONTEXT_KEY);
    if (!context) {
        throw new Error('Menu sub-components must be used within a Menu.Provider');
    }
    return context;
}
