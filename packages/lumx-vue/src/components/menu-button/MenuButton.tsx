import { defineComponent } from 'vue';

import type { JSXElement } from '@lumx/core/js/types';

import {
    DEFAULT_PROPS,
    MenuButton as UI,
    COMPONENT_NAME,
    MenuButtonProps as UIProps,
    type MenuButtonVariant,
    type MenuButtonVariantsProps,
} from '@lumx/core/js/components/Menu/MenuButton';

import { useClassName } from '../../composables/useClassName';
import { keysOf, VueToJSXProps } from '../../utils/VueToJSX';

import Button, { type ButtonProps } from '../button/Button';
import IconButton, { type IconButtonProps } from '../button/IconButton';
import MenuProvider from './MenuProvider';
import MenuTrigger from './MenuTrigger';
import MenuPopover, { MenuPopoverProps } from './MenuPopover';
import MenuList from './MenuList';
import Chip, { type ChipProps } from '../chip/Chip';
import Link, { type LinkProps } from '../link/Link';

/** Props that MenuButton explicitly declares */
type MenuButtonBaseProps = VueToJSXProps<UIProps, 'children' | 'triggerProps' | 'onOpen'> & {
    /** Menu button label */
    label: string;
    /** Trigger variant */
    variant?: MenuButtonVariant;
    /** Menu popover props */
    popoverProps?: MenuPopoverProps;
};

/** MenuButton props — discriminated union over the variant to inherit the target component's props. */
export type MenuButtonProps = MenuButtonVariantsProps<
    MenuButtonBaseProps,
    {
        button: ButtonProps;
        'icon-button': IconButtonProps;
        chip: ChipProps;
        link: LinkProps;
    }
>;

/** Menu trigger button component by variant */
const TRIGGER_COMPONENTS = {
    button: Button,
    'icon-button': IconButton,
    chip: Chip,
    link: Link,
} as const;

/**
 * MenuButton component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const MenuButton = defineComponent(
    (props: MenuButtonBaseProps, { emit, slots, attrs }) => {
        const className = useClassName(() => props.class);
        const onOpen = (isOpen: boolean) => emit('open', isOpen);

        return () => {
            const { variant = DEFAULT_PROPS.variant as MenuButtonVariant, label, popoverProps } = props;

            return UI(
                {
                    label,
                    children: slots.default?.() as JSXElement,
                    popoverProps,
                    onOpen,
                    variant,
                    triggerProps: { ...attrs, as: TRIGGER_COMPONENTS[variant], class: className.value },
                },
                { MenuProvider, MenuTrigger, MenuPopover, MenuList },
            );
        };
    },
    {
        name: 'LumxMenuButton',
        inheritAttrs: false,
        props: keysOf<MenuButtonBaseProps>()('label', 'popoverProps', 'class', 'variant'),
        emits: ['open'],
    },
);

/**
 * MenuButton component constructor.
 */
export interface MenuButtonConstructor {
    new (props: MenuButtonProps): {
        $props: MenuButtonProps;
    };
}

// Re-type the component to handle discriminated union in prop types
export default MenuButton as unknown as MenuButtonConstructor & typeof MenuButton;
export { COMPONENT_NAME };
