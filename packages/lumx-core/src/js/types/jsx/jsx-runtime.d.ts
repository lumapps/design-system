import type React from 'react';
import type * as Vue from '@vue/runtime-dom';

/** Generic JSX definitions based on both React and Vue */
export namespace JSX {
    export type Node = Literal | Element | Iterable<Node>;
    export type Literal = string | number | boolean | undefined | null;
    export type Element = React.JSX.Element | Vue.VNode;
    export type IntrinsicElements = React.JSX.IntrinsicElements | Vue.NativeElements;
}
