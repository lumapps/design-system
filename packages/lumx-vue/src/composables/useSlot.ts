import { JSXElement } from '@lumx/core/js/types';
import { useSlots } from 'vue';

/**
 * Returns the slot casted as a JSXElement
 * @returns () => JSXElement | null
 */
export const useSlot = (slot: string = 'default') => {
    const slots = useSlots();

    return (): JSXElement | null => {
        const slotFn = slots?.[slot];
        return slotFn ? (slotFn() as JSXElement) : null;
    };
};
