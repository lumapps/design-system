import { type ComputedRef, type MaybeRefOrGetter } from 'vue';

import { classNames } from '@lumx/core/js/utils';

import { useAttrFallback } from './useAttrFallback';

/**
 * Composable that merges the Vue `class` prop with the `className` attribute (for React compat).
 *
 * Usage inside `defineComponent` setup:
 * ```tsx
 * const className = useClassName(() => props.class);
 * // Then use className.value instead of props.class when forwarding to the core UI:
 * return () => <SomeUI {...props} className={className.value} />;
 * ```
 *
 * @param  classProp The Vue `class` prop value (or a getter/ref returning it).
 * @return Computed ref holding the merged class string (or undefined when empty).
 */
export function useClassName(classProp: MaybeRefOrGetter<string | undefined>): ComputedRef<string | undefined> {
    return useAttrFallback(classProp, 'className', classNames.join as any);
}
