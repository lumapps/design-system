import { computed, defineComponent, provide, type PropType } from 'vue';
import type { Theme } from '@lumx/core/js/constants';
import { COMPAT_OPTIONS } from '../compat/compatOptions';

/**
 * ThemeProvider for Vue: wraps children with `provide('theme', value)` for theme isolation.
 * Vue's `provide()` requires a component boundary, so this is a component.
 */
export const ThemeProvider = defineComponent(
    (props: { value: Theme | undefined }, { slots }) => {
        provide(
            'theme',
            computed(() => props.value),
        );
        return () => slots.default?.();
    },
    {
        ...COMPAT_OPTIONS,
        name: 'LumxThemeProvider',
        props: { value: { type: String as PropType<Theme | undefined>, default: undefined } },
    },
);
