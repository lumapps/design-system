import type { CSSProperties } from 'react';
import type { LumxClassName, HasTheme, HasClassName, CommonRef } from '../../types';
import { classNames } from '../../utils';
import type { ColorPalette, TypographyInterface } from '../../constants';

/**
 * Defines the props of the component.
 */
export interface SkeletonTypographyProps extends HasTheme, HasClassName {
    /** Typography variant. */
    typography: TypographyInterface;
    /** Width CSS property. */
    width?: CSSProperties['width'];
    /** The color of the skeleton. */
    color?: ColorPalette;
    /** Reference to the root element. */
    ref?: CommonRef;
    /** Style object. */
    style?: CSSProperties;
}

/**
 * Component display name.
 */
export const COMPONENT_NAME = 'SkeletonTypography';

/**
 * Component default class name and class prefix.
 */
export const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-skeleton-typography';
const { block, element } = classNames.bem(CLASSNAME);

/**
 * Component default props.
 */
export const DEFAULT_PROPS: Partial<SkeletonTypographyProps> = {};

/**
 * SkeletonTypography component.
 *
 * @param  props Component props.
 * @return JSX element.
 */
export const SkeletonTypography = (props: SkeletonTypographyProps) => {
    const { className, theme, typography, width, color, ref, ...forwardedProps } = props;

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
};
