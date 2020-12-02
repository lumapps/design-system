import React, { ButtonHTMLAttributes, DetailedHTMLProps, RefObject } from 'react';

import isEmpty from 'lodash/isEmpty';

import classNames from 'classnames';

import { Color, ColorPalette, Emphasis, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, handleBasicClasses } from '@lumx/react/utils';
import { renderLink } from '@lumx/react/utils/renderLink';

type HTMLButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

/**
 * The authorized values for the `size` prop.
 */
export type ButtonSize = Size.s | Size.m;

export interface BaseButtonProps extends GenericProps {
    /** The label that describes the button if necessary. */
    ['aria-label']?: string;
    /** The reference passed to the <a> or <button> element. */
    buttonRef?: RefObject<HTMLButtonElement> | RefObject<HTMLAnchorElement>;
    /** The color variant of the component. */
    color?: Color;
    /** The emphasis variant of the component. */
    emphasis?: Emphasis;
    /** Whether or not the button has a background color in low emphasis. */
    hasBackground?: boolean;
    /** The native anchor href property. It determines whether the Button will be a <button> or an <a>. */
    href?: string;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the component is selected or not. */
    isSelected?: boolean;
    /** The native input name property. */
    name?: string;
    /** The size variant of the component. */
    size?: ButtonSize;
    /** The native anchor target property. */
    target?: '_self' | '_blank' | '_parent' | '_top';
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** The native button type. */
    type?: HTMLButtonProps['type'];
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
    /**
     * Use this property if you specified a URL in the `href` property and you want to customize the react component
     * for the link (can be used to inject react router Link).
     */
    linkAs?: 'a' | any;
}

export interface ButtonRootProps extends BaseButtonProps {
    variant: 'button' | 'icon';
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ButtonRoot`;

export const BUTTON_WRAPPER_CLASSNAME = `${CSS_PREFIX}-button-wrapper`;
export const BUTTON_CLASSNAME = `${CSS_PREFIX}-button`;

/**
 * Render a button wrapper with the ButtonRoot inside.
 *
 * @param  props The component props.
 * @return The component.
 */
const renderButtonWrapper: React.FC<ButtonRootProps> = (props) => {
    const { color, emphasis, variant } = props;

    const adaptedColor =
        emphasis === Emphasis.low && (color === ColorPalette.light ? ColorPalette.dark : ColorPalette.light);

    const wrapperClassName = classNames(
        handleBasicClasses({
            color: adaptedColor,
            prefix: BUTTON_WRAPPER_CLASSNAME,
            variant,
        }),
    );
    const buttonProps = { ...props, hasBackground: false };

    return (
        <div className={wrapperClassName}>
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            <ButtonRoot {...buttonProps} />
        </div>
    );
};

export const ButtonRoot: React.FC<ButtonRootProps> = (props) => {
    const {
        'aria-label': ariaLabel,
        buttonRef,
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
        useCustomColors,
        variant,
        type = 'button',
        ...forwardedProps
    } = props;

    const adaptedColor =
        color ||
        (emphasis !== Emphasis.high && theme === Theme.dark && ColorPalette.light) ||
        (emphasis === Emphasis.high && ColorPalette.primary) ||
        ColorPalette.dark;

    if (hasBackground) {
        return renderButtonWrapper({ ...props, color: adaptedColor });
    }

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
            variant,
        }),
        { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
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
                ref: buttonRef as RefObject<HTMLAnchorElement>,
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
            ref={buttonRef as RefObject<HTMLButtonElement>}
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
};
ButtonRoot.displayName = COMPONENT_NAME;
ButtonRoot.defaultProps = {};
