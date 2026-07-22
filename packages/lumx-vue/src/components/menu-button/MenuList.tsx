import { defineComponent, nextTick, onMounted, onUnmounted, ref, useSlots, watch } from 'vue';

import type { JSXElement } from '@lumx/core/js/types';
import {
    MenuList as UI,
    MenuListProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Menu/MenuList';

import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';

import { useMenuContext } from './context';
import { useMenuOpen } from './useMenuOpen';

/** MenuList props. */
export type MenuListProps = VueToJSXProps<UIProps, 'id' | 'aria-labelledby'>;

/**
 * MenuList component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const MenuList = defineComponent(
    (props: MenuListProps) => {
        const slots = useSlots();
        const { menuId, triggerId, handle } = useMenuContext();
        const [isOpen] = useMenuOpen();
        const className = useClassName(() => props.class);
        const internalRef = ref<HTMLElement | null>(null);

        onMounted(() => {
            const el = internalRef.value;
            if (!el) return;
            const cleanup = handle.registerMenu(el);
            onUnmounted(() => cleanup?.());
        });

        watch(isOpen, (open) => {
            if (open) nextTick(() => handle.flushPendingNavigation());
        });

        return () =>
            UI({
                className: className.value,
                id: menuId,
                'aria-labelledby': triggerId,
                ref: internalRef,
                children: isOpen.value ? (slots.default?.() as JSXElement) : null,
            });
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<MenuListProps>()('class'),
    },
);

export { CLASSNAME, COMPONENT_NAME };
export default MenuList;
