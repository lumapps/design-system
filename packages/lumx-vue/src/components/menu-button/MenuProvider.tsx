import { defineComponent, onMounted, onUnmounted, ref, useSlots } from 'vue';

import { MENU_PROVIDER_COMPONENT_NAME } from '@lumx/core/js/components/Menu/constants';
import { setupMenu } from '@lumx/core/js/components/Menu/setupMenu';

import { useId } from '../../composables/useId';
import { getName } from '../../utils/VueToJSX';

import { provideMenuContext } from './context';

/** MenuProvider props. */
export interface MenuProviderProps {
    onOpen?: (isOpen: boolean) => void;
    class?: string;
}

/**
 * MenuProvider component.
 *
 * @param  props Component props.
 * @return Vue element.
 */
const MenuProvider = defineComponent(
    (props: MenuProviderProps, { emit }) => {
        const slots = useSlots();
        const menuId = useId();
        const triggerId = useId();
        const anchorRef = ref<HTMLElement | null>(null);
        const handle = setupMenu({ menuId });

        onMounted(() => {
            const unsub = handle.subscribe('open', (isOpen: boolean) => emit('open', isOpen));
            onUnmounted(() => {
                unsub();
                handle.destroy();
            });
        });

        provideMenuContext({ handle, menuId, triggerId, anchorRef });

        return () => slots.default?.();
    },
    {
        name: getName(MENU_PROVIDER_COMPONENT_NAME),
        inheritAttrs: false,
        props: {
            onOpen: { type: Function as any, default: undefined },
            class: { type: String, default: undefined },
        },
        emits: ['open'],
    },
);

export default MenuProvider;
