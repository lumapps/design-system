import React, { Children } from 'react';

import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import kebabCase from 'lodash/kebabCase';
import noop from 'lodash/noop';
import trimStart from 'lodash/trimStart';

import { CSS_PREFIX } from '../constants';

import { COMPONENT_PREFIX } from './constants';

/////////////////////////////
//                         //
//    Private attributes   //
//                         //
/////////////////////////////

/**
 * The properties of a component to use to determine it's name.
 * In the order of preference.
 *
 * @type {Array<string>}
 * @constant
 * @readonly
 */
const NAME_PROPERTIES: string[] = ['displayName', 'name', 'type', 'type.name', '_reactInternalFiber.elementType.name'];

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
type ComponentType = React.ReactNode | React.FC<any> | React.PureComponent<any, any> | React.Component<any, any>;
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface IChildrenManipulationParameters {
    child: React.ReactNode;
    children: React.ReactNode;
    childrenCount: number;
    index: number;
    props: IGenericProps;
}
type ChildTransformParameters = IChildrenManipulationParameters;
type ChildValidateParameters = IChildrenManipulationParameters;

/**
 * Defines the parameters of the pre/post validate callback of the `validateComponent` function below.
 */
interface IValidateParameters {
    children: React.ReactNode;
    childrenCount: number;
    props: IGenericProps;
}
type ValidateParameters = IValidateParameters;

/////////////////////////////
//                         //
//     Public functions    //
//                         //
/////////////////////////////

/**
 * Get the name of the root CSS class of a component based on its name.
 *
 * @param {string}  componentName The name of the component. This name should contains the component prefix and be
 *                               written in PascalCase.
 * @param {boolean} subComponent Whether the current component is a sub component, if true, define the class according
 *                               to BEM standards.
 * @return {string} The name of the root CSS class. This classname include the CSS classname prefix and is written in
 *                  lower-snake-case.
 */
function getRootClassName(componentName: string, subComponent?: boolean): string {
    const formattedClassName: string = `${CSS_PREFIX}-${kebabCase(trimStart(componentName, COMPONENT_PREFIX))}`;

    if (subComponent) {
        // See https://regex101.com/r/YjS1uI/3
        const lastPieceOfClassNameRegExp: RegExp = /^(.*)-(.+)$/gi;

        return formattedClassName.replace(lastPieceOfClassNameRegExp, '$1__$2');
    }

    return formattedClassName;
}

/**
 * Get the name of the given type.
 * The type can either be a string ('Button', 'span', ...) or a component whose name will be computed from its
 * `displayName`, its React internal name (`_reactInternalFiber.elementType.name`) or its `name`.
 *
 * @param  {string|ComponentType} type The type to get the name of.
 * @return {string|ComponentType} The name of the type.
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
 * @param  {React.ReactNode}   el   The ReactElement we want to check the type of.
 * @param  {string|ComponentType} type The type we want to check if the ReactElement is of.
 * @return {boolean}              If the ReactElement is of the given type or not.
 */
