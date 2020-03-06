import React, { Children, ReactNode, cloneElement } from 'react';

import classNames from 'classnames';

import { TabProps, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

export enum TabsLayout {
    clustered = 'clustered',
    fixed = 'fixed',
}

export enum TabsPosition {
    center = 'center',
    left = 'left',
    right = 'right',
}

/**
 * Defines the props of the component.
 */
export interface TabsProps extends GenericProps {
    /** Active tab */
    activeTab?: number;
    /** Component tabs */
    children: ReactNode;
    /** Tabs Layout */
    layout?: TabsLayout;
    /** Function to trigger on tab click */
    onTabClick: TabProps['onTabClick'];
    /** Tabs Position */
    position?: TabsPosition;
    /** Component theme */
    theme?: Theme;
    /** Whether custom colors are applied to this component. */
    useCustomColors?: boolean;
}

/**
 * The display name of the component.
 */
const COMPONENT_NAME = `${COMPONENT_PREFIX}Tabs`;

/**
 * The default class name and classes prefix for this component.
 */
export const CLASSNAME = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 */
export const DEFAULT_PROPS: Partial<TabsProps> = {
    activeTab: 0,
    children: [],
    layout: TabsLayout.fixed,
    position: TabsPosition.left,
    theme: Theme.light,
};

/**
 * Defines a Tabs component.
 *
 * @return The component.
 */
export const Tabs: React.FC<TabsProps> = ({
    activeTab = DEFAULT_PROPS.activeTab,
    children,
    className,
    layout = DEFAULT_PROPS.layout,
    onTabClick,
    position = DEFAULT_PROPS.position,
    theme = DEFAULT_PROPS.theme,
    useCustomColors,
    ...props
}) => {
    const tabs = Children.map(children, (tab, index) => {
        if (!React.isValidElement(tab)) return undefined;
        return cloneElement(tab, { key: index, index, isActive: activeTab === index, onTabClick });
    });

    return (
        <div
            {...props}
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, layout, position, theme }), {
                [`${CSS_PREFIX}-custom-colors`]: useCustomColors,
            })}
            role="tabpanel"
        >
            <div className={`${CLASSNAME}__links`}>{tabs}</div>

            <div className={`${CLASSNAME}__panes`}>{tabs[activeTab as number]?.props?.children}</div>
        </div>
    );
};
Tabs.displayName = COMPONENT_NAME;
