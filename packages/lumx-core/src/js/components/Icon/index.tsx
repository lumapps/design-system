import { mdiAlertCircle } from '@lumx/icons';

import { handleBasicClasses } from '@lumx/core/js/utils/_internal/className';
import { resolveColorWithVariants } from '@lumx/core/js/utils/_internal/color';
import { classNames } from '../../utils';

import { ColorPalette, Size, Theme, ColorWithVariants, ColorVariant } from '../../constants';
import type { LumxClassName, GenericProps, HasTheme } from '../../types';
import { ICON_SIZES } from './constants';

export const COMPONENT_NAME = 'Icon';
export const IconClassName: LumxClassName<typeof COMPONENT_NAME> = 'lumx-icon';

export type IconSizes = (typeof ICON_SIZES)[number];

/**
 * Defines the props of the component.
 */
export interface IconProps extends GenericProps, HasTheme {
    /** Color variant. */
    color?: ColorWithVariants;
    /** Lightened or darkened variant of the selected icon color. */
    colorVariant?: ColorVariant;
    /** Whether the icon has a shape. */
    hasShape?: boolean;
    /**
     * Icon (SVG path) draw code (`d` property of the `<path>` SVG element).
     * See https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
     */
    icon: string;
    /** Size variant. */
    size?: IconSizes;
    /** Sets an alternative text on the svg. Will set an `img` role to the svg. */
    alt?: string;
    /** Vertical alignment of the icon (only applies for icons nested in Text/Heading). */
    verticalAlign?: null | 'middle';
}

const CLASSNAME = IconClassName;

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<IconProps> = {};

/**
 * Icon component.
 *
 * @param  props Component props.
 */
export const Icon = (props: IconProps) => {
    const {
        className,
        color: propColor,
        colorVariant: propColorVariant,
        hasShape,
        icon,
        size,
        ref,
        theme,
        alt,
        verticalAlign,
        ...forwardedProps
    } = props;

    const [color, colorVariant] = resolveColorWithVariants(propColor, propColorVariant);

    // Color
    let iconColor = color;
    if (!iconColor && (hasShape || theme)) {
        iconColor = theme === Theme.dark ? ColorPalette.light : ColorPalette.dark;
    }

    // Color variant
    let iconColorVariant = colorVariant;
    if (!iconColorVariant && hasShape && iconColor === ColorPalette.dark) {
        iconColorVariant = 'L2';
    }

    // Size
    let iconSize = size;
    if (size && hasShape) {
        if (size === Size.xxs || size === Size.xs) {
            iconSize = Size.s;
        } else if (size === Size.xxl) {
            iconSize = Size.xl;
        }
    } else if (hasShape) {
        iconSize = Size.m;
    }

    return (
        <i
            ref={ref}
            {...forwardedProps}
            className={classNames.join(
                className,
                handleBasicClasses({
                    color: iconColor,
                    colorVariant: iconColorVariant,
                    hasShape,
                    prefix: CLASSNAME,
                    theme,
                    size: iconSize,
                    verticalAlign,
                }),
                !hasShape && `${CLASSNAME}--no-shape`,
                !hasShape &&
                    iconColor === ColorPalette.yellow &&
                    icon === mdiAlertCircle &&
                    `${CLASSNAME}--has-dark-layer`,
                `${CLASSNAME}--path`,
            )}
        >
            <svg
                aria-hidden={alt ? undefined : 'true'}
                role={alt ? 'img' : undefined}
                aria-label={alt}
                height="1em"
                preserveAspectRatio="xMidYMid meet"
                style={{ verticalAlign: verticalAlign ? undefined : '-0.125em' }}
                viewBox="0 0 24 24"
                width="1em"
            >
                <path d={icon} fill="currentColor" />
            </svg>
        </i>
    );
};

Icon.displayName = COMPONENT_NAME;
Icon.className = CLASSNAME;
Icon.defaultProps = DEFAULT_PROPS;
