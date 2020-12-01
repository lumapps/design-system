import classNames from 'classnames';
import React from 'react';

import { Typography } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface SkeletonTypographyProps extends GenericProps {
    /** The typography variant of the component. */
    typography: Typography;
    /** The width of the component. */
    width?: string;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SkeletonTypography`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

const SkeletonTypography: React.FC<SkeletonTypographyProps> = ({ className, typography, width, ...forwardedProps }) => {
    return (
        <div
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, typography }))}
            style={{ width }}
        >
            <div className={`${CLASSNAME}__wrapper`} />
        </div>
    );
};
SkeletonTypography.displayName = COMPONENT_NAME;

export { CLASSNAME, COMPONENT_NAME, SkeletonTypography, SkeletonTypographyProps };
