import { Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import {
    SkeletonTypography as UI,
    SkeletonTypographyProps as UIProps,
    SKELETON_TYPOGRAPHY_CLASSNAME as CLASSNAME,
    SKELETON_TYPOGRAPHY_COMPONENT_NAME as COMPONENT_NAME,
} from '@lumx/core/js/components/Skeleton';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

/**
 * Defines the props of the component.
 */
export interface SkeletonTypographyProps extends GenericProps, UIProps {}

const DEFAULT_PROPS: Partial<SkeletonTypographyProps> = {};

/**
 * SkeletonTypography component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const SkeletonTypography = forwardRef<SkeletonTypographyProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { className, theme = defaultTheme, typography, width, color, ...forwardedProps } = props;

    return UI({
        ref,
        className,
        theme,
        typography,
        width,
        color,
        ...forwardedProps,
    });
});
SkeletonTypography.displayName = COMPONENT_NAME;
SkeletonTypography.defaultProps = DEFAULT_PROPS;
SkeletonTypography.className = CLASSNAME;
