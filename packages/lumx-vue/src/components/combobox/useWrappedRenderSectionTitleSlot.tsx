import { type ComputedRef, type Slot, computed } from 'vue';

import type { JSXElement } from '@lumx/core/js/types';

/** Render function passed as `renderSectionTitle` to a core Select* template. */
type WrappedRenderSectionTitle = (sectionId: string | undefined, options: unknown[]) => JSXElement;

/**
 * Adapts a Vue scoped section-title slot into the `renderSectionTitle` callback shape
 * expected by the core Select* templates.
 */
export function useWrappedRenderSectionTitleSlot(
    slot: Slot | undefined,
): ComputedRef<WrappedRenderSectionTitle | undefined> {
    return computed(() => {
        if (!slot) return undefined;
        return (sectionId: string | undefined, options: unknown[]) => slot({ sectionId, options }) as JSXElement;
    });
}
