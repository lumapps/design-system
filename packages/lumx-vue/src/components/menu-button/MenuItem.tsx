import { defineComponent, ref, type SlotsType } from 'vue';

import type { JSXElement } from '@lumx/core/js/types';
import { ColorPalette } from '@lumx/core/js/constants';
import {
    MenuItem as UI,
    MenuItemProps as UIProps,
    MenuItemPropsToOverride,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Menu/MenuItem';

import { useClassName } from '../../composables/useClassName';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Icon } from '../icon';
import Text from '../text/Text';

import { useMenuContext } from './context';

export interface MenuItemActionSlotProps {
    /** Props to spread on the custom action element (includes onClick). */
    actionProps: Record<string, any>;
    /** Whether the item is disabled. */
    isDisabled: boolean;
}

/** MenuItem props. */
export type MenuItemProps = VueToJSXProps<UIProps, MenuItemPropsToOverride> & {
    /** MDI icon rendered as `<Icon size="xs" />` prepended to the `before` slot. */
    icon?: string;
    /** MDI icon rendered as `<Icon size="xs" />` appended to the `after` slot. */
    afterIcon?: string;
    /** Foreground color applied to the icon and label text. */
    color?: ColorPalette;
};

/**
 * MenuItem component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const MenuItem = defineComponent(
    (props: MenuItemProps, { slots, emit, attrs }) => {
        const { handle } = useMenuContext();
        const className = useClassName(() => props.class);
        const internalRef = ref<HTMLLIElement | null>(null);

        const onClick = (event: any) => {
            if (props.isDisabled) {
                event.preventDefault();
                return;
            }
            emit('click', event);
            if (!event.defaultPrevented) {
                handle.trigger?.focus();
                handle.setOpen(false);
            }
        };

        return () => {
            // Slots
            const before = slots.before?.();
            const action = slots.action?.({
                actionProps: { onClick },
                isDisabled: props.isDisabled as boolean,
            })?.[0];
            const after = slots.after?.();

            // Prepend menu item icon at the start of the "before" section
            const beforeWithIcon = props.icon ? (
                <>
                    <Icon icon={props.icon} size="xs" color={props.color} />
                    {before}
                </>
            ) : (
                before
            );

            // Append menu item icon at the end of the "after" section
            const afterWithIcon = props.afterIcon ? (
                <>
                    {after}
                    <Icon icon={props.afterIcon} size="xs" color={props.color} />
                </>
            ) : (
                after
            );

            let actionProps: Record<string, any> | undefined;
            let label: JSXElement | undefined;

            // Custom action rendered => merge props
            if (action) {
                actionProps = { ...action.props, onClick, as: action.type };
                label = action.children as JSXElement;
            }

            // Use action slot label or fallback to menu item slots
            label = label ?? (slots.default?.() as JSXElement);

            return UI({
                ...attrs,
                ...props,
                className: className.value,
                ref: internalRef,
                isDisabled: props.isDisabled,
                handleClick: onClick,
                // Slots
                before: beforeWithIcon as JSXElement,
                actionProps,
                after: afterWithIcon as JSXElement,
                children: (
                    <Text as="span" color={props.color}>
                        {label}
                    </Text>
                ) as JSXElement,
            });
        };
    },
    {
        name: 'LumxMenuItem',
        inheritAttrs: false,
        props: keysOf<MenuItemProps>()('icon', 'afterIcon', 'color', 'isDisabled', 'class'),
        emits: ['click'],
        slots: Object as SlotsType<{
            default: void;
            action: MenuItemActionSlotProps;
            before: void;
            after: void;
        }>,
    },
);

export { CLASSNAME, COMPONENT_NAME };
export default MenuItem;
