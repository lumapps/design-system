import get from 'lodash/get';
import { ReactElement, ReactNode, Ref } from 'react';

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

/**
 * Define a generic props types.
 */
export interface GenericProps {
    /**
     * Any prop (particularly any supported prop for a HTML element).
     * E.g. classNames, onClick, disabled, ...
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
export const isComponent = <C>(component: Comp<C, any> | string) => (instance: ReactNode): instance is ReactElement => {
    const componentName = typeof component === 'string' ? component : component.displayName;

    return (
        !!get(instance, '$$typeof') &&
        NAME_PROPERTIES.some((nameProperty: string): boolean => get(instance, nameProperty) === componentName)
    );
};

/**
 * JS falsy values.
 * (excluding `NaN` as it can't be distinguished from `number`)
 */
export type Falsy = false | undefined | null | 0 | '';
