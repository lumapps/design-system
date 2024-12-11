import classNames from 'classnames';
import React, { forwardRef } from 'react';

import { GlobalSize, Theme, ColorPalette } from '@lumx/react';
import { Comp, GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

/**
 * Defines the props of the component.
 */
export interface SkeletonCircleProps extends GenericProps, HasTheme {
    /** Size variant. */
    size: GlobalSize;
    /** The color of the skeleton. */
    color?: ColorPalette;
}

const DEFAULT_PROPS: Partial<SkeletonCircleProps> = {};

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SkeletonCircle';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * SkeletonCircle component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SkeletonCircle: Comp<SkeletonCircleProps, HTMLDivElement> = forwardRef((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { className, size, color, theme = defaultTheme, ...forwardedProps } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, size, color, theme }))}
        />
    );
});
SkeletonCircle.displayName = COMPONENT_NAME;
SkeletonCircle.defaultProps = DEFAULT_PROPS;
SkeletonCircle.className = CLASSNAME;
