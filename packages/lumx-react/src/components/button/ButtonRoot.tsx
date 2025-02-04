import React, { AriaAttributes, ButtonHTMLAttributes, DetailedHTMLProps, RefObject } from 'react';

import isEmpty from 'lodash/isEmpty';

import classNames from 'classnames';

import { ColorPalette, Emphasis, Size, Theme } from '@lumx/react';
import { CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/react/utils/className';
import { renderLink } from '@lumx/react/utils/react/renderLink';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

type HTMLButtonProps = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

/**
 * Button size definition.
 */
export type ButtonSize = Extract<Size, 's' | 'm'>;

export interface BaseButtonProps
    extends GenericProps,
        Pick<AriaAttributes, 'aria-expanded' | 'aria-haspopup' | 'aria-pressed' | 'aria-label'>,
        HasTheme {
    /** Color variant. */
    color?: ColorPalette;
    /** Emphasis variant. */
    emphasis?: Emphasis;
    /** Whether or not the button has a background color in low emphasis. */
    hasBackground?: boolean;
    /** Native anchor href property. It determines whether the Button will be a <button> or an <a>. */
    href?: string;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Whether the component is selected or not (unsupported in `high` emphasis). */
    isSelected?: boolean;
    /** Native button name property. */
    name?: string;
    /** Size variant. */
    size?: ButtonSize;
    /** Native anchor target property. */
    target?: '_self' | '_blank' | '_parent' | '_top';
    /** Native button type. */
    type?: HTMLButtonProps['type'];
    /** Custom react component for the link (can be used to inject react router Link). */
    linkAs?: 'a' | any;
    /** Children */
    children?: React.ReactNode;
}

export interface ButtonRootProps extends BaseButtonProps {
    variant: 'button' | 'icon';
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'ButtonRoot';

export const BUTTON_WRAPPER_CLASSNAME = `${CSS_PREFIX}-button-wrapper`;
export const BUTTON_CLASSNAME = `${CSS_PREFIX}-button`;

/**
 * Render a button wrapper with the ButtonRoot inside.
 *
 * @param  props Component props.
 * @return React element.
 */
const renderButtonWrapper: React.FC<ButtonRootProps> = (props) => {
    const { color, emphasis, variant, fullWidth } = props;

    const adaptedColor =
        emphasis === Emphasis.low && (color === ColorPalette.light ? ColorPalette.dark : ColorPalette.light);

    const wrapperClassName = classNames(
        handleBasicClasses({
            color: adaptedColor,
            prefix: BUTTON_WRAPPER_CLASSNAME,
            variant,
            fullWidth,
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

/**
 * ButtonRoot component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const ButtonRoot = forwardRef<ButtonRootProps, HTMLButtonElement | HTMLAnchorElement>((props, ref) => {
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
        isActive,
        isFocused,
        isHovered,
        linkAs,
        name,
        size,
        target,
        theme,
        variant,
        type = 'button',
        fullWidth,
        ...forwardedProps
    } = props;

    const adaptedColor =
        color ||
        (emphasis !== Emphasis.high && theme === Theme.dark && ColorPalette.light) ||
        (emphasis === Emphasis.high && ColorPalette.primary) ||
        ColorPalette.dark;

    if (hasBackground) {
        return renderButtonWrapper({ ...props, ref, variant, color: adaptedColor });
    }

    const buttonClassName = classNames(
        className,
        handleBasicClasses({
            color: adaptedColor,
            emphasis,
            isSelected,
            isDisabled,
            isActive,
            isFocused,
            isHovered,
            prefix: BUTTON_CLASSNAME,
            size,
            theme: emphasis === Emphasis.high && theme,
            variant,
            fullWidth,
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
