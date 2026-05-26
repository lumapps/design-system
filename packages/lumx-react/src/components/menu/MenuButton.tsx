import React, { ElementType } from 'react';
import {
    MenuButton as UI,
    type MenuButtonProps as UIProps,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Menu/MenuButton';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';
import { ComponentRef } from '@lumx/react/utils/type';
import { NamedProps } from '@lumx/core/js/types';
import { MenuProvider } from './MenuProvider';
import { MenuTrigger } from './MenuTrigger';
import { MenuPopover, type MenuPopoverProps } from './MenuPopover';
import { MenuList } from './MenuList';

import { Button, IconButton } from '../button';

const Menu = {
    Provider: MenuProvider,
    Trigger: MenuTrigger,
    Popover: MenuPopover,
    List: MenuList,
};

/** Keys managed by MenuButton — omitted from the polymorphic trigger props. */
type OmittedTriggerKeys = 'aria-haspopup' | 'aria-controls' | 'aria-expanded' | 'label' | 'children' | 'ref';

/** Polymorphic trigger props with index signature stripped and managed keys removed. */
type TriggerProps<E extends ElementType> = Omit<NamedProps<React.ComponentProps<E>>, OmittedTriggerKeys>;

/** Menu button props */
export type MenuButtonProps<E extends ElementType = typeof Button> = TriggerProps<E> &
    ReactToJSX<UIProps, 'triggerProps'> & {
        /** Customize the rendered trigger component. */
        as?: E;
        children?: React.ReactNode;
        popoverProps?: MenuPopoverProps;
        onOpen?: (isOpen: boolean) => void;
    };

/**
 * MenuButton component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const MenuButton = Object.assign(
    forwardRefPolymorphic(<E extends ElementType = typeof Button>(props: MenuButtonProps<E>, ref: ComponentRef<E>) => {
        const { label, children, popoverProps, onOpen, as, ...triggerProps } = props as any;

        const isIconButton = as === IconButton;
        const triggerLabel = isIconButton ? undefined : label;
        const extraTriggerProps = isIconButton ? ({ label } as any) : {};

        return UI(
            {
                label: triggerLabel,
                children,
                popoverProps,
                onOpen,
                triggerProps: { ...triggerProps, ...extraTriggerProps, as, ref },
            },
            { Menu },
        );
    }),
    { displayName: COMPONENT_NAME },
);
