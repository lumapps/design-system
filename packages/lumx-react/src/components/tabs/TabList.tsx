import React, { ReactNode } from 'react';

import classNames from 'classnames';

import { Alignment, Theme } from '@lumx/react';
import { GenericProps, HasTheme } from '@lumx/react/utils/type';
import { handleBasicClasses } from '@lumx/core/js/utils/_internal/className';
import { mergeRefs } from '@lumx/react/utils/react/mergeRefs';
import { forwardRef } from '@lumx/react/utils/react/forwardRef';
import { useTheme } from '@lumx/react/utils/theme/ThemeContext';

import { useRovingTabIndex } from '../../hooks/useRovingTabIndex';
import { TABS_CLASSNAME as CLASSNAME } from './constants';

export enum TabListLayout {
    clustered = 'clustered',
    fixed = 'fixed',
}

/**
 * Defines the props of the component.
 */
export interface TabListProps extends GenericProps, HasTheme {
    /** ARIA label (purpose of the set of tabs). */
    ['aria-label']: string;
    /** Tab list. */
    children: ReactNode;
    /** Layout of the tabs in the list. */
    layout?: TabListLayout;
    /** Position of the tabs in the list (requires 'clustered' layout). */
    position?: Alignment;
}

/**
 * Component display name.
 */
const COMPONENT_NAME = 'TabList';

/**
 * Component default props.
 */
const DEFAULT_PROPS: Partial<TabListProps> = {
    layout: TabListLayout.fixed,
    position: Alignment.left,
};

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
    const {
        'aria-label': ariaLabel,
        children,
        className,
        layout = DEFAULT_PROPS.layout,
        position = DEFAULT_PROPS.position,
        theme = defaultTheme,
        ...forwardedProps
    } = props;
    const tabListRef = React.useRef(null);
    useRovingTabIndex({
        parentRef: tabListRef,
        elementSelector: '[role="tab"]',
        keepTabIndex: false,
        extraDependencies: [children],
    });

    return (
        <div
            ref={mergeRefs(ref, tabListRef)}
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, layout, position, theme }))}
        >
            <div className={`${CLASSNAME}__links`} role="tablist" aria-label={ariaLabel}>
                {children}
            </div>
        </div>
    );
});
TabList.displayName = COMPONENT_NAME;
TabList.className = CLASSNAME;
TabList.defaultProps = DEFAULT_PROPS;
