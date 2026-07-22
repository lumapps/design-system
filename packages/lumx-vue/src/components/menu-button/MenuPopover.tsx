import { defineComponent, useSlots } from 'vue';
import type { JSXElement } from '@lumx/core/js/types';

import {
    MenuPopover as UI,
    MenuPopoverProps as UIProps,
    CLASSNAME as MENU_POPOVER_CLASSNAME,
    COMPONENT_NAME as MENU_POPOVER_COMPONENT_NAME,
} from '@lumx/core/js/components/Menu/MenuPopover';

import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { FlexBox } from '../flex-box';
import { Popover } from '../popover';

import { useMenuContext } from './context';
import { useMenuOpen } from './useMenuOpen';

/** MenusPopover props. */
export type MenuPopoverProps = VueToJSXProps<UIProps, 'anchorRef' | 'isOpen' | 'handleClose'>;

/**
 * MenuPopover component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const MenuPopover = defineComponent(
    (props: MenuPopoverProps) => {
        const slots = useSlots();
        const { anchorRef } = useMenuContext();
        const [isOpen, setIsOpen] = useMenuOpen();

        return () =>
            UI(
                {
                    ...props,
                    children: slots.default?.() as JSXElement,
                    isOpen: isOpen.value,
                    anchorRef,
                    handleClose: () => setIsOpen(false),
                },
                { Popover, FlexBox },
            );
    },
    {
        name: getName(MENU_POPOVER_COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<MenuPopoverProps>()('placement', 'class'),
    },
);

export { MENU_POPOVER_CLASSNAME as CLASSNAME, MENU_POPOVER_COMPONENT_NAME as COMPONENT_NAME };
export default MenuPopover;
