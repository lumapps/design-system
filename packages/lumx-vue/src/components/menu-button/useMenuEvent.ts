import { onMounted, onUnmounted, ref } from 'vue';

import type { MenuEventMap } from '@lumx/core/js/components/Menu/types';

import { useMenuContext } from './context';

export function useMenuEvent<E extends keyof MenuEventMap>(event: E, initialValue: MenuEventMap[E]) {
    const { handle } = useMenuContext();
    const value = ref(initialValue) as ReturnType<typeof ref<MenuEventMap[E]>>;

    let unsub: (() => void) | undefined;
    onMounted(() => {
        unsub = handle.subscribe(event, (v) => {
            value.value = v;
        });
    });
    onUnmounted(() => unsub?.());

    return value;
}
