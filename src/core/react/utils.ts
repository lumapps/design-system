import React, { Children } from 'react';

import get from 'lodash/get';
import has from 'lodash/has';
import isEmpty from 'lodash/isEmpty';
import isString from 'lodash/isString';

/////////////////////////////

type Component = string | React.FC<any> | React.PureComponent<any, any> | React.Component<any, any>;

/////////////////////////////

/**
 * Check if a ReactElement is of the given type.
 *
 * @param  {React.ReactElement} el   The ReactElement we want to check the type of.
 * @param  {string|Component}   type The type we want to check if the ReactElement is of.
 * @return {boolean}            If the ReactElement is of the given type or not.
 */
function isElementOfType(el: React.ReactElement, type: Component): boolean {
    if (!isString(type) && has(type, 'displayName')) {
        type = get(type, 'displayName', get(type, '_reactInternalFiber.elementType.name', 'Component'));
    }

    if (isEmpty(type) && !isString(type)) {
        throw new Error(
            `The type you want to check is not valid. Waiting a component or a string, got ${type.toString()}`,
        );
    }

    if (type === 'text') {
        return isString(el) || el.type === 'span';
    }

    return get(el.type, 'name') === type;
}

/**
 * Check if a ReactElement is a text (i.e. either a pure text node or a <span>).
 * Simply check if the ReactElement is a string or if its type is 'span'.
 *
 * @param  {React.ReactElement} el The ReactElement to check if it's a text.
 * @return {boolean}            If the ReactElement is a text or not.
 */
function isElementText(el: React.ReactElement): boolean {
    return isElementOfType(el, 'text');
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

/////////////////////////////

export { Component, isElementOfType, isElementText, unwrapFragment };
