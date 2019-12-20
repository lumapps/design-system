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

/**
 * Define a generic props types.
 */
interface IGenericProps {
    /**
     * Any prop (particularly any supported prop for a HTML element).
     * E.g. classNames, onClick, disabled, ...
     */
    // tslint:disable-next-line: no-any
    [propName: string]: any;
}

/**
 * Defines a generic component type.
 */
// tslint:disable-next-line: no-any
type ComponentType = ReactNode | React.FC<any> | React.PureComponent<any, any> | React.Component<any, any>;
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Get the name of the given type.
 * The type can either be a string ('Button', 'span', ...) or a component whose name will be computed from its
 * `displayName`, its React internal name (`_reactInternalFiber.elementType.name`) or its `name`.
 *
 * @param type The type to get the name of.
 * @return The name of the type.
 */
function getTypeName(type: string | ComponentType): string | ComponentType {
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
function isElementOfType(el: ReactNode, type: string | ComponentType): boolean {
    const typeName: string | ComponentType = getTypeName(type);

    if (!isString(typeName) || isEmpty(typeName)) {
        console.debug('Un-computable type', type, '\nResulted in', typeName);
        throw new Error(
            `The type you want to check is not valid. Waiting a JSX element, a component or a string (got \`${type!.toString()}\`)`,
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
function isElementText(el: ReactNode): boolean {
    return isString(el);
}

/**
 * Callback function type alias (use for readability)
 */
type Callback = () => void;
type Predicate<T> = (t: T) => boolean;

/**
 * Create a predicate function that checks if a ReactNode is a react element from the given component.
 *
 * @param  component React function component or the component name
 * @return predicate returning true if value is instance of the component
 */
const isComponent = <C>(component: React.FC<C> | string) => (instance: ReactNode): instance is ReactElement => {
    const componentName = typeof component === 'string' ? component : component.displayName;

    return (
        get(instance, '$$typeof') === Symbol.for('react.element') &&
        NAME_PROPERTIES.some((nameProperty: string): boolean => get(instance, nameProperty) === componentName)
    );
};

export {
    isComponent,
    Predicate,
    Callback,
    isElementText,
    isElementOfType,
    getTypeName,
    Omit,
    ComponentType,
    IGenericProps,
};
