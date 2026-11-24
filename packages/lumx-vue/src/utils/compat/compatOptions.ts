export const VUE_3_COMPAT_CONFIG = { MODE: 3 };

/**
 * LumX is Vue 3 code, so compat must apply no Vue 2 behaviour to it. Plain Vue 3 ignores this
 * option. Typed as `object`, and not with a visible `compatConfig` key, so the spread adds no key
 * that the `defineComponent(setup, options)` excess property check would reject.
 */
export const COMPAT_OPTIONS: object = { compatConfig: VUE_3_COMPAT_CONFIG };
