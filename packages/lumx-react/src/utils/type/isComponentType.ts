import React, { ReactElement, ReactNode } from 'react';

/**
 * Similar to `isComponent` but more precise as it's not based on the component `displayName` but on the component function reference.
 */
export const isComponentType =
    (type: ReactElement['type']) =>
    (node: ReactNode): node is ReactElement =>
        React.isValidElement(node) && node.type === type;
