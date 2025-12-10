import { GlobalSize, Theme, ColorPalette } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { useClassnames } from '@lumx/react/utils';
import type { LumxClassName } from '@lumx/core/js/types';
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
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-skeleton-circle';

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
    const { block } = useClassnames(CLASSNAME);

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={block(
                {
                    [`size-${size}`]: Boolean(size),
                    [`color-${color}`]: Boolean(color),
                    [`theme-${theme}`]: Boolean(theme),
                },
                className,
            )}
        />
    );
});
SkeletonCircle.displayName = COMPONENT_NAME;
SkeletonCircle.defaultProps = DEFAULT_PROPS;
SkeletonCircle.className = CLASSNAME;
