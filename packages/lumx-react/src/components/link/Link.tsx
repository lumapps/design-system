import React, { Ref } from 'react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import classNames from 'classnames';

import { Color, ColorVariant } from '@lumx/react';
import { getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { renderLink } from '@lumx/react/utils/renderLink';

/**
 * Defines the props of the component.
 */
interface LinkProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
    /** The icon color. */
    color?: Color;

    /** The icon color variant. */
    colorVariant?: ColorVariant;

    /** Sets a custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;

    /** Ref to the native HTML anchor element. */
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

/**
 * Link component.
 *
 * @return The component.
 */
const Link: React.FC<LinkProps> = ({
    children,
    className,
    linkAs,
    linkRef,
    color,
    colorVariant,
    ...forwardedProps
}) => {
    return renderLink(
        {
            linkAs,
            ...forwardedProps,
            className: classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, colorVariant })),
            ref: linkRef,
        },
        children,
    );
};
Link.displayName = COMPONENT_NAME;

export { CLASSNAME, COMPONENT_NAME, Link, LinkProps };
