import { block } from './block';
import { element } from './element';
import { modifier, type Modifier } from './modifier';

/**
 * Setup BEM block & element generation for a given base name.
 */
export function bem(baseName: string) {
    function blockFn(additionalClasses: string[]): string;
    function blockFn(modifiers?: Modifier, additionalClasses?: string[]): string;
    function blockFn(modifiersOrAdditionalClasses?: Modifier | string[], additionalClasses?: string[]) {
        if (Array.isArray(modifiersOrAdditionalClasses)) {
            return block(baseName, modifiersOrAdditionalClasses);
        }
        return block(baseName, modifiersOrAdditionalClasses, additionalClasses);
    }

    function elementFn(elem: string, additionalClasses: string[]): string;
    function elementFn(elem: string, modifiers?: Modifier, additionalClasses?: string[]): string;
    function elementFn(elem: string, modifiersOrAdditionalClasses?: Modifier | string[], additionalClasses?: string[]) {
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
