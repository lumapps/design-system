import isEmpty from 'lodash/isEmpty';

import { Icon, Theme, Text, ThemeProvider } from '@lumx/react';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled';
import {
    Button as UI,
    ButtonProps as UIProps,
    CLASSNAME,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    ButtonEmphasis,
} from '@lumx/core/js/components/Button/Button';
import { isComponent } from '@lumx/react/utils/type/isComponent';
import { GenericProps } from '@lumx/core/js/types';

export type { ButtonEmphasis };
export { CLASSNAME, COMPONENT_NAME, DEFAULT_PROPS };

export interface ButtonProps extends UIProps, GenericProps {}

/**
 * Button component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Button = forwardRef<ButtonProps, HTMLButtonElement | HTMLAnchorElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { isAnyDisabled, disabledStateProps, otherProps } = useDisableStateProps(props);
    const { leftIcon, rightIcon, children } = props;

    return UI({
        ref,
        theme: defaultTheme,
        ...disabledStateProps,
        ...otherProps,
        'aria-disabled': isAnyDisabled,
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
