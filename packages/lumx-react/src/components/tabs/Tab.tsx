import { ReactNode } from 'react';

import { Icon, IconProps, Text } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useDisableStateProps } from '@lumx/react/utils/disabled/useDisableStateProps';
import {
    Tab as UI,
    TabProps as UIProps,
    TabPropsToOverride,
    COMPONENT_NAME,
    DEFAULT_PROPS,
    CLASSNAME,
} from '@lumx/core/js/components/Tabs/Tab';

import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { useTabProviderContext } from './state';

/**
 * Defines the props of the component.
 */
export interface TabProps extends GenericProps, ReactToJSX<UIProps, TabPropsToOverride> {
    /** Children are not supported. */
    children?: never;
    /** Icon (SVG path). */
    icon?: IconProps['icon'];
    /** Icon component properties. */
    iconProps?: Omit<IconProps, 'icon'>;
    /** Native id property. */
    id?: string;
    /** Whether the tab is active or not. */
    isActive?: boolean;
    /** Whether the component is disabled or not. */
    isDisabled?: boolean;
    /** Label content. */
    label: string | ReactNode;
}

/**
 * Tab component.
 *
 * Implements WAI-ARIA `tab` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const Tab = forwardRef<TabProps, HTMLButtonElement>((props, ref) => {
    const { isAnyDisabled, otherProps } = useDisableStateProps(props);
    const { isActive: propIsActive, id, onFocus, onKeyPress, ...forwardedProps } = otherProps;
    const state = useTabProviderContext('tab', id);
    const isActive = propIsActive || state?.isActive;

    return UI({
        id,
        ...state,
        Icon,
        Text,
        ref,
        isActive,
        isAnyDisabled,
        handleFocus: onFocus,
        handleKeyPress: onKeyPress,
        ...forwardedProps,
    });
});

Tab.displayName = COMPONENT_NAME;
Tab.className = CLASSNAME;
Tab.defaultProps = DEFAULT_PROPS;
