import { mdiDotsVertical } from '@lumx/icons';
import type { JSXElement, LumxClassName } from '../../types';

export type MenuButtonVariant = 'button' | 'icon-button' | 'chip' | 'link';

export const DEFAULT_PROPS: Partial<MenuButtonProps> = {
    variant: 'button',
};

/** ARIA keys set by MenuButton on the trigger — omitted from variant component props. */
type MenuButtonAriaKeys = 'aria-haspopup' | 'aria-controls' | 'aria-expanded';

/** Per-variant keys internally managed by MenuButton — omitted from variant component props. */
type MenuButtonVariantsInternalKeys = {
    button: MenuButtonAriaKeys;
    'icon-button': MenuButtonAriaKeys;
    chip: MenuButtonAriaKeys | 'isClickable';
    link: MenuButtonAriaKeys | 'href' | 'linkAs';
};

/** Discriminated union of MenuButton props across all trigger variants. */
export type MenuButtonVariantsProps<TBase, TVariantProps extends Record<MenuButtonVariant, any>> = {
    [V in MenuButtonVariant]: TBase &
        (V extends 'button' ? { variant?: V } : { variant: V }) &
        Omit<TVariantProps[V], MenuButtonVariantsInternalKeys[V] | keyof TBase>;
}[MenuButtonVariant];

export interface MenuButtonProps {
    variant?: MenuButtonVariant;
    label?: JSXElement;
    children?: JSXElement;
    triggerProps?: Record<string, any>;
    popoverProps?: Record<string, any>;
    onOpen?: (isOpen: boolean) => void;
}

export interface MenuButtonComponents {
    MenuProvider: any;
    MenuTrigger: any;
    MenuPopover: any;
    MenuList: any;
}

export const COMPONENT_NAME = 'MenuButton';
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-menu-button';

/** Menu button core template (composition of menu provider, trigger, popover and list) */
export const MenuButton = (
    props: MenuButtonProps,
    { MenuProvider, MenuTrigger, MenuPopover, MenuList }: MenuButtonComponents,
) => {
    const { label, children, triggerProps, popoverProps, onOpen, variant } = props;

    const extraTriggerProps: Record<string, any> = {};
    if (variant === 'chip') {
        // Chip render as clickable (since the component cannot detect this automatically)
        extraTriggerProps.isClickable = true;
    }

    let triggerChildren;
    if (variant === 'icon-button') {
        // Label as prop (renders as tooltip label)
        extraTriggerProps.label = label;
        // Default icon
        if (!triggerProps?.icon) {
            extraTriggerProps.icon = mdiDotsVertical;
        }
    } else {
        // Only set the label as children when we are not displaying an icon-button
        triggerChildren = label;
    }

    return (
        <MenuProvider onOpen={onOpen}>
            <MenuTrigger {...triggerProps} {...extraTriggerProps}>
                {triggerChildren}
            </MenuTrigger>
            <MenuPopover {...popoverProps}>
                <MenuList>{children}</MenuList>
            </MenuPopover>
        </MenuProvider>
    );
};
