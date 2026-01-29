import type React from 'react';

export type JSXElement =
    | boolean
    | number
    | string
    | React.JSX.Element
    | React.ReactNode
    | Iterable<JSXElement>
    | undefined
    | null;

export type ElementType = React.ElementType;
