import {
    InputRequiredLegend as UI,
    InputRequiredLegendProps as UIProps,
} from '@lumx/core/js/components/InputRequiredLegend';
import { Theme } from '@lumx/react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { GenericProps } from '@lumx/core/js/types';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

export interface InputRequiredLegendProps extends ReactToJSX<UIProps>, GenericProps {}

/**
 * InputRequiredLegend component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputRequiredLegend = forwardRef<InputRequiredLegendProps, HTMLParagraphElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    return UI({ ...props, ref, theme: props.theme || defaultTheme });
});

InputRequiredLegend.displayName = UI.displayName;
InputRequiredLegend.className = UI.className;
InputRequiredLegend.defaultProps = UI.defaultProps;
