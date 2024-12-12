import * as Core from '@lumx/core/js/components/InputHelper';
import { Theme } from '@lumx/react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import type { ReactNode } from 'react';

export type InputHelperProps = Core.InputHelperProps<ReactNode>;

/**
 * InputHelper component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputHelper = forwardRef<InputHelperProps, HTMLParagraphElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    return Core.InputHelper({ ...props, ref, theme: props.theme || defaultTheme });
});

InputHelper.displayName = Core.InputHelper.displayName;
InputHelper.className = Core.InputHelper.className;
InputHelper.defaultProps = Core.InputHelper.defaultProps;
