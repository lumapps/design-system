import type { ClassValue } from 'classnames/types';

import { generateBEMClass, type Modifier } from './generateBEMClass';

/**
 * Creates a BEM element class generator function for the given base class.
 * Returns a function that generates BEM element class names with optional modifiers.
 *
 * @param baseClass - The base BEM block class name (e.g., 'button', 'card')
 * @returns A function that accepts:
 *   - elem - The BEM element name (e.g., 'icon', 'title')
 *   - modifier - Optional BEM modifier (string, object, or array)
 *   - additionalClasses - Optional additional classes to include
 *
 * @example
 * const button = element('my-button');
 * button('icon'); // 'my-button__icon'
 * button('icon', 'large'); // 'my-button__icon my-button__icon--large'
 * button('icon', { active: true }); // 'my-button__icon my-button__icon--active'
 */
export const element =
    (baseClass: string) => (elem: string, modifier?: Modifier, additionalClasses?: ClassValue | ClassValue[]) =>
        generateBEMClass(`${baseClass}__${elem}`, modifier, additionalClasses);
