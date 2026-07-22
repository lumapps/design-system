import { defineComponent, ref, watchEffect } from 'vue';

import type { JSXElement } from '@lumx/core/js/types';

import {
    MenuTrigger as UI,
    MenuTriggerProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
} from '@lumx/core/js/components/Menu/MenuTrigger';

import { useClassName } from '../../composables/useClassName';
import { getName, keysOf, VueToJSXProps } from '../../utils/VueToJSX';
import { Button } from '../button';

import { useMenuContext } from './context';
import { useMenuOpen } from './useMenuOpen';

/** MenuTrigger props. */
export type MenuTriggerProps = VueToJSXProps<UIProps, 'menuId' | 'isOpen'>;

/**
 * MenuTrigger component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const MenuTrigger = defineComponent(
    (props: MenuTriggerProps, { slots, attrs }) => {
        const { menuId, triggerId, anchorRef, handle } = useMenuContext();
        const [isOpen] = useMenuOpen();
        const className = useClassName(() => props.class);
        const internalRef = ref<any>(null);

        watchEffect((onCleanup) => {
            const domEl = internalRef.value?.$el ?? internalRef.value;
            if (!domEl) return;
            // Set menu popover anchor on the trigger
            (anchorRef as any).value = domEl;
            // Register the menu trigger element in core logic
            const cleanup = handle.registerTrigger(domEl);
            // Cleanup
            onCleanup(() => cleanup());
        });

        return () => {
            const { as, ...restAttrs } = attrs as Record<string, any>;

            let Trigger: any = Button;
            if (slots.trigger) {
                // Custom trigger via scoped slot
                Trigger = (slotProps: Record<string, any>) =>
                    slots.trigger!({ triggerProps: { ...slotProps, ref: internalRef } });
            } else if (as) {
                // Use `as` prop, attr fallback, or default to Button
                Trigger = as;
            }

            return UI(
                {
                    ...restAttrs,
                    id: triggerId,
                    ref: slots.trigger ? undefined : internalRef,
                    className: className.value,
                    menuId,
                    isOpen: isOpen.value,
                    children: slots.default?.() as JSXElement,
                },
                { Trigger },
            );
        };
    },
    {
        name: getName(COMPONENT_NAME),
        inheritAttrs: false,
        props: keysOf<MenuTriggerProps>()('class', 'id'),
    },
);

export { CLASSNAME, COMPONENT_NAME };
export default MenuTrigger;
