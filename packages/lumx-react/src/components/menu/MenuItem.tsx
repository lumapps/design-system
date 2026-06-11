import { ElementType, ReactNode, SyntheticEvent, useRef } from 'react';
import type { ReactElement, Ref } from 'react';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useMergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { HasPolymorphicAs, HasRequiredLinkHref } from '@lumx/react/utils/type';
import { GenericProps } from '@lumx/core/js/types';
import { ColorPalette } from '@lumx/core/js/constants';
import {
    MenuItem as UI,
    MenuItemProps as UIProps,
    MenuItemPropsToOverride,
    COMPONENT_NAME,
    CLASSNAME,
} from '@lumx/core/js/components/Menu/MenuItem';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

import { Icon } from '../icon';
import { Text } from '../text';
import { useMenuContext } from './context/MenuContext';

/** Props forwarded to the inner action element. */
export type MenuItemActionProps<E extends ElementType = 'button'> = HasPolymorphicAs<E> & HasRequiredLinkHref<E>;

/** MenuItem props. */
export interface MenuItemProps<E extends ElementType = 'button'>
    extends GenericProps,
        ReactToJSX<UIProps, MenuItemPropsToOverride> {
    /** Item label content. */
    children?: ReactNode;
    /** Click handler. Calls `event.preventDefault()` to keep the menu open. */
    onClick?(event: SyntheticEvent): void;
    /** MDI icon rendered as `<Icon size="xs" />` prepended to the `before` slot. */
    icon?: string;
    /** MDI icon rendered as `<Icon size="xs" />` appended to the `after` slot. */
    afterIcon?: string;
    /** Foreground color applied to the icon and label text. */
    color?: ColorPalette;
    /** Content rendered before the label (rendered AFTER `icon` if both are provided). */
    before?: ReactNode;
    /** Content rendered after the label (e.g. a shortcut hint). */
    after?: ReactNode;
    /** Props forwarded to the inner action element (`{ as: 'a', href: '/foo' }`, etc.). */
    actionProps?: MenuItemActionProps<E>;
}

/**
 * MenuItem component.
 *
 * @param  props Component props.
 * @return React element.
 */
export const MenuItem: {
    <E extends ElementType = 'button'>(props: MenuItemProps<E> & { ref?: Ref<HTMLLIElement> }): ReactElement | null;
    readonly $$typeof: symbol;
    displayName: typeof COMPONENT_NAME;
    className: typeof CLASSNAME;
} = forwardRef<MenuItemProps, HTMLLIElement>((props, ref) => {
    const { handle } = useMenuContext();
    const { children, icon, afterIcon, color, before, after, isDisabled, onClick, actionProps, ...rest } = props;

    const internalRef = useRef<HTMLLIElement>(null);
    const actionRef = useRef<HTMLElement>(null);
    const mergedRef = useMergeRefs(ref, internalRef);

    const handleClick = (event: SyntheticEvent) => {
        if (isDisabled) {
            event.preventDefault();
            return;
        }
        onClick?.(event);
        if (!event.defaultPrevented) {
            // Focus the trigger before closing so focus restoration works with
            // closeMode="hide" (items unmount on close, leaving focus on body).
            handle.trigger?.focus();
            handle.setOpen(false);
        }
    };

    // Prepend the optional `icon` to the `before` slot — consumer-supplied `before`
    // (if any) is rendered after the icon to preserve composability.
    const mergedBefore = icon ? (
        <>
            <Icon icon={icon} size="xs" color={color} />
            {before}
        </>
    ) : (
        before
    );

    // Append the optional `afterIcon` to the `after` slot.
    const mergedAfter = afterIcon ? (
        <>
            {after}
            <Icon icon={afterIcon} size="xs" color={color} />
        </>
    ) : (
        after
    );

    return UI({
        ...rest,
        ref: mergedRef,
        actionRef,
        before: mergedBefore,
        after: mergedAfter,
        children: (
            <Text as="span" color={color}>
                {children}
            </Text>
        ),
        isDisabled,
        actionProps,
        handleClick,
    });
}) as any;

MenuItem.displayName = COMPONENT_NAME;
MenuItem.className = CLASSNAME;
