import get from 'lodash/get';
import React, { ReactElement, ReactNode, Ref } from 'react';
import { Theme } from '@lumx/react';

/** Get types of the values of a record. */
export type ValueOf<T extends Record<any, any>> = T[keyof T];

/**
 * Properties of a component to use to determine it's name.
 * In the order of preference.
 */
const NAME_PROPERTIES: string[] = [
    'type',
    'type.displayName',
    'displayName',
    'name',
    'type.name',
    'props.mdxType',
    '_reactInternalFiber.elementType.name',
];

/** LumX Component Type. */
export type Comp<P, T = HTMLElement> = {
    (props: P & { ref?: Ref<T> }): ReactElement | null;
    /** React component type. */
    readonly $$typeof: symbol;
    /** Component default props. */
    defaultProps?: Partial<P>;
    /** Component name. */
    displayName?: string;
    /** Component base class name. */
    className?: string;
};

/** Union type of all heading elements */
export type HeadingElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/** Union type of all text elements */
export type TextElement = 'span' | 'p' | HeadingElement;

export type HasPolymorphicAs<E extends React.ElementType> = React.ComponentPropsWithoutRef<E> & {
    /**
     * Customize the rendered component.
     */
    as?: E;
};

export interface HasTheme {
    /**
     * Theme adapting the component to light or dark background.
     */
    theme?: Theme;
}

export interface HasClassName {
    /**
     * Class name forwarded to the root element of the component.
     */
    className?: string;
}


export interface HasCloseMode {
    /**
     * Choose how the children are hidden when closed
     * ('hide' keeps the children in DOM but hide them, 'unmount' remove the children from the DOM).
     */
    closeMode?: 'hide' | 'unmount';
}

/**
 * Define a generic props types.
 */
export interface GenericProps extends HasClassName {
    /**
     * Any prop (particularly any supported prop for a HTML element).
     */
    [propName: string]: any;
}

/**
 * Callback function type alias (use for readability)
 */
export type Callback = () => void;
export type Predicate<T> = (t: T) => boolean;

/**
 * Create a predicate function that checks if a ReactNode is a react element from the given component.
 *
 * @param  component React function component or the component name
 * @return predicate returning true if value is instance of the component
 */
export const isComponent =
    <C>(component: Comp<C, any> | string) =>
    (instance: ReactNode): instance is ReactElement => {
        const componentName = typeof component === 'string' ? component : component.displayName;

        return (
            !!get(instance, '$$typeof') &&
            NAME_PROPERTIES.some((nameProperty: string): boolean => get(instance, nameProperty) === componentName)
        );
    };

/**
 * Similar to `isComponent` but more precise as it's not based on the component `displayName` but on the component function reference.
 */
export const isComponentType =
    (type: ReactElement['type']) =>
    (node: ReactNode): node is ReactElement =>
        React.isValidElement(node) && node.type === type;

/**
 * JS falsy values.
 * (excluding `NaN` as it can't be distinguished from `number`)
 */
export type Falsy = false | undefined | null | 0 | '';

/**
 * Require either `aria-label` or `arial-labelledby` prop.
 * If none are set, the order will prioritize `aria-labelledby` over `aria-label` as it
 * needs a visible element.
 */
export type HasAriaLabelOrLabelledBy<T = string | undefined> = T extends string
    ? {
          /**
           * The id of the element to use as title of the dialog. Can be within or out of the dialog.
           * Although it is not recommended, aria-label can be used instead if no visible element is available.
           */
          'aria-labelledby': T;
          /** The label of the dialog. */
          'aria-label'?: undefined;
      }
    : {
          'aria-label': string;
          'aria-labelledby'?: undefined;
      };

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

/**
 * Rectangle size
 */
export type RectSize = { width: number; height: number };

/**
 * Maybe a HTMLElement or a React ref of a HTMLElement
 */
export type MaybeElementOrRef<E extends HTMLElement> = E | React.RefObject<E | null> | null | undefined;

/**
 * A point coordinate in 2D space
 */
export type Point = { x: number; y: number };
