import * as Core from '@lumx/core/js/components/Icon';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

export type IconProps = Core.IconProps;
export type IconSizes = Core.IconSizes;

/**
 * Icon component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Icon = forwardRef<IconProps, HTMLElement>((props, ref) => {
    const defaultTheme = useTheme();

    return Core.Icon({ ...props, ref, theme: props.theme || defaultTheme });
});

Icon.displayName = Core.Icon.displayName;
Icon.className = Core.Icon.className;
Icon.defaultProps = Core.Icon.defaultProps;
