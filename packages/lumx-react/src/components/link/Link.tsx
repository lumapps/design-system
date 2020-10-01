import React, { Ref } from 'react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import classNames from 'classnames';

import { Color, ColorVariant } from '@lumx/react';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils';

/**
 * Defines the props of the component.
 */
interface LinkProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    /** The color of the icon. */
    color?: Color;
    /** The degree of lightness and darkness of the selected icon color. */
    colorVariant?: ColorVariant;
    /** The reference passed to the <a> element. */
    linkRef?: Ref<HTMLAnchorElement>;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Link`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

const Link: React.FC<LinkProps> = ({ children, className, color, colorVariant, linkRef, ...forwardedProps }) => (
    <a
        {...forwardedProps}
        className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, colorVariant }))}
        ref={linkRef}
    >
        {children}
    </a>
);
Link.displayName = COMPONENT_NAME;

export { CLASSNAME, COMPONENT_NAME, Link, LinkProps };
