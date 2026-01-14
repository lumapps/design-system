import classnames from 'classnames';
import { modifier, type Modifier } from './modifier';

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
export function block(baseName: string, additionalClasses: string[]): string;
export function block(baseName: string, modifiers?: Modifier, additionalClasses?: string[]): string;
export function block(
    baseName: string,
    modifiersOrAdditionalClasses?: Modifier | string[],
    additionalClasses?: string[],
) {
    let modifiers: Modifier | undefined;
    let classes: string[] | undefined;

    if (Array.isArray(modifiersOrAdditionalClasses)) {
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
