import type { ClassValue } from 'classnames/types';

import { generateBEMClass, type Modifier } from './generateBEMClass';

/**
 * Creates a BEM block class generator function for the given base class.
 * Returns a function that generates BEM class names with optional modifiers.
 *
 * @param baseClass - The base BEM block class name (e.g., 'button', 'card')
 * @returns A function that accepts:
 *   - modifier - Optional BEM modifier (string, object, or array)
 *   - additionalClasses - Optional additional classes to include
 *
 * @example
 * const button = block('my-button');
 * button(); // 'my-button'
 * button('primary'); // 'my-button my-button--primary'
 * button({ active: true }); // 'my-button my-button--active'
 */
export const block = (baseClass: string) => (modifier?: Modifier, additionalClasses?: ClassValue | ClassValue[]) =>
    generateBEMClass(baseClass, modifier, additionalClasses);
