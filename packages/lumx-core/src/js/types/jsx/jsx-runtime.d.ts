import type React from 'react';

/** Generic JSX definitions compatible with both React and Vue */
export namespace JSX {
    // Use React.ReactNode which already handles iterables properly
    export type Node = React.ReactNode;
    export type Literal = string | number | boolean | undefined | null;
    export type Element = React.JSX.Element;
    export type IntrinsicElements = React.JSX.IntrinsicElements;
    /** Allow `key` on all JSX component elements (used in `.map()` loops). */
    export type IntrinsicAttributes = React.JSX.IntrinsicAttributes;
}
