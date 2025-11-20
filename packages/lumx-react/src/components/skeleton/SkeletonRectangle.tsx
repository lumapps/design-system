import classNames from 'classnames';

import { AspectRatio, GlobalSize, Theme, ColorPalette } from '@lumx/react';
import { GenericProps, HasTheme, ValueOf } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/core/js/utils/className';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Skeleton variants.
 */
export const SkeletonRectangleVariant = { squared: 'squared', rounded: 'rounded', pill: 'pill' } as const;
export type SkeletonRectangleVariant = ValueOf<typeof SkeletonRectangleVariant>;

/**
 * Defines the props of the component.
 */
export interface SkeletonRectangleProps extends GenericProps, HasTheme {
    /** Aspect ratio (use with width and not height). */
    aspectRatio?: Extract<AspectRatio, 'square' | 'horizontal' | 'vertical' | 'wide'>;
    /** Height size. */
    height?: GlobalSize;
    /** Border variant. */
    variant?: SkeletonRectangleVariant;
    /** Width size. */
    width?: GlobalSize;
    /** The color of the skeleton. */
    color?: ColorPalette;
}

const DEFAULT_PROPS: Partial<SkeletonRectangleProps> = {
    variant: SkeletonRectangleVariant.squared,
};

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SkeletonRectangle';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * SkeletonRectangle component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SkeletonRectangle = forwardRef<SkeletonRectangleProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        aspectRatio,
        className,
        height,
        theme = defaultTheme,
        variant = DEFAULT_PROPS.variant,
        width,
        color,
        ...forwardedProps
    } = props;

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames(
                className,
                handleBasicClasses({
                    prefix: CLASSNAME,
                    aspectRatio,
                    height: aspectRatio ? undefined : height,
                    theme,
                    variant,
                    width,
                    color,
                }),
            )}
        >
            <div className={`${CLASSNAME}__inner`} />
        </div>
    );
});
SkeletonRectangle.displayName = COMPONENT_NAME;
SkeletonRectangle.className = CLASSNAME;
SkeletonRectangle.defaultProps = DEFAULT_PROPS;
