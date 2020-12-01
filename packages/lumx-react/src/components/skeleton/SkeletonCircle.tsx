import classNames from 'classnames';
import React from 'react';

import { Size } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface SkeletonCircleProps extends GenericProps {
    /** The size variant of the component. */
    size: Size;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SkeletonCircle`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

const SkeletonCircle: React.FC<SkeletonCircleProps> = ({ className, size, ...forwardedProps }) => {
    return (
        <div {...forwardedProps} className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, size }))} />
    );
};
SkeletonCircle.displayName = COMPONENT_NAME;

export { CLASSNAME, COMPONENT_NAME, SkeletonCircle, SkeletonCircleProps };
