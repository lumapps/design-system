// src/utils/props.ts

// Import the necessary types from the 'vue' package (Vue 3)
// We need 'PropType' to correctly cast complex types and 'ComponentObjectPropsOptions'
// to ensure the final object structure is correct for the 'props' option.
import type { ComponentObjectPropsOptions } from 'vue';

// 1. Define a type that ensures every key in your interface (I) is mapped to
// a valid Vue prop definition object. This is more robust than PropOptions.
type PropDefinition<I> = ComponentObjectPropsOptions<I>;

/**
 * An identity function that helps define a Vue 2/3 compatible props option
 * while ensuring it matches a given TypeScript Interface I.
 */
export function defineProps<I>(props: PropDefinition<I>): PropDefinition<I> {
    // This function returns the object, acting solely as a type enforcer.
    return props;
}
