import { type ReactNode } from 'react';

import { GenericInputHelperProps, InputHelper as UI } from '@lumx/core/js/components/InputHelper';
import { Theme } from '@lumx/react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

export type InputHelperProps = GenericInputHelperProps<ReactNode>;

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
