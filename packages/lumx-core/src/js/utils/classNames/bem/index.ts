import { block } from './block';
import { element } from './element';
import { type Modifier } from './modifier';

/**
 * Setup BEM block & element generation for a given base name.
 */
export function bem(baseName: string) {
    return {
        block: (modifiers?: Modifier) => block(baseName, modifiers),
        element: (elem: string, modifiers?: Modifier) => element(baseName, elem, modifiers),
    };
}

export { block, element };
