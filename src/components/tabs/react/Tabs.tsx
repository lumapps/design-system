import React, { Children, ReactElement, cloneElement } from 'react';

import classNames from 'classnames';

import { Tab, Theme } from 'LumX';
import { COMPONENT_PREFIX } from 'LumX/core/react/constants';
import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

/////////////////////////////

enum TabsLayout {
    clustered = 'clustered',
    fixed = 'fixed',
}

enum TabsPosition {
    center = 'center',
    left = 'left',
    right = 'right',
}

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface ITabsProps extends IGenericProps {
    /* Active tab */
    activeTab?: number;
    /* Component tabs */
    children: Tab[];
    /* Tabs Layout */
    layout?: TabsLayout;
    /* Function to trigger on tab click */
    onTabClick: CallableFunction;
    /* Tabs Position */
    position?: TabsPosition;
    /* Component theme */
    theme?: Theme;
}
type TabsProps = ITabsProps;

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface IDefaultPropsType extends Partial<TabsProps> {}

/////////////////////////////
//                         //
//    Public attributes    //
//                         //
/////////////////////////////

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
const DEFAULT_PROPS: IDefaultPropsType = {
    activeTab: 0,
    children: [],
    layout: TabsLayout.fixed,
    position: TabsPosition.left,
    theme: Theme.light,
};

/////////////////////////////

/**
 * Defines a Tabs component.
 *
 * @return The component.
 */
const Tabs: React.FC<TabsProps> = ({
    activeTab = DEFAULT_PROPS.activeTab,
    children,
    className = '',
    layout = DEFAULT_PROPS.layout,
    onTabClick,
    position = DEFAULT_PROPS.position,
    theme = DEFAULT_PROPS.theme,
    ...props
}: TabsProps): ReactElement => {
    const tabs: Tab[] = Children.map(children, (tab: Tab, index: number) => {
        return cloneElement(tab, { key: index, index, isActive: activeTab === index, onTabClick });
    });

    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, layout, position, theme }))}
            {...props}
        >
            <div className={`${CLASSNAME}__links`}>{tabs}</div>

            <div className={`${CLASSNAME}__panes`}>{tabs[activeTab!].props.children}</div>
        </div>
    );
};
Tabs.displayName = COMPONENT_NAME;

/////////////////////////////

export { CLASSNAME, DEFAULT_PROPS, Tabs, TabsProps, TabsLayout, TabsPosition };
