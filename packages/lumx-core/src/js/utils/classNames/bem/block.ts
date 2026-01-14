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
export function block(baseName: string, modifiers?: Modifier) {
    if (!modifiers) {
        return baseName;
    }

    return classnames(
        // Base class
        baseName,
        // Modifier(s)
        modifier(baseName, modifiers),
    );
}
