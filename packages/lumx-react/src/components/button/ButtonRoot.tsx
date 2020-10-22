import React, { RefObject } from 'react';

import isEmpty from 'lodash/isEmpty';

import classNames from 'classnames';

import { Color, ColorPalette, Emphasis, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, handleBasicClasses } from '@lumx/react/utils';
import { renderLink } from '@lumx/react/utils/renderLink';

/**
 * The authorized values for the `size` prop.
 */
export type ButtonSize = Size.s | Size.m;

interface BaseButtonProps extends GenericProps {
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

    /**
     * Use this property if you specified a URL in the `href` property and you want to customize the react component
     * for the link (can be used to inject react router Link).
     */
    linkAs?: 'a' | any;
}

interface ButtonRootProps extends BaseButtonProps {
    variant: 'button' | 'icon';
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}ButtonRoot`;

const BUTTON_WRAPPER_CLASSNAME = `${CSS_PREFIX}-button-wrapper`;
const BUTTON_CLASSNAME = `${CSS_PREFIX}-button`;

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
const ButtonRoot: React.FC<ButtonRootProps> = (props) => {
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
        linkAs,
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

    if (!isEmpty(props.href) || linkAs) {
        return renderLink(
            {
                linkAs,
                ref: buttonRef as RefObject<HTMLAnchorElement>,
                className: buttonClassName,
                ...forwardedProps,
            },
            children,
        );
    }
    return (
        <button {...forwardedProps} ref={buttonRef as RefObject<HTMLButtonElement>} className={buttonClassName}>
            {children}
        </button>
    );
};
ButtonRoot.displayName = COMPONENT_NAME;

export { BUTTON_CLASSNAME, BUTTON_WRAPPER_CLASSNAME, BaseButtonProps, ButtonRootProps, ButtonRoot };
