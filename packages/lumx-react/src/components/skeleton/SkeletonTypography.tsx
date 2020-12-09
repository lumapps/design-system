import classNames from 'classnames';
import React, { CSSProperties } from 'react';

import { Theme, Typography } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface SkeletonTypographyProps extends GenericProps {
    /** Theme. */
    theme?: Theme;
    /** The typography variant of the component. */
    typography: Typography;
    /** The width of the component (CSS width property). */
    width?: CSSProperties['width'];
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}SkeletonTypography`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

const SkeletonTypography: React.FC<SkeletonTypographyProps> = ({
    className,
    theme,
    typography,
    width,
    ...forwardedProps
}) => {
    return (
        <div
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, typography }))}
            style={{ ...forwardedProps.style, width }}
        >
            <div className={`${CLASSNAME}__inner`} />
        </div>
    );
};
SkeletonTypography.displayName = COMPONENT_NAME;

export { CLASSNAME, COMPONENT_NAME, SkeletonTypography, SkeletonTypographyProps };
