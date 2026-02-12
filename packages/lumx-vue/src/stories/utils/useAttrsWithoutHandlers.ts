import { useAttrs, computed, type ComputedRef } from 'vue';

/**
 * Returns attrs with all event handler props filtered out.
 * Event handlers are identified as props that start with "on" AND are functions.
 * This is useful in story components where event handlers are managed via props
 * instead of being passed through attrs.
 *
 * Non-function props starting with "on" (like "online", "onboarding") are NOT filtered out.
 *
 * @returns Computed ref containing attrs without event handlers
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useAttrsWithoutHandlers } from '@lumx/vue/stories/utils/useAttrsWithoutHandlers';
 *
 * const attrs = useAttrsWithoutHandlers();
 * </script>
 *
 * <template>
 *   <Button v-bind="attrs" @click="handleClick">
 *     <slot />
 *   </Button>
 * </template>
 * ```
 */
export const useAttrsWithoutHandlers = (): ComputedRef<any> => {
    const attrs = useAttrs();

    return computed(() => {
        const filtered: Record<string, any> = {};

        for (const [key, value] of Object.entries(attrs)) {
            // Filter out event handlers: props that start with "on" AND are functions
            // This preserves non-function props like "online", "onboarding", etc.
            const isEventHandler = key.startsWith('on') && typeof value === 'function';

            if (!isEventHandler) {
                filtered[key] = value;
            }
        }

        return filtered;
    });
};
