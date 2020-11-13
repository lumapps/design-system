import React from 'react';

import classNames from 'classnames';

import { Color, ColorPalette, ColorVariant, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, ValueOf, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

type IconSizes = Size.xxs | Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/**
 * Defines the props of the component.
 */
interface IconProps extends GenericProps {
    /** The color of the icon. */
    color?: Color;
    /** The degree of lightness and darkness of the selected icon color. */
    colorVariant?: ValueOf<ColorVariant>;
    /** Whether the icon has a shape. */
    hasShape?: boolean;
    /**
     * The icon SVG path draw code (`d` property of the `<path>` SVG element).
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths}
     */
    icon: string;
    /** The reference passed to the <i> element. */
    iconRef?: React.RefObject<HTMLElement>;
    /** The size variant of the component. */
    size?: ValueOf<IconSizes>;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: ValueOf<Theme>;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Icon`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<IconProps> = {};

const Icon: React.FC<IconProps> = ({
    className,
    color,
    colorVariant,
    hasShape,
    icon,
    iconRef,
    size,
    theme,
    ...forwardedProps
}) => {
    let iconColor;
    if (color) {
        iconColor = color;
    } else if (theme) {
        iconColor = theme === Theme.light ? ColorPalette.dark : ColorPalette.light;
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
            {...forwardedProps}
            ref={iconRef}
            className={classNames(
                className,
                handleBasicClasses({
                    color: iconColor,
                    colorVariant,
                    hasShape,
                    prefix: CLASSNAME,
                    size: iconSize,
                }),
                !hasShape && `${CLASSNAME}--no-shape`,
            )}
        >
            <svg
                aria-hidden="true"
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
};
Icon.displayName = COMPONENT_NAME;
Icon.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Icon, IconProps, IconSizes };
