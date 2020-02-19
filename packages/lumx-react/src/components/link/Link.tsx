import React from 'react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import classNames from 'classnames';

import { Color, ColorVariant } from '@lumx/react';
import { IGenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/////////////////////////////

/**
 * Defines the props of the component.
 */

interface ILinkProps extends IGenericProps {
    /** The icon color. */
    color?: Color;

    /** The icon color variant. */
    colorVariant?: ColorVariant;
}
type LinkProps = ILinkProps;

/////////////////////////////

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Link`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<LinkProps> = {};

/////////////////////////////

/**
 * Simple component used to pick a date (semi-controlled implementation).
 *
 * @return The component.
 */
const Link = ({ children, className, color, colorVariant, ...props }: LinkProps) => {
    return (
        <a className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, colorVariant }))} {...props}>
            {children}
        </a>
    );
};
Link.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS, Link, LinkProps };
