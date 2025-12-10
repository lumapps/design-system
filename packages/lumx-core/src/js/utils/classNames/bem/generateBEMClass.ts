import classnames from 'classnames';
import type { ClassValue } from 'classnames/types';

/**
 * Modifier
 * @example 'is-disabled'
 * @example { 'is-disabled': true, 'is-selected': false }
 * @example ['another-class'] // => Added as-is, not as a BEM modifier suffix
 */
export type Modifier = string | Record<string, boolean | undefined | null> | ClassValue[];

function generateModifierClasses(baseClass: string, modifier?: Modifier) {
    if (!modifier) {
        return undefined;
    }

    if (Array.isArray(modifier)) {
        return modifier;
    }

    if (typeof modifier === 'string') {
        return `${baseClass}--${modifier}`;
    }

    const classes = [];
    for (const [key, value] of Object.entries(modifier)) {
        if (value) classes.push(`${baseClass}--${key}`);
    }
    return classes;
}

/**
 * Generates a BEM (Block Element Modifier) class name string.
 * Combines a base class with optional modifiers and additional classes.
 *
 * @param baseClass - The base BEM class (block or element)
 * @param modifier - Optional modifier as:
 *   - string: creates `baseClass--modifier`
 *   - object: creates `baseClass--key` for each truthy value
 *   - array: passes through as additional classes
 * @param additionalClasses - Optional additional classes to include
 * @returns Combined class name string
 *
 * @example
 * generateBEMClass('button'); // 'button'
 * generateBEMClass('button', 'primary'); // 'button button--primary'
 * generateBEMClass('button', { active: true, disabled: false }); // 'button button--active'
 * generateBEMClass('button', 'primary', 'my-class'); // 'button button--primary my-class'
 */
export function generateBEMClass(
    baseClass: string,
    modifier?: Modifier,
    additionalClasses?: ClassValue | ClassValue[],
) {
    return classnames(
        // Base class
        baseClass,
        // Modifier(s)
        generateModifierClasses(baseClass, modifier),
        // Additional classes
        additionalClasses,
    );
}
