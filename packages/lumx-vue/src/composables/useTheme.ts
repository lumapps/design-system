import { type ComputedRef, type Ref, computed, inject, unref } from 'vue';

import { Theme } from '@lumx/core/js/constants';

export interface UseTheme {
    defaultTheme?: Theme;
}
/**
 * Retrieves the globally applied theme.
 * @returns computed theme value (auto-updates when the provided theme changes)
 */
export function useTheme(options: UseTheme = { defaultTheme: Theme.light }): ComputedRef<Theme | undefined> {
    const { defaultTheme } = options;
    const injected = inject<Theme | Ref<Theme | undefined> | undefined>('theme', undefined);
    return computed(() => unref(injected) || defaultTheme);
}
