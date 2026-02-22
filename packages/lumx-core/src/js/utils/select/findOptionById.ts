import type { Selector } from '../../types';
import { getWithSelector } from '../selectors';

/**
 * Find the option whose id matches the given value.
 *
 * Used by Select* wrappers to resolve a selection event (which carries the option id
 * as `selectedOption.value`) back to the original option object.
 *
 * @param options    The list of options.
 * @param getOptionId Selector returning the option id (matches `<Combobox.Option value>`).
 * @param id          The id to match against.
 * @return The matching option, or `undefined` if none is found / inputs are nullish.
 */
export function findOptionById<O>(
    options: readonly O[] | undefined,
    getOptionId: Selector<O> | undefined,
    id: unknown,
): O | undefined {
    if (id == null) return undefined;
    return options?.find((option) => getWithSelector(getOptionId, option) === id);
}
