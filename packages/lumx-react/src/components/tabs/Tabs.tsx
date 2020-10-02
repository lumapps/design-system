import React, { Children, ReactElement, ReactNode, cloneElement } from 'react';

import classNames from 'classnames';

import { TabProps, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

enum TabsLayout {
    clustered = 'clustered',
    fixed = 'fixed',
}

enum TabsPosition {
    center = 'center',
    left = 'left',
    right = 'right',
}

/**
 * Defines the props of the component.
 */
interface TabsProps extends GenericProps {
    /** The active tab. */
    activeTab?: number;
    /** The children elements. */
    children: ReactNode;
    /** The layout of the tabs. */
    layout?: TabsLayout;
    /** The position of the tabs. */
    position?: TabsPosition;
    /** The theme to apply to the component. Can be either 'light' or 'dark'. */
    theme?: Theme;
    /** Whether custom colors are applied to this component or not. */
    useCustomColors?: boolean;
    /** The function called on click. */
    onTabClick: TabProps['onTabClick'];
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Tabs`;

/**
 * The default class name and classes prefix for this component.
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
const DEFAULT_PROPS: Partial<TabsProps> = {
    activeTab: 0,
    layout: TabsLayout.fixed,
    position: TabsPosition.left,
    theme: Theme.light,
};

const Tabs: React.FC<TabsProps> = ({
    activeTab,
    children,
    className,
    layout,
    onTabClick,
    position,
    theme,
    useCustomColors,
    ...forwardedProps
}) => {
    const tabs: ReactElement[] = Children.map(children as ReactElement[], (tab: ReactElement, index: number) => {
        return cloneElement(tab, { key: index, index, isActive: activeTab === index, onTabClick });
    });

    return (
        <div
            {...forwardedProps}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, layout, position, theme }), {
                [`${CSS_PREFIX}-custom-colors`]: useCustomColors,
            })}
        >
            <div className={`${CLASSNAME}__links`}>{tabs}</div>

            <div className={`${CLASSNAME}__panes`}>{tabs[activeTab!].props.children}</div>
        </div>
    );
};
Tabs.displayName = COMPONENT_NAME;
Tabs.defaultProps = DEFAULT_PROPS;

export { CLASSNAME, Tabs, TabsProps, TabsLayout, TabsPosition };
