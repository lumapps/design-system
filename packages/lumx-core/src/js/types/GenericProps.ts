import type { HasClassName } from './HasClassName';

/**
 * Define a generic props types.
 */
export interface GenericProps extends HasClassName {
    /**
     * Any prop (particularly any supported prop for a HTML element).
     */
    [propName: string]: any;
}
