import React, { ReactNode } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { Emphasis, Icon, Size, Theme } from '@lumx/react';
import { COMPONENT_PREFIX } from '@lumx/react/constants';
import { getBasicClass, getRootClassName } from '@lumx/react/utils';
import { BaseButtonProps, ButtonRoot } from './ButtonRoot';

/**
 * Defines the props of the component.
 */
interface ButtonProps extends BaseButtonProps {
    /** The children elements. */
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
    const { children, className, emphasis, leftIcon, rightIcon, size, theme, ...forwardedProps } = props;

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
Button.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Button, ButtonProps };
