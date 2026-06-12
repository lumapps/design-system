import { useLayoutEffect, useRef } from 'react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import {
    MenuList as UI,
    MenuListProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Menu/MenuList';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

import { useMenuContext } from './context/MenuContext';
import { useMenuOpen } from './context/useMenuOpen';

export type MenuProps = Omit<ReactToJSX<UIProps>, 'id' | 'aria-labelledby'>;

/**
 * MenuList component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const MenuList = forwardRef<MenuProps, HTMLElement>((props, ref) => {
    const { menuId, triggerId, handle } = useMenuContext();
    const internalRef = useRef<HTMLElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);
    const { children, ...forwardedProps } = props;
    const [isOpen] = useMenuOpen();

    // Register menu in context
    useLayoutEffect(() => {
        const menu = internalRef.current;
        if (!menu) return undefined;
        return handle.registerMenu(menu);
    }, [handle]);

    // Flush pending navigation (that could not be done when the menu was closed)
    useLayoutEffect(() => {
        if (isOpen) handle.flushPendingNavigation();
    }, [handle, isOpen]);

    return UI({
        ...forwardedProps,
        id: menuId,
        'aria-labelledby': triggerId,
        ref: mergedRef,
        children: isOpen ? children : null,
    });
});

MenuList.displayName = COMPONENT_NAME;
MenuList.className = CLASSNAME;
