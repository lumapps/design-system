import classNames from 'classnames';

import { GlobalSize, Theme, ColorPalette } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/core/js/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

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
export const SkeletonCircle = forwardRef<SkeletonCircleProps, HTMLDivElement>((props, ref) => {
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
