import { Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import {
    SkeletonRectangle as UI,
    SkeletonRectangleProps as UIProps,
    SkeletonRectangleVariant,
    SKELETON_RECTANGLE_CLASSNAME as CLASSNAME,
    SKELETON_RECTANGLE_COMPONENT_NAME as COMPONENT_NAME,
    SKELETON_RECTANGLE_DEFAULT_PROPS as UI_DEFAULT_PROPS,
} from '@lumx/core/js/components/Skeleton';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

export { SkeletonRectangleVariant };

/**
 * Defines the props of the component.
 */
export interface SkeletonRectangleProps extends GenericProps, UIProps {}

const DEFAULT_PROPS: Partial<SkeletonRectangleProps> = UI_DEFAULT_PROPS;

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

    return UI({
        ref,
        aspectRatio,
        className,
        height,
        theme,
        variant,
        width,
        color,
        ...forwardedProps,
    });
});
SkeletonRectangle.displayName = COMPONENT_NAME;
SkeletonRectangle.className = CLASSNAME;
SkeletonRectangle.defaultProps = DEFAULT_PROPS;
