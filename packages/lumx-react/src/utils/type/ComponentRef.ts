import type React from 'react';
import type { Comp } from './Comp';

/**
 * Extract ref type for a component or JSX intrinsic element
 *
 * @example ComponentRef<'div'> => React.Ref<HTMLDivElement>
 * @example ComponentRef<Button> => React.Ref<HTMLButtonElement
 */
export type ComponentRef<C> = C extends keyof JSX.IntrinsicElements
    ? JSX.IntrinsicElements[C]['ref']
    : C extends Comp<any, infer T>
      ? React.Ref<T>
      : C extends React.JSXElementConstructor<{ ref?: infer R }>
        ? R
        : never;
