import React from 'react';

import { Theme } from '@lumx/react';
import { GenericProps } from '@lumx/react/utils/type';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';
import { TABS_CLASSNAME as CLASSNAME } from '@lumx/core/js/components/Tabs/constants';
import {
    COMPONENT_NAME,
    DEFAULT_PROPS,
    TabList as UI,
    TabListProps as UIProps,
    TabListPropsToOverride,
    TabListLayout,
} from '@lumx/core/js/components/Tabs/TabList';

import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { useRovingTabIndexContainer } from '../../hooks/useRovingTabIndexContainer';
import { useTabProviderContextState } from './state';

/**
 * Defines the props of the component.
 */
export interface TabListProps extends GenericProps, ReactToJSX<UIProps, TabListPropsToOverride> {}

export { TabListLayout };

/**
 * TabList component.
 *
 * Implements WAI-ARIA `tablist` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * Renders a `role="navigation"` landmark instead when used outside a `TabProvider` (nav-link mode).
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TabList = forwardRef<TabListProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { theme = defaultTheme, ...forwardedProps } = props;
    const tabListRef = React.useRef<HTMLDivElement>(null);
    const role = useTabProviderContextState() === undefined ? 'navigation' : 'tablist';

    // Classic roving tabindex (role="tab"). Disabled in nav-link mode: nav links keep their
    // native per-link Tab stops, so this path is never engaged there.
    useRovingTabIndexContainer({
        containerRef: role === 'navigation' ? null : tabListRef,
        itemSelector: '[role="tab"]',
    });

    return UI({
        ...forwardedProps,
        theme,
        role,
        ref: mergeRefs(ref, tabListRef),
    });
});

TabList.displayName = COMPONENT_NAME;
TabList.className = CLASSNAME;
TabList.defaultProps = DEFAULT_PROPS;
