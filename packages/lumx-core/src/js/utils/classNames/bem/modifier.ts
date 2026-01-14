/**
 * Modifier
 * @example { 'is-disabled': true, 'is-selected': false }
 */
export type Modifier = Record<string, boolean | undefined | null>;

/**
 * Generates BEM modifier class names.
 *
 * @param baseName   The base BEM class to attach modifiers to.
 * @param modifiers  Map of modifier names to boolean values.
 * @returns Combined modifier class names string.
 *
 * @example
 * modifier('button', { active: true }); // 'button--active'
 * modifier('button', { active: true, disabled: false }); // 'button--active'
 */
export function modifier(baseName: string, modifiers: Modifier) {
    const modifierClasses = [];
    for (const [key, value] of Object.entries(modifiers)) {
        if (value) modifierClasses.push(`${baseName}--${key}`);
    }
    return modifierClasses.join(' ');
}
