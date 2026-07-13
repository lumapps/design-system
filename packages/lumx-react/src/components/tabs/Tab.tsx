import { ElementType, ReactNode } from 'react';

import { Icon, IconProps, Text } from '@lumx/react';
import { ComponentRef, GenericProps, HasPolymorphicAs, HasRequiredLinkHref } from '@lumx/react/utils/type';
import { forwardRefPolymorphic } from '@lumx/react/utils/react/forwardRefPolymorphic';
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
import { type TabState, useTabProviderContext } from './state';

/**
 * Defines the props of the component. Polymorphic on `as` (element selection only): `as` picks the
 * rendered element (`as="a"` with required `href`, or `as={RouterLink}`), while the mode
 * (`role="tab"` vs nav-link) is driven by `TabProvider` presence. The forwarded ref type follows `as`.
 */
export type TabProps<E extends ElementType = 'button'> = GenericProps &
    HasPolymorphicAs<E> &
    HasRequiredLinkHref<E> &
    ReactToJSX<UIProps, TabPropsToOverride> & {
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
    };

/**
 * Tab component.
 *
 * Implements WAI-ARIA `tab` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 * when rendered inside a `TabProvider`.
 *
 * Outside a `TabProvider` (nav-link mode): plain link, no `role="tab"`/roving tabindex/`changeToTab`
 * dispatch — only `aria-current` marks the active item.
 *
 * @param  props Component props.
 * @param  ref   Component ref (type follows `as`).
 * @return React element.
 */
export const Tab = Object.assign(
    forwardRefPolymorphic(<E extends ElementType = 'button'>(props: TabProps<E>, ref: ComponentRef<E>) => {
        const { isAnyDisabled, otherProps } = useDisableStateProps(props);
        const { as = 'button', isActive: propIsActive, id, onFocus, onKeyPress, ...forwardedProps } = otherProps;

        // Register into the provider (if any) so it can track this tab's index / active state.
        const tabState = useTabProviderContext('tab', id);
        // In a provider => tab mode (role="tab"); outside => nav-link mode. Mirrors TabList's role.
        const inProvider = tabState !== undefined;

        const { isLazy: _isLazy, tabId, ...state } = tabState ?? ({} as Partial<TabState>);
        // Without a provider there's no active index, so this collapses to the caller-provided value.
        const isActive = propIsActive || state?.isActive;

        return UI({
            ...forwardedProps,
            ...state,
            as,
            role: inProvider ? 'tab' : undefined,
            Icon,
            Text,
            ref,
            // Falls back to the caller-provided `id` when there's no TabProvider to generate one.
            id: tabId || id,
            isActive,
            isAnyDisabled,
            isDisabled: isAnyDisabled,
            handleFocus: onFocus,
            handleKeyPress: onKeyPress,
        } as UIProps<E>);
    }),
    { displayName: COMPONENT_NAME, className: CLASSNAME, defaultProps: DEFAULT_PROPS },
);
