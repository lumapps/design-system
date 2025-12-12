import { CSSProperties } from 'react';

import { Theme, TypographyInterface, ColorPalette } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { useClassnames } from '@lumx/react/utils';
import type { LumxClassName } from '@lumx/core/js/types';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

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

const DEFAULT_PROPS: Partial<SkeletonTypographyProps> = {};

/**
 * Component display name.
 */
const COMPONENT_NAME = 'SkeletonTypography';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-skeleton-typography';

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
    const { block, element } = useClassnames(CLASSNAME);

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={block(
                {
                    [`theme-${theme}`]: Boolean(theme),
                    [`typography-${typography}`]: Boolean(typography),
                    [`color-${color}`]: Boolean(color),
                },
                className,
            )}
            style={{ ...forwardedProps.style, width }}
        >
            <div className={element('inner')} />
        </div>
    );
});
SkeletonTypography.displayName = COMPONENT_NAME;
SkeletonTypography.defaultProps = DEFAULT_PROPS;
SkeletonTypography.className = CLASSNAME;
