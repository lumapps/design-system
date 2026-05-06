import classnames from 'classnames';
import { modifier } from './modifier';
import type { AdditionalClasses, Modifier } from './types';

/**
 * Generates a BEM block + modifier class name string.
 * Combines a base class with optional modifiers and additional classes.
 *
 * @param baseName   The base BEM class
 * @param modifier   Optional modifiers
 * @returns Combined class name string
 *
 * @example
 * block('button'); // 'button'
 * block('button', { active: true, disabled: false }); // 'button button--active'
 */
export function block(baseName: string, additionalClasses: AdditionalClasses): string;
export function block(baseName: string, modifiers?: Modifier, additionalClasses?: AdditionalClasses): string;
export function block(
    baseName: string,
    modifiersOrAdditionalClasses?: Modifier | AdditionalClasses,
    additionalClasses?: AdditionalClasses,
) {
    let modifiers: Modifier | undefined;
    let classes: AdditionalClasses | undefined;

    if (typeof modifiersOrAdditionalClasses === 'string' || Array.isArray(modifiersOrAdditionalClasses)) {
        classes = modifiersOrAdditionalClasses;
    } else {
        modifiers = modifiersOrAdditionalClasses;
        classes = additionalClasses;
    }

    if (!modifiers && !classes) {
        return baseName;
    }

    return classnames(
        // Additional classes
        classes,
        // Base class
        baseName,
        // Modifier(s)
        modifiers ? modifier(baseName, modifiers) : null,
    );
}