function isElementOfType(el: React.ReactNode, type: string | ComponentType): boolean {
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
 * @param  {React.ReactNode} el The ReactElement to check if it's a text.
 * @return {boolean}            If the ReactElement is a text or not.
 */
function isElementText(el: React.ReactNode): boolean {
    return isString(el);
}

/**
 * Unwrap the children contained in a fragment.
 *
 * @param  {React.ReactNode} children The children to unwrap (there should be only 1 child of React.Fragment type).
 * @return {React.reactNode} The unwrapped children (or the origin children if it wasn't a fragment).
 */
function unwrapFragment(children: React.ReactNode): React.ReactNode {
    let newChildren: React.ReactNode = children;

    const childrenCount: number = Children.count(children);
    if (childrenCount === 1) {
        const firstChild: React.ReactNode = Children.toArray(children)[0];

        if (get(firstChild, 'type') === React.Fragment) {
            newChildren = get(firstChild, 'props.children', []);
        }
    }

    return newChildren;
}

/**
 * Validate the component props and children.
 * Also, sanitize, cleanup and format the children and return the processed ones.
 *
 * @param  {string}                      componentName    The name of the component being validated.
 * @param  {Array<string|ComponentType>} [allowedTypes]   The allowed types of children.
 * @param  {number}                      [maxChildren]    The maximum expected number of children.
 * @param  {number}                      [minChildren=0]  The minimum expected number of children.
 * @param  {Function}                    [postValidate]   A function to run after all the transformation and validation
 *                                                        of the children and the props.
 *                                                        This function can return a string (the error message), a
 *                                                        boolean (`true` for a successful validation, `false` for a bad
 *                                                        validation which will lead to throw a basic error message) or
 *                                                        nothing if there is no special problem (i.e. a successful
 *                                                        validation).
 * @param  {Function}                    [preValidate]    A function to run before global validation of the props and
 *                                                        any transformation or validation of the children.
 *                                                        This function can return a string (the error message), a
 *                                                        boolean (`true` for a successful validation, `false` for a bad
 *                                                        validation which will lead to throw a basic error message) or
 *                                                        nothing if there is no special problem (i.e. a successful
 *                                                        validation).
 * @param  {IGenericProps}               props            The props of the component (should contain a `children` prop).
 * @param  {Function}                    [transformChild] A function to transform a child to something else.
 * @param  {Function}                    [validateChild]  A function to check if a child is valid after that its type
 *                                                        has been validated (if `allowedTypes` is provided) and after
 *                                                        it has been transformed..
 *                                                        This function can return a string (the error message), a
 *                                                        boolean (`true` for a successful validation, `false` for a bad
 *                                                        validation which will lead to throw a basic error message) or
 *                                                        nothing if there is nothing special (i.e. a successful
 *                                                        validation).
 * @return {React.ReactNode}             The processed children of the component.
 */
function validateComponent(
    componentName: string,
    {
        allowedTypes = [],
        maxChildren,
        minChildren = 0,
        props,
        postValidate = noop,
        preValidate = noop,
        transformChild,
        validateChild,
    }: {
        allowedTypes?: Array<string | ComponentType>;
        maxChildren?: number;
        minChildren?: number;
        props: IGenericProps;
        postValidate?(params: ValidateParameters): string | boolean | void;
        preValidate?(params: ValidateParameters): string | boolean | void;
        transformChild?(params: ChildTransformParameters): React.ReactNode;
        validateChild?(params: ChildValidateParameters): string | boolean | void;
    },
): React.ReactNode | undefined {
    let newChildren: React.ReactNode = !isEmpty(props.children) ? unwrapFragment(props.children) : undefined;
    const childrenCount: number = Children.count(newChildren);

    const preValidation: string | boolean | void = preValidate({ children: newChildren, childrenCount, props });
    if (isString(preValidation) || (isBoolean(preValidation) && !preValidation)) {
        throw new Error(
            `Pre-validation of <${componentName}> failed${isString(preValidation) ? `: '${preValidation}'` : ''}.`,
        );
    }

    if (minChildren !== 0) {
        if (maxChildren === minChildren && childrenCount !== minChildren) {
            throw new Error(
                `<${componentName}> must have exactly ${minChildren} ${
                    minChildren === 1 ? 'child' : 'children'
                } (got ${childrenCount})!`,
            );
        }

        if (childrenCount < minChildren) {
            throw new Error(
                `<${componentName}> must have at least ${minChildren} ${
                    minChildren <= 1 ? 'child' : 'children'
                } (got ${childrenCount})!`,
            );
        }
    } else if (maxChildren === minChildren && childrenCount > minChildren) {
        throw new Error(`<${componentName}> shouldn't have any child (got ${childrenCount})!`);
    }

    if (maxChildren !== undefined && maxChildren !== minChildren && childrenCount > maxChildren) {
        throw new Error(
            `<${componentName}> cannot have more than ${maxChildren} ${
                maxChildren === 1 ? 'child' : 'children'
            } (got ${childrenCount})!`,
        );
    }

    if (isFunction(transformChild) || isFunction(validateChild) || !isEmpty(allowedTypes)) {
        const childrenFunctionName: string = isFunction(transformChild) ? 'map' : 'forEach';

        if (!isFunction(transformChild)) {
            transformChild = ({ child }: ChildTransformParameters): React.ReactNode => child;
        }
        validateChild = validateChild || noop;

        let index: number = -1;
        const transformedChildren: React.ReactNode = Children[childrenFunctionName](
            newChildren,
            (child: React.ReactNode): React.ReactNode => {
                index++;

                const newChild: React.ReactNode = transformChild!({
                    child,
                    children: newChildren,
                    childrenCount,
                    index,
                    props,
                });
                const childDisplayName: string = isString(newChild) ? `'${newChild}'` : `<${getTypeName(newChild)}>`;

                if (!isEmpty(allowedTypes)) {
                    const isOfOneAllowedType: boolean = allowedTypes.some(
                        (allowedType: string | ComponentType) =>
                            isEmpty(newChild) ||
                            (allowedType === 'text'
                                ? isElementText(newChild)
                                : isElementOfType(newChild, allowedType) || isEmpty(newChild)),
                    );

                    if (!isOfOneAllowedType) {
                        let allowedTypesString: string = '';
                        allowedTypes.forEach(
                            (allowedType: string | ComponentType, idx: number): void => {
                                if (!isEmpty(allowedTypesString)) {
                                    allowedTypesString += idx < allowedTypes.length - 1 ? ', ' : ' or ';
                                }

                                const typeName: string | ComponentType = getTypeName(allowedType);
                                allowedTypesString +=
                                    (isString(typeName) ? `${typeName === 'text' ? typeName : `<${typeName}>`}` : '') ||
                                    '<Unknown component type>';
                            },
                        );

                        console.debug('Non matching type', newChild, '\nResulted in', getTypeName(newChild));
                        throw new Error(
                            `You can only have ${allowedTypesString} children in <${componentName}> (got ${childDisplayName})!`,
                        );
                    }
                }

                const childValidation: string | boolean | void = validateChild!({
                    child: newChild,
                    children: newChildren,
                    childrenCount,
                    index,
                    props,
                });
                if (isString(childValidation) || (isBoolean(childValidation) && !childValidation)) {
                    throw new Error(
                        `Child validation of ${childDisplayName} in ${componentName} failed${
                            isString(childValidation) ? `: ${childValidation}` : ''
                        }'.`,
                    );
                }

                return newChild;
            },
        );

        if (childrenFunctionName === 'map') {
            newChildren = transformedChildren;
        }
    }

    const postValidation: string | boolean | void = postValidate({ children: newChildren, childrenCount, props });
    if (isString(postValidation) || (isBoolean(postValidation) && !postValidation)) {
        throw new Error(
            `Post-validation of ${componentName} failed${isString(postValidation) ? `: ${postValidation}` : ''}.`,
        );
    }

    return newChildren;
}

/////////////////////////////

export {
    ChildTransformParameters,
    ChildValidateParameters,
    ComponentType,
    IGenericProps,
    Omit,
    ValidateParameters,
    getRootClassName,
    getTypeName,
    isElementOfType,
    isElementText,
    unwrapFragment,
    validateComponent,
};
