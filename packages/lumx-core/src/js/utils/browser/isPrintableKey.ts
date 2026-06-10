/**
 * Is the key a single printable character (not Space, no modifier keys)?
 *
 * Used by typeahead-style keyboard handlers (menu, combobox) to detect when a
 * keypress should start/continue a type-to-search rather than trigger navigation.
 */
export function isPrintableKey({ key, altKey, ctrlKey, metaKey }: KeyboardEvent): boolean {
    return key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey;
}
