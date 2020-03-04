import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';

import noop from 'lodash/noop';
import React, { Children, ReactNode } from 'react';
import { ComponentType, GenericProps, getTypeName, isElementOfType, isElementText } from './type';

interface ChildrenManipulationParameters {
    child: ReactNode;
    children: ReactNode;
    childrenCount: number;
    index: number;
    props: GenericProps;
}

type ChildTransformParameters = ChildrenManipulationParameters;
type ChildValidateParameters = ChildrenManipulationParameters;

/**
 * Defines the parameters of the pre/post validate callback of the `validateComponent` function below.
 */
interface ValidateParameters {
    children: ReactNode;
    childrenCount: number;
    props: GenericProps;
}

/**
 * Unwrap the children contained in a fragment.
 *
 * @param children The children to unwrap (there should be only 1 child of React.Fragment type).
 * @return The unwrapped children (or the origin children if it wasn't a fragment).
 */
function unwrapFragment(children: ReactNode): ReactNode {
    let newChildren: ReactNode = children;

    const childrenCount: number = Children.count(children);
    if (childrenCount === 1) {
        const firstChild: ReactNode = Children.toArray(children)[0];

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
 * @param componentName    The name of the component being validated.
 * @param [allowedTypes]   The allowed types of children.
 * @param [maxChildren]    The maximum expected number of children.
 * @param [minChildren=0]  The minimum expected number of children.
 * @param [postValidate]   A function to run after all the transformation and validation
 *                                                        of the children and the props.
 *                                                        This function can return a string (the error message), a
 *                                                        boolean (`true` for a successful validation, `false` for a bad
 *                                                        validation which will lead to throw a basic error message) or
 *                                                        nothing if there is no special problem (i.e. a successful
 *                                                        validation).
 * @param [preValidate]    A function to run before global validation of the props and
 *                                                        any transformation or validation of the children.
 *                                                        This function can return a string (the error message), a
 *                                                        boolean (`true` for a successful validation, `false` for a bad
 *                                                        validation which will lead to throw a basic error message) or
 *                                                        nothing if there is no special problem (i.e. a successful
 *                                                        validation).
 * @param props            The props of the component (should contain a `children` prop).
 * @param [transformChild] A function to transform a child to something else.
 * @param [validateChild]  A function to check if a child is valid after that its type
 *                                                        has been validated (if `allowedTypes` is provided) and after
 *                                                        it has been transformed..
 *                                                        This function can return a string (the error message), a
 *                                                        boolean (`true` for a successful validation, `false` for a bad
 *                                                        validation which will lead to throw a basic error message) or
 *                                                        nothing if there is nothing special (i.e. a successful
 *                                                        validation).
 * @return                 The processed children of the component.
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
        props: GenericProps;
        postValidate?(params: ValidateParameters): string | boolean | void;
        preValidate?(params: ValidateParameters): string | boolean | void;
        transformChild?(params: ChildTransformParameters): ReactNode;
        validateChild?(params: ChildValidateParameters): string | boolean | void;
    },
): ReactNode | undefined {
    let newChildren: ReactNode = !isEmpty(props.children) ? unwrapFragment(props.children) : undefined;
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
        const isTransforming = isFunction(transformChild);
        if (!isTransforming) {
            transformChild = ({ child }) => child;
        }
        validateChild = validateChild || noop;

        let index = -1;
        const transformedChildren = Children.map(
            newChildren,
            (child: ReactNode): ReactNode => {
                index++;

                const newChild: ReactNode = transformChild!({
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
                        let allowedTypesString = '';
                        allowedTypes.forEach((allowedType: string | ComponentType, idx: number) => {
                            if (!isEmpty(allowedTypesString)) {
                                allowedTypesString += idx < allowedTypes.length - 1 ? ', ' : ' or ';
                            }

                            const typeName: string | ComponentType = getTypeName(allowedType);
                            allowedTypesString +=
                                (isString(typeName) ? `${typeName === 'text' ? typeName : `<${typeName}>`}` : '') ||
                                '<Unknown component type>';
                        });

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

        if (isTransforming) {
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

export { validateComponent, ValidateParameters, ChildValidateParameters, ChildTransformParameters };
export { unwrapFragment };
