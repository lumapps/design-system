import type { Typography } from '@lumx/core/js/constants';

/**
 * Returns the classname associated to the given typography. For example, for Typography.title it returns
 * lumx-typography-title
 */
export function typography(typo: Typography) {
    return `lumx-typography-${typo}`;
}
