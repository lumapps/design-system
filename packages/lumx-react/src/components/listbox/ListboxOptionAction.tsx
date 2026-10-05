import { ElementType, ReactNode, SyntheticEvent, useEffect } from 'react';

import { ComponentRef, HasClassName, HasPolymorphicAs, HasRequiredLinkHref } from '@lumx/react/utils/type';
import {
    ListboxOptionAction as UI,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Listbox/ListboxOptionAction';
import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';
import { useId } from '@lumx/react/hooks/useId';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import { useListboxContext } from './context/ListboxContext';

/**
 * Combobox.OptionAction props.
 *
 * Polymorphic component — use `as` to render as a different element or component
 * (e.g., `as={IconButton}`, `as={Button}`). Defaults to `'button'`.
 */
export type ListboxOptionActionProps<E extends ElementType = 'button'> = HasPolymorphicAs<E> &
    HasClassName &
    HasRequiredLinkHref<E> & {
        /** Content of the action (icon, label, etc.). Optional when using a polymorphic `as` that provides its own content (e.g., IconButton). */
        children?: ReactNode;
        /** Whether the action is disabled. */
        isDisabled?: boolean;
        /** On click callback. */
        onClick?(evt: SyntheticEvent): void;
    };

/**
 * Combobox.OptionAction sub-component.
 *
 * Renders a secondary action button within a combobox option row (grid mode).
 * Each action renders as a `role="gridcell"` element, enabling 2D keyboard
 * navigation (ArrowLeft/Right to move between the option and its actions).
 *
 * Renders nothing outside grid mode (`type="grid"` on the parent list): without the grid
 * navigation, an action would not be reachable by keyboard and would break the listbox pattern.
 *
 * Uses the same polymorphic pattern as ListItem.Action (forwardRefPolymorphic + RawClickable).
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ListboxOptionAction = Object.assign(
    forwardRefPolymorphic(
        <E extends ElementType = 'button'>(props: ListboxOptionActionProps<E>, ref: ComponentRef<E>) => {
            const { disabledStateProps, otherProps } = useDisableStateProps(props as any);
            const { children, className, as: Element = 'button', onClick, ...forwardedProps } = otherProps as any;
            const actionId = useId();
            const { type } = useListboxContext();
            const isGrid = type === 'grid';

            useEffect(() => {
                if (!isGrid) {
                    console.warn(
                        `[@lumx/react/${COMPONENT_NAME}] Option actions are only supported in grid mode (set type="grid" on the parent list); the action is not rendered.`,
                    );
                }
            }, [isGrid]);

            if (!isGrid) return null;

            return UI({
                as: Element as any,
                ...forwardedProps,
                ...disabledStateProps,
                id: actionId,
                className,
                handleClick: onClick,
                ref,
                children,
            });
        },
    ),
    { displayName: COMPONENT_NAME, className: CLASSNAME },
);
