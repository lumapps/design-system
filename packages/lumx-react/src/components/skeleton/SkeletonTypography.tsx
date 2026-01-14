import { CSSProperties } from 'react';

import { Theme, TypographyInterface, ColorPalette } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import type { LumxClassName } from '@lumx/core/js/types';
import { classNames } from '@lumx/core/js/utils';
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
const { block, element } = classNames.bem(CLASSNAME);

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

    return (
        <div
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                block({
                    [`theme-${theme}`]: Boolean(theme),
                    [`typography-${typography}`]: Boolean(typography),
                    [`color-${color}`]: Boolean(color),
                }),
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
