import React from 'react';

import classNames from 'classnames';

import { Color, ColorPalette, ColorVariant, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

type IconSizes = Size.xxs | Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/**
 * Defines the props of the component.
 */
interface IconProps extends GenericProps {
    /**
     * The icon SVG path draw code (`d` property of the `<path>` SVG element).
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths}
     */
    icon: string;

    /** Reference on the `<i>` icon HTML element. */
    iconRef?: React.RefObject<HTMLElement>;

    /** The icon color. */
    color?: Color;

    /** Whether the icon has shape. */
    hasShape?: boolean;

    /** The icon color variant. */
    colorVariant?: ColorVariant;

    /** The icon size. */
    size?: IconSizes;

    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
}

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<IconProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: DefaultPropsType = {
    color: ColorPalette.dark,
    iconRef: undefined,
    size: Size.m,
};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Displays an icon in the form of a HTML <svg> tag with the wanted icon path.
 *
 * @return The component
 */
const Icon: React.FC<IconProps> = ({
    className,
    color,
    colorVariant,
    hasShape,
    icon,
    iconRef = DEFAULT_PROPS.iconRef,
    size,
    theme,
    ...props
}) => {
    let iconColor;
    if (color) {
        iconColor = color;
    } else if (theme) {
        iconColor = theme === Theme.light ? ColorPalette.dark : ColorPalette.light;
    } else if (hasShape) {
        iconColor = DEFAULT_PROPS.color;
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
        iconSize = DEFAULT_PROPS.size;
    }

    return (
        <i
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
            {...props}
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

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Icon, IconProps, IconSizes };
