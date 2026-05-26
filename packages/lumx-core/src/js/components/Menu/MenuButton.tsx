import type { JSXElement, LumxClassName } from '../../types';

export interface MenuButtonProps {
    label?: JSXElement;
    children?: JSXElement;
    triggerProps?: Record<string, any>;
    popoverProps?: Record<string, any>;
    onOpen?: (isOpen: boolean) => void;
}

export interface MenuButtonComponents {
    Menu: any;
}

export const COMPONENT_NAME = 'MenuButton';
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-menu-button';

/** Menu button core template (composition of menu provider, trigger, popover and list) */
export const MenuButton = (props: MenuButtonProps, { Menu }: MenuButtonComponents) => {
    const { label, children, triggerProps, popoverProps, onOpen } = props;

    return (
        <Menu.Provider onOpen={onOpen}>
            <Menu.Trigger {...triggerProps}>{label}</Menu.Trigger>
            <Menu.Popover {...popoverProps}>
                <Menu.List>{children}</Menu.List>
            </Menu.Popover>
        </Menu.Provider>
    );
};
