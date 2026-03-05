import { Size } from '../../constants';
import type { CommonRef, HasClassName, JSXElement, LumxClassName } from '../../types';
import { classNames } from '../../utils';

/** List item padding size. */
export type ListItemPadding = Extract<Size, 'big' | 'huge'>;

/**
 * Defines the props of the component.
 */
export interface ListProps extends HasClassName {
    /** List content (should be ListItem, ListDivider, etc.). */
    children?: JSXElement;
    /** Item padding size. */
    itemPadding?: ListItemPadding;
    /** ref to the root element */
    ref?: CommonRef;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'List';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-list';
const { block } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<ListProps> = {};

/**
 * List component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const List = (props: ListProps) => {
    const { children, className, itemPadding, ref, ...forwardedProps } = props;

    return (
        <ul
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`item-padding-${itemPadding}`]: Boolean(itemPadding),
                }),
            )}
            ref={ref}
        >
            {children}
        </ul>
    );
};

List.displayName = COMPONENT_NAME;
List.className = CLASSNAME;
List.defaultProps = DEFAULT_PROPS;
