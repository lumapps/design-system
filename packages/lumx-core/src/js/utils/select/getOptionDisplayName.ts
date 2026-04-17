import type { Selector } from '../../types';
import { getWithSelector } from '../selectors';

/**
 * Get the display name for a single option value.
 *
 * Resolves the option's display name by trying `getOptionName` first,
 * then falling back to `getOptionId`, returning `''` for nullish values.
 */
export function getOptionDisplayName<O>(
    value: O | undefined,
    getOptionName?: Selector<O, string | undefined | null>,
    getOptionId?: Selector<O>,
): string {
    if (value === undefined || value === null) return '';
    if (getOptionName) {
        const name = getWithSelector(getOptionName, value);
        if (name != null) return String(name);
    }
    if (getOptionId) {
        return String(getWithSelector(getOptionId, value));
    }
    return '';
}
