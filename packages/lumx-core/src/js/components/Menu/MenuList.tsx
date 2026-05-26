import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { List } from '../List';

/** Menu list props. */
export type MenuListProps = HasClassName & {
    /** Menu content (MenuItem, ListDivider, ListSection…). */
    children?: JSXElement;
    /** The id of the menu container element (matches `aria-controls` on the trigger). */
    id?: string;
    /** The id of the element that labels the menu (auto-set to the trigger id by wrappers). */
    'aria-labelledby'?: string;
    /** ref to the root `<ul>` element. */
    ref?: CommonRef;
};

export const COMPONENT_NAME = 'Menu';
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-menu';

/** MenuList core template. Wraps `List` with menu-specific class and ARIA labelling. */
export const MenuList = (props: MenuListProps) => {
    const { 'aria-labelledby': ariaLabelledby, children, className, id, ref, ...rest } = props;

    return List({
        ...rest,
        ref,
        id,
        className: classNames.join(className, CLASSNAME),
        itemPadding: 'big',
        'aria-labelledby': ariaLabelledby,
        children,
    } as any);
};
