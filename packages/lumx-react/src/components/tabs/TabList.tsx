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
    TabListLayout,
} from '@lumx/core/js/components/Tabs/TabList';

import { ReactToJSX } from '@lumx/react/utils/type/ReactToJSX';
import { useRovingTabIndexContainer } from '../../hooks/useRovingTabIndexContainer';

/**
 * Defines the props of the component.
 */
export interface TabListProps extends GenericProps, ReactToJSX<UIProps> {}

export { TabListLayout };

/**
 * TabList component.
 *
 * Implements WAI-ARIA `tablist` role {@see https://www.w3.org/TR/wai-aria-practices-1.1/examples/tabs/tabs-1/tabs.html#rps_label}
 *
 * @param  props Component props.
 * @param  ref   Component ref.
 * @return React element.
 */
export const TabList = forwardRef<TabListProps, HTMLDivElement>((props, ref) => {
    const defaultTheme = useTheme() || Theme.light;
    const { theme = defaultTheme, ...forwardedProps } = props;
    const tabListRef = React.useRef(null);
    useRovingTabIndexContainer({
        containerRef: tabListRef,
        itemSelector: '[role="tab"]',
    });

    return UI({
        theme,
        ref: mergeRefs(ref, tabListRef),
        ...forwardedProps,
    });
});

TabList.displayName = COMPONENT_NAME;
TabList.className = CLASSNAME;
TabList.defaultProps = DEFAULT_PROPS;
