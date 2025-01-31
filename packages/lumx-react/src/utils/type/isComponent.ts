import type { ReactElement, ReactNode } from 'react';
import get from 'lodash/get';
import type { Comp } from './Comp';

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
