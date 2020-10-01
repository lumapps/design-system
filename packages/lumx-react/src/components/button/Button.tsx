import React, { ReactNode } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { Emphasis, Icon, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { getBasicClass, getRootClassName } from '@lumx/react/utils';
import { BaseButtonProps, ButtonRoot } from './ButtonRoot';

/**
 * The authorized values for the `emphasis` prop.
 * @deprecated Use Emphasis instead.
 */
const ButtonEmphasis = Emphasis;

/**
 * Defines the props of the component.
 */
interface ButtonProps extends BaseButtonProps {
    /** The children elements to be transcluded into the component. */
    children?: ReactNode;
    /**
     * The icon name to place at the left of the button label.
     * @see {@link IconProps#icon}
     */
    leftIcon?: string;
    /**
     * The icon name to place at the right of the button label.
     * @see {@link IconProps#icon}
     */
    rightIcon?: string;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Button`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<ButtonProps> = {
    emphasis: Emphasis.high,
    size: Size.m,
    theme: Theme.light,
};

const Button: React.FC<ButtonProps> = (props) => {
    const {
        children,
        className,
        emphasis = DEFAULT_PROPS.emphasis,
        leftIcon,
        rightIcon,
        size = DEFAULT_PROPS.size,
        theme = DEFAULT_PROPS.theme,
        ...forwardedProps
    } = props;

    const buttonClassName = classNames(
        className,
        getBasicClass({ prefix: CLASSNAME, type: 'hasLeftIcon', value: !isEmpty(leftIcon) }),
        getBasicClass({ prefix: CLASSNAME, type: 'hasRightIcon', value: !isEmpty(rightIcon) }),
    );

    return (
        <ButtonRoot {...{ emphasis, size, theme, ...forwardedProps }} className={buttonClassName} variant="button">
            {leftIcon && !isEmpty(leftIcon) && <Icon icon={leftIcon} />}
            {children && <span>{children}</span>}
            {rightIcon && !isEmpty(rightIcon) && <Icon icon={rightIcon} />}
        </ButtonRoot>
    );
};
Button.displayName = COMPONENT_NAME;

export { CLASSNAME, DEFAULT_PROPS, ButtonEmphasis, Button, ButtonProps };
