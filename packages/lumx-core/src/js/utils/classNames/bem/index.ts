import { ClassValue } from 'classnames/types';

import { block } from './block';
import { element } from './element';
import { modifier, type Modifier } from './modifier';

/**
 * Setup BEM block & element generation for a given base name.
 */
export function bem(baseName: string) {
    function blockFn(additionalClasses: ClassValue[]): string;
    function blockFn(modifiers?: Modifier, additionalClasses?: ClassValue[]): string;
    function blockFn(modifiersOrAdditionalClasses?: Modifier | ClassValue[], additionalClasses?: ClassValue[]) {
        if (Array.isArray(modifiersOrAdditionalClasses)) {
            return block(baseName, modifiersOrAdditionalClasses);
        }
        return block(baseName, modifiersOrAdditionalClasses, additionalClasses);
    }

    function elementFn(elem: string, additionalClasses: ClassValue[]): string;
    function elementFn(elem: string, modifiers?: Modifier, additionalClasses?: ClassValue[]): string;
    function elementFn(
        elem: string,
        modifiersOrAdditionalClasses?: Modifier | ClassValue[],
        additionalClasses?: ClassValue[],
    ) {
        if (Array.isArray(modifiersOrAdditionalClasses)) {
            return element(baseName, elem, modifiersOrAdditionalClasses);
        }
        return element(baseName, elem, modifiersOrAdditionalClasses, additionalClasses);
    }

    return {
        block: blockFn,
        element: elementFn,
        modifier: (modifiers: Modifier) => modifier(baseName, modifiers),
    };
}

export { block, element };
