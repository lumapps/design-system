import get from 'lodash/get';
import React, { ReactElement, ReactNode } from 'react';

/**
 * The properties of a component to use to determine it's name.
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
 * Predicate function type.
 */
export type Predicate<T> = (t: T) => boolean;

/**
 * Create a predicate function that checks if a ReactNode is a react element from the given component.
 *
 * @param  component React function component or the component name
 * @return predicate returning true if value is instance of the component
 */
export const isComponent = <C>(component: React.FC<C> | string) => (instance: ReactNode): instance is ReactElement => {
    const componentName = typeof component === 'string' ? component : component.displayName;

    return (
        get(instance, '$$typeof') === Symbol.for('react.element') &&
        NAME_PROPERTIES.some((nameProperty: string): boolean => get(instance, nameProperty) === componentName)
    );
};
