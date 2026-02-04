import { computed } from 'vue';

let i = 0;

/**
 * Generate a unique id (for use in a11y or other id based DOM linking).
 */
export function useId() {
    return computed(() => {
        i += 1;
        return `:lumx${i}:`;
    }).value;
}
