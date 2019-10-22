import React, { ReactElement, RefObject } from 'react';

import isEmpty from 'lodash/isEmpty';

import classNames from 'classnames';

import { Color, ColorPalette, Emphasis, Size, Theme } from 'LumX';
import { CSS_PREFIX } from 'LumX/core/constants';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { handleBasicClasses } from 'LumX/core/utils';

import { IGenericProps } from 'LumX/react/utils';

/////////////////////////////

/**
 * The authorized values for the `size` prop.
 */
type ButtonSize = Size.s | Size.m;

interface IBaseButtonProps extends IGenericProps {
    /**
     * Reference on the `<a>` or `<button>` button HTML element.
     */
    buttonRef?: RefObject<HTMLButtonElement> | RefObject<HTMLAnchorElement>;

    /**
     * Use this property to add a background color to the button in low emphasis.
     */
    hasBackground?: boolean;

    /**
     * Use this property to create a link button pointing to the given URL.
     */
    href?: string;

    /**
     * Button selected state.
     */
    isSelected?: boolean;

    /**
     * Use this property if you specified a URL in the `href` property and you want to customize the link button target property.
     */
    target?: '_self' | '_blank' | '_parent' | '_top';

    /**
     * Button color.
     */
    color?: Color;

    /**
     * Button emphasis.
     */
    emphasis?: Emphasis;

    /**
     * Button size.
     */
    size?: ButtonSize;

    /**
     * Theme.
     */
    theme?: Theme;

    /**
     * Whether custom colors are applied to this component.
     */
    useCustomColors?: boolean;
}
type BaseButtonProps = IBaseButtonProps;

interface IButtonRootProps extends BaseButtonProps {
    variant: 'button' | 'icon';
}
type ButtonRootProps = IButtonRootProps;

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ButtonRoot`;

const BUTTON_WRAPPER_CLASSNAME = `${CSS_PREFIX}-button-wrapper`;
const BUTTON_CLASSNAME = `${CSS_PREFIX}-button`;

/////////////////////////////

/**
 * Render a button wrapper with the ButtonRoot inside.
 */
const renderButtonWrapper = (props: IButtonRootProps): ReactElement => {
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
            <ButtonRoot {...buttonProps} />
        </div>
    );
};

/**
 * A generic button component used to implement the Button and IconButton components.
 * To use internally.
 *
 * Renders a <a> anchor if an `href` is provided or a <button> otherwise.
 * Wraps the element in a wrapper if the `hasBackground` param is set to true.
 *
 * @param  props Component props.
 * @return React element.
 */
const ButtonRoot = (props: ButtonRootProps): ReactElement => {
    const {
        buttonRef,
        emphasis,
        isSelected,
        size,
        color,
        className,
        hasBackground,
        children,
        theme,
        useCustomColors,
        variant,
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
            prefix: BUTTON_CLASSNAME,
            size,
            theme: emphasis === Emphasis.high && theme,
            variant,
        }),
        { [`${CSS_PREFIX}-custom-colors`]: useCustomColors },
    );

    if (!isEmpty(props.href)) {
        return (
            <a ref={buttonRef as RefObject<HTMLAnchorElement>} className={buttonClassName} {...forwardedProps}>
                {children}
            </a>
        );
    }
    return (
        <button ref={buttonRef as RefObject<HTMLButtonElement>} className={buttonClassName} {...forwardedProps}>
            {children}
        </button>
    );
};
ButtonRoot.displayName = COMPONENT_NAME;

export { BUTTON_CLASSNAME, BUTTON_WRAPPER_CLASSNAME, BaseButtonProps, ButtonRootProps, ButtonRoot };
