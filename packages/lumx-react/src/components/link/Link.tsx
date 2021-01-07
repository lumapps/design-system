import React, { forwardRef, RefObject, useMemo } from 'react';

import isEmpty from 'lodash/isEmpty';

import classNames from 'classnames';

import { Color, ColorVariant, Icon, Size, Typography } from '@lumx/react';
import { Comp, GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';
import { renderLink } from '@lumx/react/utils/renderLink';

type HTMLAnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

/**
 * Defines the props of the component.
 */
export interface LinkProps extends GenericProps {
    /** Color variant. */
    color?: Color;
    /** Lightened or darkened variant of the selected icon color. */
    colorVariant?: ColorVariant;
    /** Link href. */
    href?: HTMLAnchorProps['href'];
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Left icon (SVG path). */
    leftIcon?: string;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** Right icon (SVG path). */
    rightIcon?: string;
    /** Link target. */
    target?: HTMLAnchorProps['target'];
    /** Typography variant. */
    typography?: Typography;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Link';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

const getIconSize = (typography?: Typography) => {
    switch (typography) {
        case Typography.display1:
            return Size.m;

        case Typography.headline:
        case Typography.title:
        case Typography.body2:
        case Typography.subtitle2:
            return Size.s;

        case Typography.body1:
        case Typography.subtitle1:
            return Size.xs;

        case Typography.caption:
        case Typography.overline:
            return Size.xxs;

        default:
            return Size.s;
    }
};

/**
 * Link component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Link: Comp<LinkProps, HTMLAnchorElement | HTMLButtonElement> = forwardRef((props, ref) => {
    const {
        children,
        className,
        color,
        colorVariant,
        disabled,
        isDisabled = disabled,
        href,
        leftIcon,
        linkAs,
        rightIcon,
        target,
        typography,
        ...forwardedProps
    } = props;
    const renderedChildren = useMemo(
        () => (
            <>
                {leftIcon && !isEmpty(leftIcon) && (
                    <Icon icon={leftIcon} className={`${CLASSNAME}__left-icon`} size={getIconSize(typography)} />
                )}

                {children && (
                    <span
                        className={classNames(`${CLASSNAME}__content`, {
                            [`lumx-typography-${typography}`]: typography,
                        })}
                    >
                        {children}
                    </span>
                )}

                {rightIcon && !isEmpty(rightIcon) && (
                    <Icon icon={rightIcon} className={`${CLASSNAME}__right-icon`} size={getIconSize(typography)} />
                )}
            </>
        ),
        [leftIcon, typography, children, rightIcon],
    );

    /**
     * If there is no linkAs prop and no href, we returned a <button> instead of a <a>.
     * If the component is disabled, we also returned a <button> since disabled is not compatible with <a>.
     */
    if ((!linkAs && isEmpty(href)) || isDisabled) {
        return (
            <button
                type="button"
                {...forwardedProps}
                ref={ref as RefObject<HTMLButtonElement>}
                disabled={isDisabled}
                className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, colorVariant }))}
            >
                {renderedChildren}
            </button>
        );
    }
    return renderLink(
        {
            linkAs,
            ...forwardedProps,
            href,
            target,
            className: classNames(className, handleBasicClasses({ prefix: CLASSNAME, color, colorVariant })),
            ref: ref as RefObject<HTMLAnchorElement>,
        },
        renderedChildren,
    );
});
Link.displayName = COMPONENT_NAME;
Link.className = CLASSNAME;
