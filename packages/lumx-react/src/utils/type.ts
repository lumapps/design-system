import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';
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

/** LumX Component Type. */
export type Comp<P> = React.FC<P> & {
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
 * Defines a generic component type.
 */
export type ComponentType = ReactNode | Comp<any> | React.PureComponent<any, any> | React.Component<any, any>;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Get the name of the given type.
 * The type can either be a string ('Button', 'span', ...) or a component whose name will be computed from its
 * `displayName`, its React internal name (`_reactInternalFiber.elementType.name`) or its `name`.
 *
 * @param type The type to get the name of.
 * @return The name of the type.
 */
export function getTypeName(type: string | ComponentType): string | ComponentType {
    if (isString(type)) {
        return type;
    }

    for (const nameProperty of NAME_PROPERTIES) {
        const typeName: string | undefined = get(type, nameProperty);

        if (typeName !== undefined && isString(typeName) && !isEmpty(typeName)) {
            return typeName;
        }
    }

    return type;
}

/**
 * Check if a ReactElement is of the given type.
 *
 * @param el   The ReactElement we want to check the type of.
 * @param type The type we want to check if the ReactElement is of.
 * @return     If the ReactElement is of the given type or not.
 */
export function isElementOfType(el: ReactNode, type: string | ComponentType): boolean {
    const typeName: string | ComponentType = getTypeName(type);

    if (!isString(typeName) || isEmpty(typeName)) {
        throw new Error(
            `Un-computable type ${type}, resulted in ${typeName}
The type you want to check is not valid. Waiting a JSX element, a component or a string (got \`${type?.toString()}\`)`,
        );
    }

    for (const nameProperty of NAME_PROPERTIES) {
        const elementTypeName: string | undefined = get(el, nameProperty);

        if (
            elementTypeName !== undefined &&
            isString(elementTypeName) &&
            !isEmpty(elementTypeName) &&
            elementTypeName === typeName
        ) {
            return true;
        }
    }
    return false;
}

/**
 * Check if a ReactElement is a text (i.e. either a pure text node or a <span>).
 * Simply check if the ReactElement is a string or if its type is 'span'.
 *
 * @param el The ReactElement to check if it's a text.
 * @return   If the ReactElement is a text or not.
 */
export function isElementText(el: ReactNode): boolean {
    return isString(el);
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
export const isComponent = <C>(component: Comp<C> | string) => (instance: ReactNode): instance is ReactElement => {
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
