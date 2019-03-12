import React from 'react';

import { SubNavItem } from './SubNavItem';

interface IProps {
    activeComponent?: string;
    handleNavigate: (component: string) => void;
}

const NAV_ITEMS: string[] = [
    'Button',
    'Checkbox',
    'Chip',
    'Data table',
    'Dialog',
    'Dropdown',
    'Expansion panel',
    'Image block',
    'List',
    'Notification',
    'Progress',
    'Progress tracker',
    'Radio button',
    'Select',
    'Switch',
    'Tabs',
    'Text field',
    'Toolbar',
    'Tooltip',
];

export const SubNav = ({ activeComponent, handleNavigate }: IProps): JSX.Element => (
    <div className="sub-nav">
        <div className="sub-nav__wrapper">
            {NAV_ITEMS.map(
                (navItemLabel: string): JSX.Element => (
                    <SubNavItem key={navItemLabel} handleClick={handleNavigate} activeComponent={activeComponent}>
                        {navItemLabel}
                    </SubNavItem>
                ),
            )}
        </div>
    </div>
);
