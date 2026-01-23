import isEmpty from 'lodash/isEmpty';

import { Emphasis, Size } from '../../constants';
import { getBasicClass } from '../../utils/_internal/className';
import type { LumxClassName } from '../../types';
import { classNames } from '../../utils';

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
    /** Left icon (SVG path). */
    leftIcon?: string;
    /** Right icon (SVG path). */
    rightIcon?: string;
    /** When `true`, the button gets as large as possible. */
    fullWidth?: boolean;
    /** Children */
    children?: React.ReactNode;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'Button';

/**
 * Component default class name and class prefix.
 */
const CLASSNAME: LumxClassName<typeof COMPONENT_NAME> = 'lumx-button';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<ButtonProps> = {
    emphasis: Emphasis.high,
    size: Size.m,
};

/**
 * Button component.
 *
 * @param  props Component props.
 * @return Element.
 */
export const Button = (props: ButtonProps) => {
    const {
        children,
        className,
        emphasis = DEFAULT_PROPS.emphasis,
        leftIcon,
        rightIcon,
        size = DEFAULT_PROPS.size,
        theme,
        ...forwardedProps
    } = props;

    const buttonClassName = classNames.join(
        className,
        getBasicClass({ prefix: CLASSNAME, type: 'hasLeftIcon', value: !isEmpty(leftIcon) }),
        getBasicClass({ prefix: CLASSNAME, type: 'hasRightIcon', value: !isEmpty(rightIcon) }),
    );

    return ButtonRoot({
        className: buttonClassName,
        emphasis,
        size,
        theme,
        ...forwardedProps,
    });
};

Button.displayName = COMPONENT_NAME;
Button.className = CLASSNAME;
Button.defaultProps = DEFAULT_PROPS;
