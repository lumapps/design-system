import React, { type ForwardedRef } from 'react';

import {
    MenuButton as UI,
    type MenuButtonProps as UIProps,
    type MenuButtonVariantsProps,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Menu/MenuButton';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

import { MenuProvider } from './MenuProvider';
import { MenuTrigger } from './MenuTrigger';
import { MenuPopover, type MenuPopoverProps } from './MenuPopover';
import { MenuList } from './MenuList';

import { Button, IconButton, type ButtonProps, type IconButtonProps } from '../button';
import { Chip, type ChipProps } from '../chip';
import { Link, type LinkProps } from '../link';

/** Props that MenuButton explicitly declares. */
type MenuButtonBase = ReactToJSX<UIProps, 'triggerProps' | 'variant'> & {
    children?: React.ReactNode;
    popoverProps?: MenuPopoverProps;
    onOpen?: (isOpen: boolean) => void;
    label: string;
};

/** MenuButton props — discriminated union over the variant to inherit the target component's props. */
export type MenuButtonProps = MenuButtonVariantsProps<
    MenuButtonBase,
    {
        button: ButtonProps;
        'icon-button': IconButtonProps;
        chip: ChipProps;
        link: LinkProps;
    }
>;

/** Menu trigger button component by variant */
const TRIGGER_COMPONENTS = {
    button: Button,
    'icon-button': IconButton,
    chip: Chip,
    link: Link,
} as const;

/**
 * MenuButton component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const MenuButton = forwardRef<MenuButtonProps>((props, ref: ForwardedRef<HTMLElement>) => {
    const { label, children, popoverProps, onOpen, variant = 'button', ...triggerProps } = props;

    return UI(
        {
            label,
            children,
            popoverProps,
            onOpen,
            variant,
            triggerProps: { ...triggerProps, as: TRIGGER_COMPONENTS[variant], ref },
        },
        { MenuProvider, MenuTrigger, MenuPopover, MenuList },
    );
});

MenuButton.displayName = COMPONENT_NAME;
