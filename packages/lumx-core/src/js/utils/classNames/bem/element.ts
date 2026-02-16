import { ClassValue } from 'classnames/types';

import { block } from './block';
import type { Modifier } from './modifier';

/**
 * Creates a BEM element class generator function for the given base class.
 * Returns a function that generates BEM element class names with optional modifiers.
 *
 * @param baseClass  The base BEM block class name (e.g., 'button', 'card')
 * @param elem       The BEM element name (e.g., 'icon', 'title')
 * @param modifier   Optional BEM modifier ()
 * @returns combined BEM element class name
 *
 * @example
 * element('my-button', 'icon'); // 'my-button__icon'
 * element('my-button', 'icon', { active: true }); // 'my-button__icon my-button__icon--active'
 */
export function element(baseClass: string, elem: string, additionalClasses: ClassValue[]): string;
export function element(
    baseClass: string,
    elem: string,
    modifiers?: Modifier,
    additionalClasses?: ClassValue[],
): string;
export function element(
    baseClass: string,
    elem: string,
    modifiersOrAdditionalClasses?: Modifier | ClassValue[],
    additionalClasses?: ClassValue[],
) {
    if (Array.isArray(modifiersOrAdditionalClasses)) {
        return block(`${baseClass}__${elem}`, modifiersOrAdditionalClasses);
    }
    return block(`${baseClass}__${elem}`, modifiersOrAdditionalClasses, additionalClasses);
}
