import { inject } from 'vue';

import { Theme } from '@lumx/core/js/constants';

export interface UseTheme {
    defaultTheme?: Theme;
}
/**
 * Retrives the globally applied theme.
 * @returns theme
 */
export function useTheme(options: UseTheme = { defaultTheme: Theme.light }) {
    const { defaultTheme } = options;
    return inject('theme', defaultTheme);
}
