import { InputHelper as UI, InputHelperProps as UIProps } from '@lumx/core/js/components/InputHelper';
import { GenericProps } from '@lumx/core/js/types';
import { Theme } from '@lumx/react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

export interface InputHelperProps extends UIProps, GenericProps {}

/**
 * InputHelper component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputHelper = forwardRef<InputHelperProps, HTMLParagraphElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    return UI({ ...props, ref, theme: props.theme || defaultTheme });
});

InputHelper.displayName = UI.displayName;
InputHelper.className = UI.className;
InputHelper.defaultProps = UI.defaultProps;
