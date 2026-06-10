import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';

/** MenuTrigger props. */
export interface MenuTriggerProps extends HasClassName {
    /** Content of the trigger (label / icon / etc.). */
    children?: JSXElement;
    /** The id of the menu container (for `aria-controls`). */
    menuId?: string;
    /** Whether the menu is currently open. */
    isOpen?: boolean;
    /** ref to the trigger element. */
    ref?: CommonRef;
}

/** Framework components injected by wrappers. */
export interface MenuTriggerComponents {
    /** Component to render as the trigger (e.g. Button, IconButton, Chip, link). */
    Trigger: any;
}

export const COMPONENT_NAME = 'MenuTrigger';
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-menu-trigger';

/** MenuTrigger core template. Renders `Trigger` with disclosure ARIA attributes. */
export const MenuTrigger = (props: MenuTriggerProps, { Trigger }: MenuTriggerComponents) => {
    const { children, className, menuId, isOpen, ref, ...forwardedProps } = props;

    return (
        <Trigger
            ref={ref}
            {...forwardedProps}
            className={classNames.join(className, CLASSNAME)}
            aria-haspopup="true"
            aria-controls={menuId}
            aria-expanded={isOpen ? 'true' : 'false'}
        >
            {children}
        </Trigger>
    );
};
