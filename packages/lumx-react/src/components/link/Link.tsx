import React from 'react';

import classNames from 'classnames';

import { ColorVariant, ColorWithVariants, Icon, Typography } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import {
    getRootClassName,
    getTypographyClassName,
    handleBasicClasses,
    resolveColorWithVariants,
} from '@lumx/react/utils/className';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { wrapChildrenIconWithSpaces } from '@lumx/react/utils/react/wrapChildrenIconWithSpaces';

type HTMLAnchorProps = React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

/**
 * Defines the props of the component.
 */
export interface LinkProps extends GenericProps {
    /** Color variant. */
    color?: ColorWithVariants;
    /** Lightened or darkened variant of the selected icon color. */
    colorVariant?: ColorVariant;
    /** Link href. */
    href?: HTMLAnchorProps['href'];
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /**
     * Left icon (SVG path).
     * @deprecated Instead, simply nest `<Icon />` in the children
     */
    leftIcon?: string;
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /**
     * Right icon (SVG path).
     * @deprecated Instead, simply nest `<Icon />` in the children
     */
    rightIcon?: string;
    /** Link target. */
    target?: HTMLAnchorProps['target'];
    /** Typography variant. */
    typography?: Typography;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Link';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Link component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Link = forwardRef<LinkProps, HTMLAnchorElement | HTMLButtonElement>((props, ref) => {
    const {
        children,
        className,
        color: propColor,
        colorVariant: propColorVariant,
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
    const [color, colorVariant] = resolveColorWithVariants(propColor, propColorVariant);

    const isLink = linkAs || href;
    const Component = isLink && !isDisabled ? linkAs || 'a' : 'button';
    const baseProps: React.ComponentProps<typeof Component> = {};
    if (Component === 'button') {
        baseProps.type = 'button';
        baseProps.disabled = isDisabled;
    } else if (isLink) {
        baseProps.href = href;
        baseProps.target = target;
    }

    return (
        <Component
            ref={ref}
            {...forwardedProps}
            {...baseProps}
            className={classNames(
                className,
                handleBasicClasses({ prefix: CLASSNAME, color, colorVariant, hasTypography: !!typography }),
                typography && getTypographyClassName(typography),
            )}
        >
            {wrapChildrenIconWithSpaces(
                <>
                    {leftIcon && <Icon icon={leftIcon} className={`${CLASSNAME}__left-icon`} />}
                    {children && <span className={`${CLASSNAME}__content`}>{children}</span>}
                    {rightIcon && <Icon icon={rightIcon} className={`${CLASSNAME}__right-icon`} />}
                </>,
            )}
        </Component>
    );
});
Link.displayName = COMPONENT_NAME;
Link.className = CLASSNAME;
