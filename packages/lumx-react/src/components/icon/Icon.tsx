import React, { forwardRef } from 'react';

import classNames from 'classnames';

import { Color, ColorPalette, ColorVariant, Size, Theme } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { mdiAlertCircle } from '@lumx/icons';

export type IconSizes = Extract<Size, 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'>;

/**
 * Defines the props of the component.
 */
export interface IconProps extends GenericProps {
    /** Color variant. */
    color?: Color;
    /** Lightened or darkened variant of the selected icon color. */
    colorVariant?: ColorVariant;
    /** Whether the icon has a shape. */
    hasShape?: boolean;
    /**
     * Icon (SVG path).draw code (`d` property of the `<path>` SVG element).
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths}
     */
    icon: string;
    /** Size variant. */
    size?: IconSizes;
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
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
export const Icon: Comp<IconProps, HTMLElement> = forwardRef((props, ref) => {
    const { className, color, colorVariant, hasShape, icon, size, theme, alt, ...forwardedProps } = props;

    let iconColor;
    let iconColorVariant;
    if (color) {
        iconColor = color;
        iconColorVariant = colorVariant;
    } else if (theme) {
        iconColor = theme === Theme.light ? ColorPalette.dark : ColorPalette.light;

        if (colorVariant) {
            iconColorVariant = colorVariant;
        } else {
            iconColorVariant = Theme.light ? 'L1' : 'N';
        }
    } else if (hasShape) {
        iconColor = ColorPalette.dark;
    }

    let iconSize;
    if (size) {
        if (hasShape) {
            if (size === Size.xxs || size === Size.xs) {
                iconSize = Size.s;
            } else if (size === Size.xxl) {
                iconSize = Size.xl;
            } else {
                iconSize = size;
            }
        } else {
            iconSize = size;
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
