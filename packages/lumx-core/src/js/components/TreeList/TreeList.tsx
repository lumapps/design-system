import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';
import { List, type ListCoreProps, type ListProps } from '../List';

/**
 * Defines the props for the core TreeList template.
 */
export interface TreeListProps extends HasClassName {
    /** Accessible label of the tree (one of `aria-label` or `aria-labelledby` is required). */
    'aria-label'?: string;
    /** ID of the element that labels the tree. */
    'aria-labelledby'?: string;
    /**
     * Indicates that the tree content is incomplete (root skeletons, the first load of the tree).
     * Omit (or set to `undefined`) when not loading: the attribute is not rendered as `"false"`.
     */
    'aria-busy'?: boolean;
    /**
     * Allow selecting several tree items (`aria-multiselectable`).
     * Also read by `Combobox.SelectionIcon` to pick the checkbox icons.
     */
    'aria-multiselectable'?: boolean | 'true' | 'false';
    /** Content (`TreeListItem`, `ListboxOptionSkeleton` or `ListboxState` elements). */
    children?: JSXElement;
    /** The ID of the tree element. */
    id?: string;
    /** Tab index (`0` on a standalone list, which owns focus). */
    tabIndex?: number;
    /** ref to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'TreeList';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-tree-list';

/**
 * TreeList core template: a list in the tree pattern (`<ul role="tree">`), with `TreeListItem` items.
 * Nothing in the markup refers to a combobox: the framework wrapper links the tree to a combobox trigger,
 * or makes it its own focus owner (standalone: `tabIndex={0}`).
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 *
 * @param props Component props.
 * @return JSX element.
 */
export const TreeList = (props: TreeListProps) => {
    const { 'aria-busy': ariaBusy, children, className, ref, ...forwardedProps } = props;
    const listProps: ListProps & ListCoreProps & Record<string, unknown> = {
        ...forwardedProps,
        as: 'ul',
        className: classNames.join(className, CLASSNAME),
        ref,
        itemPadding: 'big',
        role: 'tree',
        'aria-busy': ariaBusy || undefined,
        children,
    };
    return List(listProps);
};

TreeList.displayName = COMPONENT_NAME;
TreeList.className = CLASSNAME;
