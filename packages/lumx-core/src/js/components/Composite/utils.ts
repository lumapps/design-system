/**
 * Get the visible label for an item element (its trimmed `textContent`).
 *
 * Used for typeahead matching: the user types the characters they see, which is the
 * item's label — not its `data-value` (which can be an unrelated id).
 */
export function getOptionLabel(option: HTMLElement): string {
    return option.textContent?.trim() ?? '';
}

/**
 * Get the value for an item element.
 * Uses `data-value` when set; falls back to the item label (see {@link getOptionLabel}).
 *
 * This is the *selection* value, which may differ from the visible label.
 */
export function getOptionValue(option: HTMLElement): string {
    return option.dataset.value ?? getOptionLabel(option);
}

/** Returns true when an item carries aria-disabled="true". */
export function isOptionDisabled(option: HTMLElement): boolean {
    return option.getAttribute('aria-disabled') === 'true';
}

export const isSelected = (el: Element) => el.getAttribute('aria-selected') === 'true';
