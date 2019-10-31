import React, { ReactElement, ReactNode } from 'react';

import classNames from 'classnames';

import isEmpty from 'lodash/isEmpty';

import { Color, ColorVariant, Size } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, ValidateParameters, getRootClassName, validateComponent } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

type IconSizes = Size.xxs | Size.xs | Size.s | Size.m | Size.l | Size.xl | Size.xxl;

/**
 * Defines the props of the component.
 */
interface IIconProps extends IGenericProps {
    /**
     * The icon SVG path draw code (`d` property of the `<path>` SVG element).
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths}
     */
    icon: string;

    /**
     * Reference on the `<i>` icon HTML element.
     */
    iconRef?: React.RefObject<HTMLElement>;

    /**
     * The icon color.
     */
    color?: Color;

    /**
     * The icon color variant.
     */
    colorVariant?: ColorVariant;

    /**
     * The icon size.
     */
    size?: IconSizes;
}
type IconProps = IIconProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<IconProps> {}

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
const DEFAULT_PROPS: IDefaultPropsType = {
    iconRef: undefined,
};

/////////////////////////////
//                         //
//    Private functions    //
//                         //
/////////////////////////////

/**
 * Globally validate the component before validating the children.
 *
 * @param props The properties of the component.
 */
function _preValidate({ props }: ValidateParameters): void {
    if (!isEmpty(props.icon)) {
        return;
    }

    throw new Error(`<${COMPONENT_NAME}> must have an \`icon\` prop!`);
}

/**
 * Validate the component props.
 *
 * @param       props The props of the component.
 * @return The processed children of the component.
 */
function _validate(props: IconProps): ReactNode {
    return validateComponent(COMPONENT_NAME, {
        preValidate: _preValidate,
        props,
    });
}

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
    icon,
    iconRef = DEFAULT_PROPS.iconRef,
    size,
    ...props
}: IconProps): ReactElement => {
    _validate({ color, icon, size, ...props });

    return (
        <i
            ref={iconRef}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, colorVariant, size }))}
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

export { CLASSNAME, DEFAULT_PROPS, Icon, IconProps };
