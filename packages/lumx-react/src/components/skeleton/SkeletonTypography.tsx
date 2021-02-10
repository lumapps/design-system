import classNames from 'classnames';
import React, { CSSProperties, forwardRef } from 'react';

import { Theme, Typography } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
export interface SkeletonTypographyProps extends GenericProps {
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Typography variant. */
    typography: Typography;
    /** Width CSS property. */
    width?: CSSProperties['width'];
}

const DEFAULT_PROPS: Partial<SkeletonTypographyProps> = {
    theme: Theme.light,
};

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SkeletonTypography';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * SkeletonTypography component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SkeletonTypography: Comp<SkeletonTypographyProps, HTMLDivElement> = forwardRef((props, ref) => {
    const { className, theme, typography, width, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, typography }))}
            style={{ ...forwardedProps.style, width }}
        >
            <div className={`${CLASSNAME}__inner`} />
        </div>
    );
});
SkeletonTypography.displayName = COMPONENT_NAME;
SkeletonTypography.defaultProps = DEFAULT_PROPS;
SkeletonTypography.className = CLASSNAME;
