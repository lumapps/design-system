import React, { Children, ReactElement, ReactNode, cloneElement } from 'react';

import classNames from 'classnames';

import { TabProps, Theme } from '@lumx/react';
import { COMPONENT_PREFIX, CSS_PREFIX } from '@lumx/react/constants';
import { GenericProps, getRootClassName, handleBasicClasses } from '@lumx/react/utils';

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
interface TabsProps extends GenericProps {
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

/////////////////////////////

/**
 * Define the types of the default props.
 */
interface DefaultPropsType extends Partial<TabsProps> {}

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
const DEFAULT_PROPS: DefaultPropsType = {
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
    useCustomColors,
    ...props
}: TabsProps): ReactElement => {
    const tabs: ReactElement[] = Children.map(children as ReactElement[], (tab: ReactElement, index: number) => {
        return cloneElement(tab, { key: index, index, isActive: activeTab === index, onTabClick });
    });

    return (
        <div
            className={classNames(className, handleBasicClasses({ prefix: CLASSNAME, layout, position, theme }), {
                [`${CSS_PREFIX}-custom-colors`]: useCustomColors,
            })}
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
