import classNames from 'classnames';
import React, { CSSProperties, forwardRef } from 'react';

import { Theme, TypographyInterface, ColorPalette } from '@lumx/react';
import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';

/**
 * Defines the props of the component.
 */
export interface SkeletonTypographyProps extends GenericProps, HasTheme {
    /** Typography variant. */
    typography: TypographyInterface;
    /** Width CSS property. */
    width?: CSSProperties['width'];
    /** The color of the skeleton. */
    color?: ColorPalette;
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
    const { className, theme, typography, width, color, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, theme, typography, color }))}
            style={{ ...forwardedProps.style, width }}
        >
            <div className={`${CLASSNAME}__inner`} />
        </div>
    );
});
SkeletonTypography.displayName = COMPONENT_NAME;
SkeletonTypography.defaultProps = DEFAULT_PROPS;
SkeletonTypography.className = CLASSNAME;
