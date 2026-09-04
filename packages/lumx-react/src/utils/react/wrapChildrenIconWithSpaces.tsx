import React, { Children } from 'react';
import { isComponentType } from '@lumx/react/utils/type';
import { Icon } from '@lumx/react/components/icon';

/**
 * Recursively wrap icons with spaces.
 *
 * `isFirst`/`isLast` tell whether the given children are at the very start/end of the whole
 * children tree, so that an icon on an edge is detected even when nested in a fragment or element.
 */
function wrap(children: React.ReactNode, isFirst: boolean, isLast: boolean): React.ReactNode {
    if (children === null || children === undefined) return undefined;
    const childArray = Children.toArray(children);
    return childArray.flatMap((child, index) => {
        const childIsFirst = isFirst && index === 0;
        const childIsLast = isLast && index === childArray.length - 1;

        if (isComponentType(Icon)(child)) {
            // No space on the edges of the text: the icon is not stuck against anything there.
            return [...(childIsFirst ? [] : [' ']), child, ...(childIsLast ? [] : [' '])];
        }
        if (
            React.isValidElement(child) &&
            child.props &&
            typeof child.props === 'object' &&
            'children' in child.props
        ) {
            return React.cloneElement(
                child,
                undefined,
                wrap(child.props.children as React.ReactNode, childIsFirst, childIsLast),
            );
        }
        return child;
    });
}

/**
 * Force wrap spaces around icons to make sure they are never stuck against text.
 * Icons at the very start or end of the text are not padded on that side.
 */
export function wrapChildrenIconWithSpaces(children: React.ReactNode): React.ReactNode {
    return wrap(children, true, true);
}
