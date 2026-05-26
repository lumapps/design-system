import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { ListItem } from '../List/ListItem';
import { ListItemAction } from '../List/ListItemAction';

/** MenuItem props. */
export interface MenuItemProps extends HasClassName {
    /** Item label content. */
    children?: JSXElement;
    /** Content rendered before the label (e.g. an icon). */
    before?: JSXElement;
    /** Content rendered after the label (e.g. a shortcut hint). */
    after?: JSXElement;
    /** Whether the item is disabled. Skipped by Tab and arrow nav. */
    isDisabled?: boolean;
    /** Click handler for the action element. */
    handleClick?(event: any): void;
    /** Extra props forwarded to the inner action element (e.g. link props when `as="a"`). */
    actionProps?: Record<string, any>;
    /** ref to the inner action element (the focusable `<button>` / `<a>`). */
    actionRef?: CommonRef;
    /** ref to the root `<li>` element. */
    ref?: CommonRef;
}

/** Props overridden by framework wrappers. */
export type MenuItemPropsToOverride = 'before' | 'after' | 'children' | 'handleClick' | 'actionProps' | 'actionRef';

export const COMPONENT_NAME = 'MenuItem';

export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-menu-item';
const { block, element } = classNames.bem(CLASSNAME);

/** MenuItem core template. Renders a `ListItem` with a `ListItemAction`. */
export const MenuItem = (props: MenuItemProps) => {
    const { children, className, before, after, isDisabled, handleClick, actionProps, actionRef, ref, ...rest } = props;

    const actionElement = ListItemAction({
        as: 'button',
        type: 'button',
        ...actionProps,
        ref: actionRef,
        className: element('action'),
        handleClick,
        'data-menu-item': '',
        'aria-disabled': isDisabled ? 'true' : undefined,
        children,
    } as any);

    return ListItem({
        ref,
        size: 'tiny',
        ...rest,
        className: classNames.join(className, block()),
        before,
        after,
        children: actionElement,
    } as any);
};
