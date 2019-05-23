import React, { Children, ReactElement, cloneElement } from 'react';

import classNames from 'classnames';

import { Theme, Themes } from 'LumX/components';

import { COMPONENT_PREFIX } from 'LumX/core/react/constants';

import { IGenericProps, getRootClassName } from 'LumX/core/react/utils';
import { handleBasicClasses } from 'LumX/core/utils';

import { Tab } from 'LumX/components/tabs/react/Tab';

/////////////////////////////

const enum Layouts {
    clustered = 'clustered',
    fixed = 'fixed',
}
type Layout = Layouts;

const enum Positions {
    center = 'center',
    left = 'left',
    right = 'right',
}
type Position = Positions;

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
    layout?: Layout;
    /* Function to trigger on tab click */
    onTabClick: CallableFunction;
    /* Tabs Position */
    position?: Position;
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
 *
 * @type {string}
 * @constant
 * @readonly
 */
const COMPONENT_NAME: string = `${COMPONENT_PREFIX}Tabs`;

/**
 * The default class name and classes prefix for this component.
 *
 * @type {string}
 * @constant
 * @readonly
 */
const CLASSNAME: string = getRootClassName(COMPONENT_NAME);

/**
 * The default value of props.
 *
 * @type {IDefaultPropsType}
 * @constant
 * @readonly
 */
const DEFAULT_PROPS: IDefaultPropsType = {
    activeTab: 0,
    children: [],
    layout: Layouts.fixed,
    position: Positions.left,
    theme: Themes.light,
};

/////////////////////////////

/**
 * Defines a Tabs component.
 *
 * @return {React.ReactElement} The component.
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

export { CLASSNAME, DEFAULT_PROPS, Layouts, Positions, Tabs, TabsProps, Theme, Themes };
