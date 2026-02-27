import type { HasClassName } from '../../types';
import { classNames } from '../../utils';
import { ClickableElement, RawClickable, RawClickableProps } from '../RawClickable';

/**
 * ListItemAction props.
 */
export type ListItemActionProps<E extends ClickableElement = 'button'> = RawClickableProps<E> & HasClassName;

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'ListItemAction';

/**
 * Component classname (used by action area CSS pattern).
 */
export const CLASSNAME = 'lumx-action-area__action';

export const DEFAULT_PROPS: Partial<ListItemActionProps> = {};

/**
 * ListItemAction component.
 *
 * Renders a button or link with action area classes.
 * When placed as a child of ListItem, it activates the action area pattern:
 * the entire list item becomes visually clickable, while other interactive
 * elements (in `before`/`after` slots) remain independently clickable.
 */
export const ListItemAction = <E extends ClickableElement = 'button'>(props: ListItemActionProps<E>) => {
    const { children, className, as: Element = 'button', handleClick, ...forwardedProps } = props;

    return RawClickable({
        as: Element as any,
        ...forwardedProps,
        className: classNames.join(
            className,
            classNames.actionArea.action({ 'has-overlay': true, 'focus-inset': true }),
        ),
        handleClick,
        children,
    });
};
