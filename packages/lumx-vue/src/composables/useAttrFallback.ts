import { computed, useAttrs, type ComputedRef, type MaybeRefOrGetter, toValue } from 'vue';

/**
 * Composable that falls back to an `$attrs` value when the Vue prop is absent.
 *
 * When a core JSX component renders a Vue sub-component, it passes props using React naming
 * conventions (e.g. `className`, `tabIndex`). Since these names are not declared Vue props,
 * they land in `$attrs`. This composable reads the fallback attr and merges it with the
 * corresponding Vue prop value using a caller-supplied merge function (or `??` by default).
 *
 * Usage inside `defineComponent` setup:
 * ```tsx
 * // With default merge (vueProp ?? attrFallback):
 * const tabIndex = useAttrFallback(() => attrs.tabindex, 'tabIndex');
 *
 * // With custom merge function:
 * const className = useAttrFallback(
 *     () => props.class,
 *     'className',
 *     (vue, fallback) => classNames.join(vue, fallback as string | undefined) || undefined,
 * );
 * ```
 *
 * @param  vueProp      The Vue prop value (or a getter/ref returning it).
 * @param  attrFallback The attribute name to read from `$attrs` as the fallback.
 * @param  merge        Optional merge function. Defaults to `vueProp ?? attrFallback`.
 * @return Computed ref holding the merged value.
 */
export function useAttrFallback<T>(
    vueProp: MaybeRefOrGetter<T>,
    attrFallback: string,
    merge?: (vuePropValue: T, attrFallbackValue: unknown) => T,
): ComputedRef<T> {
    const attrs = useAttrs();
    return computed(() => {
        const vuePropValue = toValue(vueProp);
        const attrFallbackValue = attrs[attrFallback];
        if (merge) return merge(vuePropValue, attrFallbackValue);
        return (vuePropValue ?? attrFallbackValue) as T;
    });
}
