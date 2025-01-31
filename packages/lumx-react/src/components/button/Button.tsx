import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { Emphasis, Icon, Size, Theme, Text, ThemeProvider } from '@lumx/react';
import { isComponent } from '@lumx/react/utils/type';
import { getBasicClass } from '@lumx/core/js/utils/className';
import type { LumxClassName } from '@lumx/core/js/types';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';

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
 * @param  ref   Component ref.
 * @return React element.
 */
export const Button = forwardRef<ButtonProps, HTMLButtonElement | HTMLAnchorElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const {
        children,
        className,
        emphasis = DEFAULT_PROPS.emphasis,
        leftIcon,
        rightIcon,
        size = DEFAULT_PROPS.size,
        theme = defaultTheme,
        ...forwardedProps
    } = props;

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
            {leftIcon && !isEmpty(leftIcon) && (
                // Theme is handled in the button scss
                <ThemeProvider value={undefined}>
                    <Icon icon={leftIcon} />
                </ThemeProvider>
            )}
            {children && (isComponent(Text)(children) ? children : <span>{children}</span>)}
            {rightIcon && !isEmpty(rightIcon) && (
                // Theme is handled in the button scss
                <ThemeProvider value={undefined}>
                    <Icon icon={rightIcon} />
                </ThemeProvider>
            )}
        </ButtonRoot>
    );
});
Button.displayName = COMPONENT_NAME;
Button.className = CLASSNAME;
Button.defaultProps = DEFAULT_PROPS;
