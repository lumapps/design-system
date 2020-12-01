import classNames from 'classnames';
import React from 'react';

import { Size } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Authorized variants.
 */
enum SkeletonRectangleVariant {
    squared = 'squared',
    rounded = 'rounded',
    pill = 'pill',
}

/**
 * Defines the props of the component.
 */
interface SkeletonRectangleProps extends GenericProps {
    /** The height of the component from Size enum. */
    height: Size;
    /** The variant of the component. */
    variant: SkeletonRectangleVariant;
    /** The width of the component from Size enum. */
    width: Size;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SkeletonRectangle`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

const SkeletonRectangle: React.FC<SkeletonRectangleProps> = ({
    className,
    height,
    variant,
    width,
    ...forwardedProps
}) => {
    return (
        <div
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, height, variant, width }))}
        />
    );
};
SkeletonRectangle.displayName = COMPONENT_NAME;

export { CLASSNAME, COMPONENT_NAME, SkeletonRectangle, SkeletonRectangleProps, SkeletonRectangleVariant };
