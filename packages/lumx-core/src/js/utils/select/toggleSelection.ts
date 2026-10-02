import type { Selector } from '../../types';
import { getWithSelector } from '../selectors';
import { findOptionById } from './findOptionById';

/**
 * Compute the next selection state after a user toggles an option.
 *
 * Single-mode behaviour (`isMultiple=false`):
 * - Returns the option matched by id (or `undefined` if none matches the id —
 *   e.g. when the consumer triggers a custom action via `beforeOptions`).
 * - With `allowDeselect`, returns `undefined` when the option is already the current value
 *   (used by the always-visible `SelectList`, which has no other way to clear the selection).
 *
 * Multi-mode behaviour (`isMultiple=true`):
 * - If the option is already in the current value array → returns a new array with it removed.
 * - Otherwise → returns a new array with the option appended.
 * - If the id matches no option in `options` (e.g. custom actions), the current array is returned unchanged.
 *
 * Pure function: never mutates `currentValue`.
 *
 * @param options          The list of options.
 * @param getOptionId      Selector returning the option id (matches `<Combobox.Option value>`).
 * @param currentValue     Current selection (option, array of options, or undefined).
 * @param selectedOptionId Id of the option the user just selected.
 * @param isMultiple       Whether to use multi-select semantics.
 * @param allowDeselect    Single mode only: deselect when the option is already selected. Default: false.
 * @return                 The new selection — `O | undefined` in single mode, `O[]` in multi mode.
 */
export function toggleSelection<O>(
    options: readonly O[] | undefined,
    getOptionId: Selector<O> | undefined,
    currentValue: O | O[] | undefined,
    selectedOptionId: unknown,
    isMultiple: boolean,
    allowDeselect = false,
): O | O[] | undefined {
    const newOption = findOptionById(options, getOptionId, selectedOptionId);

    if (!isMultiple) {
        // Single mode with deselect — selecting the current value again clears it.
        const isCurrent = currentValue != null && getWithSelector(getOptionId, currentValue as O) === selectedOptionId;
        if (allowDeselect && isCurrent) return undefined;
        // Single mode — return the matched option (or undefined when nothing matches).
        return newOption;
    }

    // Multi mode — toggle membership in the current array.
    const currentArray = Array.isArray(currentValue) ? currentValue : [];
    const existingIndex = currentArray.findIndex((item) => getWithSelector(getOptionId, item) === selectedOptionId);

    if (existingIndex === -1) {
        // Skip if no matching option found (e.g. custom action items).
        if (!newOption) return currentArray;
        return [...currentArray, newOption];
    }

    // Remove option (toggle off).
    const updated = [...currentArray];
    updated.splice(existingIndex, 1);
    return updated;
}
