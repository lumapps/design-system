import { ReactNode } from 'react';

import {
    MenuPopover as UI,
    MenuPopoverProps as UIProps,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Menu/MenuPopover';
import { Popover } from '@lumx/react/components/popover';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

import { FlexBox } from '../flex-box';
import { useMenuContext } from './context/MenuContext';
import { useMenuOpen } from './context/useMenuOpen';

/** Popover props forwarded to the inner Popover (minus managed props). */

/** MenusPopover props. */
export interface MenuPopoverProps extends ReactToJSX<UIProps, 'isOpen' | 'anchorRef' | 'handleClose'> {
    /** Content (should contain a `Menu`). */
    children: ReactNode;
}

/**
 * MenuPopover component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const MenuPopover = (props: MenuPopoverProps) => {
    const { anchorRef } = useMenuContext();
    const [isOpen, setIsOpen] = useMenuOpen();
    const { children, ...popoverProps } = props;

    return UI(
        {
            ...popoverProps,
            children,
            isOpen,
            anchorRef,
            handleClose: () => setIsOpen(false),
        },
        { Popover, FlexBox },
    );
};

MenuPopover.displayName = COMPONENT_NAME;
MenuPopover.className = CLASSNAME;
