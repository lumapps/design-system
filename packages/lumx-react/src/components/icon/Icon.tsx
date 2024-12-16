import React from 'react';

import classNames from 'classnames';

import { mdiAlertCircle } from '@lumx/icons';
import { ColorPalette, ColorVariant, Size, Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

export type IconSizes = Extract<Size, 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'>;

/**
 * Defines the props of the component.
 */
export interface IconProps extends GenericProps, HasTheme {
    /** Color variant. */
    color?: ColorPalette;
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
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Icon';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<IconProps> = {};

/**
 * Icon component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Icon = forwardRef<IconProps, HTMLElement>((props, ref) => {
    const defaultTheme = useTheme();
    const {
        className,
        color,
        colorVariant,
        hasShape,
        icon,
        size,
        theme = defaultTheme,
        alt,
        ...forwardedProps
    } = props;

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
            className={classNames(
                className,
                handleBasicClasses({
                    color: iconColor,
                    colorVariant: iconColorVariant,
                    hasShape,
                    prefix: CLASSNAME,
                    theme,
                    size: iconSize,
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
                style={{ verticalAlign: '-0.125em' }}
                viewBox="0 0 24 24"
                width="1em"
            >
                <path d={icon} fill="currentColor" />
            </svg>
        </i>
    );
});
Icon.displayName = COMPONENT_NAME;
Icon.className = CLASSNAME;
Icon.defaultProps = DEFAULT_PROPS;
