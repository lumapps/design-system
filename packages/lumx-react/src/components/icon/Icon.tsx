import React from 'react';

import { Icon as UI, IconProps, IconSizes } from '@lumx/core/js/components/Icon';

import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

export type { IconProps, IconSizes };
/**
 * Icon component.
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Icon = forwardRef<IconProps, HTMLElement>((props, ref) => {
    const defaultTheme = useTheme();

    return <UI ref={ref} {...props} theme={props.theme || defaultTheme} />;
});

Icon.displayName = UI.displayName;
Icon.className = UI.className;
Icon.defaultProps = UI.defaultProps;
