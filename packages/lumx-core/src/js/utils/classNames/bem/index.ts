import { block } from './block';
import { element } from './element';
import { modifier } from './modifier';
import type { AdditionalClasses, Modifier } from './types';

/**
 * Setup BEM block & element generation for a given base name.
 */
export function bem(baseName: string) {
    function blockFn(additionalClasses: AdditionalClasses): string;
    function blockFn(modifiers?: Modifier, additionalClasses?: AdditionalClasses): string;
    function blockFn(
        modifiersOrAdditionalClasses?: Modifier | AdditionalClasses,
        additionalClasses?: AdditionalClasses,
    ) {
        return block(baseName, modifiersOrAdditionalClasses as Modifier, additionalClasses);
    }

    function elementFn(elem: string, additionalClasses: AdditionalClasses): string;
    function elementFn(elem: string, modifiers?: Modifier, additionalClasses?: AdditionalClasses): string;
    function elementFn(
        elem: string,
        modifiersOrAdditionalClasses?: Modifier | AdditionalClasses,
        additionalClasses?: AdditionalClasses,
    ) {
        return element(baseName, elem, modifiersOrAdditionalClasses as Modifier, additionalClasses);
    }

    return {
        block: blockFn,
        element: elementFn,
        modifier: (modifiers: Modifier) => modifier(baseName, modifiers),
    };
}

export { block, element };
