import type { ReactNode } from 'react';

import * as Core from '@lumx/core/js/components/InputLabel';
import { Theme } from '@lumx/react';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

export type InputLabelProps = Core.InputLabelProps<ReactNode>;

/**
 * InputLabel component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const InputLabel = forwardRef<InputLabelProps, HTMLLabelElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    return Core.InputLabel({ ...props, ref, theme: props.theme || defaultTheme });
});

InputLabel.displayName = Core.InputLabel.displayName;
InputLabel.className = Core.InputLabel.className;
InputLabel.defaultProps = Core.InputLabel.defaultProps;
