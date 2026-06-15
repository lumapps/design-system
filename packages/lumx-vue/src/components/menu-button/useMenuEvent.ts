import { onMounted, onUnmounted, ref, type Ref } from 'vue';

import type { MenuEventMap } from '@lumx/core/js/components/Menu/types';

import { useMenuContext } from './context';

export function useMenuEvent<E extends keyof MenuEventMap>(
    event: E,
    initialValue: MenuEventMap[E],
): Ref<MenuEventMap[E]> {
    const { handle } = useMenuContext();
    const value = ref(initialValue) as Ref<MenuEventMap[E]>;

    let unsub: (() => void) | undefined;
    onMounted(() => {
        unsub = handle.subscribe(event, (v) => {
            value.value = v;
        });
    });
    onUnmounted(() => unsub?.());

    return value;
}
