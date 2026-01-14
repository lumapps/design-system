import { block } from './block';
import { element } from './element';
import type { Modifier } from './modifier';

export { block } from './block';
export { element } from './element';
export { modifier, Modifier } from './modifier';

export function bem(baseName: string) {
    return {
        block: (modifiers?: Modifier) => block(baseName, modifiers),
        element: (elem: string, modifiers?: Modifier) => element(baseName, elem, modifiers),
    };
}
