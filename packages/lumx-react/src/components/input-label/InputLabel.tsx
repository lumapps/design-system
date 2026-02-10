import { Theme } from '@lumx/react';
import { InputLabel as UI, InputLabelProps as UIProps } from '@lumx/core/js/components/InputLabel';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { GenericProps } from '@lumx/core/js/types';

export interface InputLabelProps extends UIProps, GenericProps {}

/**
 * InputLabel component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputLabel = forwardRef<InputLabelProps, HTMLLabelElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    return UI({ ...props, ref, theme: props.theme || defaultTheme });
});

InputLabel.displayName = UI.displayName;
InputLabel.className = UI.className;
InputLabel.defaultProps = UI.defaultProps;
