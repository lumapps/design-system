import React, { ButtonHTMLAttributes, DetailedHTMLProps, forwardRef, RefObject } from 'react';

import isEmpty from 'lodash/isEmpty';

import classNames from 'classnames';

import { Color, ColorPalette, Emphasis, Size, Theme } from '@lumx/react';
import { CSS_PREFIX } from '@lumx/react/constants';
import { Comp, GenericProps, handleBasicClasses } from '@lumx/react/utils';
import { renderLink } from '@lumx/react/utils/renderLink';

type HTMLButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

/**
 * Button size definition.
 */
export type ButtonSize = Extract<Size, 's' | 'm'>;

export interface BaseButtonProps extends GenericProps {
    /** ARIA button label. */
    ['aria-label']?: string;
    /** Color variant. */
    color?: Color;
    /** Emphasis variant. */
    emphasis?: Emphasis;
    /** Whether or not the button has a background color in low emphasis. */
    hasBackground?: boolean;
    /** Native anchor href property. It determines whether the Button will be a <button> or an <a>. */
    href?: string;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** Native button name property. */
    name?: string;
    /** Size variant. */
    size?: ButtonSize;
    /** Native anchor target property. */
    target?: '_self' | '_blank' | '_parent' | '_top';
    /** Theme adapting the component to light or dark background. */
    theme?: Theme;
    /** Native button type. */
    type?: HTMLButtonProps['type'];
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
}

export interface ButtonRootProps extends BaseButtonProps {
    variant: 'button' | 'icon';
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ButtonRoot';

export const BUTTON_CLASSNAME = `${CSS_PREFIX}-button`;

/**
 * ButtonRoot component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ButtonRoot: Comp<ButtonRootProps, HTMLButtonElement | HTMLAnchorElement> = forwardRef((props, ref) => {
    const {
        'aria-label': ariaLabel,
        children,
        className,
        color,
        disabled,
        emphasis,
        hasBackground,
        href,
        isDisabled = disabled,
        isSelected,
        linkAs,
        name,
        size,
        target,
        theme,
        variant,
        type = 'button',
        ...forwardedProps
    } = props;

    const adaptedColor =
        color ||
        (emphasis !== Emphasis.high && theme === Theme.dark && ColorPalette.light) ||
        (emphasis === Emphasis.high && ColorPalette.primary) ||
        ColorPalette.dark;

    const backgroundColor =
        hasBackground &&
        emphasis === Emphasis.low &&
        (adaptedColor === ColorPalette.light ? ColorPalette.dark : ColorPalette.light);

    const buttonClassName = classNames(
        className,
        handleBasicClasses({
            color: adaptedColor,
            emphasis,
            isSelected,
            isDisabled,
            prefix: BUTTON_CLASSNAME,
            size,
            theme: emphasis === Emphasis.high && theme,
            hasBackground,
            backgroundColor,
            variant,
        }),
    );

    /**
     * If the linkAs prop is used, we use the linkAs component instead of a <button>.
     * If there is an href attribute, we display an <a> instead of a <button>.
     *
     * However, in any case, if the component is disabled, we returned a <button> since disabled is not compatible with <a>.
     */
    if ((linkAs || !isEmpty(props.href)) && !isDisabled) {
        return renderLink(
            {
                linkAs,
                ...forwardedProps,
                'aria-label': ariaLabel,
                href,
                target,
                className: buttonClassName,
                ref: ref as RefObject<HTMLAnchorElement>,
            },
            children,
        );
    }
    return (
        <button
            {...forwardedProps}
            disabled={isDisabled}
            aria-disabled={isDisabled}
            aria-label={ariaLabel}
            ref={ref as RefObject<HTMLButtonElement>}
            className={buttonClassName}
            name={name}
            type={
                // eslint-disable-next-line react/button-has-type
                type
            }
        >
            {children}
        </button>
    );
});
ButtonRoot.displayName = COMPONENT_NAME;
ButtonRoot.defaultProps = {};
