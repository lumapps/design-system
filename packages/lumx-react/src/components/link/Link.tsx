import React, { Ref } from 'react';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import classNames from 'classnames';

import { Color, ColorVariant } from '@lumx/react';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { renderLink } from '@lumx/react/utils/renderLink';

type HTMLAnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

/**
 * Defines the props of the component.
 */
interface LinkProps extends GenericProps {
    /** The color of the icon. */
    color?: Color;
    /** The degree of lightness and darkness of the selected icon color. */
    colorVariant?: ColorVariant;
    /** Sets a custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** The reference passed to the <a> element. */
    linkRef?: Ref<HTMLAnchorElement>;

    /** Link href. */
    href?: HTMLAnchorProps['href'];

    /** Link target. */
    target?: HTMLAnchorProps['target'];
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Link`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

const Link: React.FC<LinkProps> = ({
    children,
    className,
    color,
    colorVariant,
    linkAs,
    linkRef,
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
