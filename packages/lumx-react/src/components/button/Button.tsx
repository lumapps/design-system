import isEmpty from 'lodash/isEmpty';

import { Emphasis, Icon, Theme, Text, ThemeProvider } from '@lumx/react';
import { isComponent } from '@lumx/react/utils/type';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled';

import {
    Button as UI,
    ButtonProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
} from '@lumx/core/js/components/Button/Button';

/**
 * Button emphasis definition.
 * @deprecated Use Emphasis instead.
 */
export const ButtonEmphasis = Emphasis;

/**
 * Defines the props of the component.
 */
export type { ButtonProps };
export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

/**
 * Button component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Button = forwardRef<ButtonProps, HTMLButtonElement | HTMLAnchorElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { leftIcon, rightIcon, children } = props;
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);

    return UI({
        ...props,
        ...otherProps,
        ...disabledStateProps,
        theme: defaultTheme,
        variant: 'button',
        'aria-disabled': isAnyDisabled,
        ref,
        children: (
            <>
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
            </>
        ),
    });
});

Button.displayName = COMPONENT_NAME;
Button.className = CLASSNAME;
Button.defaultProps = DEFAULT_PROPS;
