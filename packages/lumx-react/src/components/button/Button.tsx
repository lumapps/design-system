import React, { forwardRef, ReactNode } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { Emphasis, Icon, Size, Theme } from '@lumx/react';
import { Comp, getBasicClass, getRootClassName } from '@lumx/react/utils';
import { BaseButtonProps, ButtonRoot } from './ButtonRoot';

/**
 * Button emphasis definition.
 * @deprecated Use Emphasis instead.
 */
export const ButtonEmphasis = Emphasis;

/**
 * Defines the props of the component.
 */
export interface ButtonProps extends BaseButtonProps {
    /** Button content. */
    children?: ReactNode;
    /** Left icon (SVG path). */
    leftIcon?: string;
    /** Right icon (SVG path). */
    rightIcon?: string;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Button';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ButtonProps> = {
    emphasis: Emphasis.high,
    size: Size.m,
    theme: Theme.light,
};

/**
 * Button component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Button: Comp<ButtonProps, HTMLButtonElement | HTMLAnchorElement> = forwardRef((props, ref) => {
    const { children, className, emphasis, leftIcon, rightIcon, size, theme, ...forwardedProps } = props;

    const buttonClassName = classNames(
        className,
        getBasicClass({ prefix: CLASSNAME, type: 'hasLeftIcon', value: !isEmpty(leftIcon) }),
        getBasicClass({ prefix: CLASSNAME, type: 'hasRightIcon', value: !isEmpty(rightIcon) }),
    );

    return (
        <ButtonRoot
            ref={ref}
            {...{ emphasis, size, theme, ...forwardedProps }}
            className={buttonClassName}
            variant="button"
        >
            {leftIcon && !isEmpty(leftIcon) && <Icon icon={leftIcon} />}
            {children && <span>{children}</span>}
            {rightIcon && !isEmpty(rightIcon) && <Icon icon={rightIcon} />}
        </ButtonRoot>
    );
});
Button.displayName = COMPONENT_NAME;
Button.className = CLASSNAME;
Button.defaultProps = DEFAULT_PROPS;
