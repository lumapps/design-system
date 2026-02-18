import { Icon as UI, IconProps as UIProps, IconSizes } from '@lumx/core/js/components/Icon';
import { GenericProps } from '@lumx/core/js/types';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';

export type { IconSizes };

export interface IconProps extends ReactToJSX<UIProps>, GenericProps {}

/**
 * Icon component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Icon = forwardRef<IconProps, HTMLElement>((props, ref) => {
    const defaultTheme = useTheme();

    return UI({ ...props, ref, theme: props.theme || defaultTheme });
});

Icon.displayName = UI.displayName;
Icon.className = UI.className;
Icon.defaultProps = UI.defaultProps;
