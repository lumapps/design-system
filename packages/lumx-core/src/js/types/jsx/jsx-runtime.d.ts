import type React from 'react';

// TODO: add vue JSX types (Vue.Node & VudeNativeElements) ?
//import type * as Vue from '@vue/runtime-dom';

/** Generic JSX definitions */
export namespace JSX {
    export type Node = Literal | Element | Iterable<Node>;
    export type Literal = string | number | boolean | undefined | null;
    export type Element = React.JSX.Element;
    export type IntrinsicElements = React.JSX.IntrinsicElements;
}
