import { type Ref, ref, shallowRef, watchEffect } from 'vue';
import { createTooltipOpenManager, type TooltipOpenManager } from '@lumx/core/js/components/Tooltip/tooltipOpenManager';

/**
 * Vue composable controlling tooltip visibility using mouse hover the anchor and delay.
 *
 * @param delay         Delay in millisecond to display the tooltip.
 * @param anchorElement Tooltip anchor element ref.
 * @param onOpen        Called each time the open delay ends, before the state changes.
 * @return whether or not to show the tooltip plus popper mount callback and manager ref.
 */
export function useTooltipOpen(
    delay: Ref<number | undefined>,
    anchorElement: Ref<HTMLElement | null>,
    onOpen?: () => void,
) {
    const isOpen = ref(false);
    const managerRef = shallowRef<TooltipOpenManager>();

    watchEffect((onCleanup) => {
        const el = anchorElement.value;
        if (!el) return;

        const manager = createTooltipOpenManager({
            delay: delay.value,
            onStateChange: (value) => {
                if (value) onOpen?.();
                isOpen.value = value;
            },
        });

        managerRef.value = manager;
        manager.attachAnchor(el);

        onCleanup(() => {
            manager.destroy();
            // The manager dies with the anchor, so the open state must die with it.
            isOpen.value = false;
        });
    });

    const onPopperMount = (el: HTMLElement | null) => {
        managerRef.value?.attachPopper(el);
    };

    return { isOpen, onPopperMount, manager: managerRef };
}
