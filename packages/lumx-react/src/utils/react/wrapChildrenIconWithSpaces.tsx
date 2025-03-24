import React, { Children } from 'react';
import { isComponentType } from '@lumx/react/utils/type';
import { Icon } from '@lumx/react';

/** Force wrap spaces around icons to make sure they are never stuck against text. */
export function wrapChildrenIconWithSpaces(children: React.ReactNode): React.ReactNode {
    if (children === null || children === undefined) return undefined;
    return Children.toArray(children).flatMap((child) => {
        if (isComponentType(Icon)(child)) {
            return [' ', child, ' '];
        }
        if (
            React.isValidElement(child) &&
            child.props &&
            typeof child.props === 'object' &&
            'children' in child.props
        ) {
            return React.cloneElement(child, undefined, wrapChildrenIconWithSpaces(child.props.children));
        }
        return child;
    });
}
