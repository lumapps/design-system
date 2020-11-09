import React, { Ref } from 'react';

import isEmpty from 'lodash/isEmpty';

import { COMPONENT_PREFIX } from '@lumx/react/constants';
import classNames from 'classnames';

import { Color, ColorVariant, Typography } from '@lumx/react';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { renderLink } from '@lumx/react/utils/renderLink';

type HTMLAnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

/**
 * Defines the props of the component.
 */
interface LinkProps extends GenericProps {
    /** The color of the link. */
    color?: Color;
    /** The degree of lightness and darkness of the selected link color. */
    colorVariant?: ColorVariant;
    /** Link href. */
    href?: HTMLAnchorProps['href'];
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Sets a custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** The reference passed to the <a> element. */
    linkRef?: Ref<HTMLAnchorElement>;
    /** Link target. */
    target?: HTMLAnchorProps['target'];
    /** The typography of the link. */
    typography?: Typography;
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
    disabled,
    isDisabled = disabled,
    href,
    linkAs,
    linkRef,
    target,
    typography,
    ...forwardedProps
}) => {
    /**
     * If there is no linkAs prop and no href, we returned a <button> instead of a <a>.
     * If the component is disabled, we also returned a <button> since disabled is not compatible with <a>.
     */
    if ((!linkAs && isEmpty(href)) || isDisabled) {
        return (
            <button
                {...forwardedProps}
                disabled={isDisabled}
                ref={linkRef as any}
                className={classNames(
                    className,
                    handleBasicClasses({ prefix: CLASSNAME, color, colorVariant }),
                    { [`lumx-typography-${typography}`]: typography },
                )}
            >
                {children}
            </button>
        );
    }
    return renderLink(
        {
            linkAs,
            ...forwardedProps,
            href,
            target,
            className: classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, color, colorVariant }),
                { [`lumx-typography-${typography}`]: typography },
            ),
            ref: linkRef,
        },
        children,
    );
};
Link.displayName = COMPONENT_NAME;

export { CLASSNAME, COMPONENT_NAME, Link, LinkProps };
