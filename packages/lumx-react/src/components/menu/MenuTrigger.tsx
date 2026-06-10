import { ElementType, useEffect, useRef } from 'react';

import {
    MenuTrigger as UI,
    MenuTriggerProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Menu/MenuTrigger';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { ComponentRef, HasPolymorphicAs, HasRequiredLinkHref } from '@lumx/react/utils/type';

import { Button } from '../button';
import { useMenuContext } from './context/MenuContext';
import { useMenuOpen } from './context/useMenuOpen';

/** MenuTrigger props. Polymorphic */
export type MenuTriggerProps<E extends ElementType = typeof Button> = Omit<
    HasPolymorphicAs<E>,
    'aria-haspopup' | 'aria-controls' | 'aria-expanded'
> &
    HasRequiredLinkHref<E> &
    ReactToJSX<UIProps, 'isOpen' | 'menuId'>;

/**
 * MenuTrigger component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const MenuTrigger = Object.assign(
    forwardRefPolymorphic(<E extends ElementType = typeof Button>(props: MenuTriggerProps<E>, ref: ComponentRef<E>) => {
        const { menuId, triggerId, anchorRef, handle } = useMenuContext();
        const [isOpen] = useMenuOpen();
        const { as, children, ...triggerProps } = props as any;
        const TriggerComp = as ?? Button;

        const internalRef = useRef<HTMLElement>(null);
        const mergedRef = useMergeRefs(ref as any, internalRef, anchorRef);

        // Register trigger with the handle on mount; clean up on unmount.
        useEffect(() => {
            const triggerEl = internalRef.current;
            if (!triggerEl) return undefined;
            return handle.registerTrigger(triggerEl);
        }, [handle]);

        return UI(
            {
                ...triggerProps,
                id: triggerProps.id ?? triggerId,
                menuId,
                isOpen,
                ref: mergedRef,
                children,
            },
            { Trigger: TriggerComp },
        );
    }),
    { displayName: COMPONENT_NAME, className: CLASSNAME },
);
