import { ElementType, ReactNode, SyntheticEvent } from 'react';

import { ComponentRef, HasClassName, HasPolymorphicAs, HasRequiredLinkHref } from '@lumx/react/utils/type';
import { classNames } from '@lumx/core/js/utils';
import { RawClickable } from '@lumx/core/js/components/RawClickable';
import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';

/**
 * ListItem.Action props.
 */
export type ListItemActionProps<E extends ElementType = 'button'> = HasPolymorphicAs<E> &
    HasClassName &
    HasRequiredLinkHref<E> & {
        /** Content of the action (label). */
        children: ReactNode;
        /** On click callback. */
        onClick?(evt: SyntheticEvent): void;
    };

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ListItemAction';

/**
 * ListItem.Action sub-component.
 *
 * Renders a button or link with action area classes.
 * When placed as a child of ListItem, it activates the action area pattern:
 * the entire list item becomes visually clickable, while other interactive
 * elements (in `before`/`after` slots) remain independently clickable.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListItemAction = Object.assign(
    forwardRefPolymorphic(<E extends ElementType = 'button'>(props: ListItemActionProps<E>, ref: ComponentRef<E>) => {
        const { children, className, as: Element = 'button', onClick, ...forwardedProps } = props;

        return RawClickable({
            as: Element,
            ...forwardedProps,
            className: classNames.join(
                className,
                classNames.actionArea.action({ 'has-overlay': true, 'focus-inset': true }),
            ),
            handleClick: onClick,
            ref,
            children,
        });
    }),
    { displayName: COMPONENT_NAME },
);
