import React from 'react';

import { SubNavItem } from './SubNavItem';
import { ThemeSelector } from './ThemeSelector';

interface IProps {
    activeComponent?: string;
    changeTheme: (theme: string) => void;
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

export const SubNav = ({ activeComponent, changeTheme, handleNavigate }: IProps): JSX.Element => (
    <div className="sub-nav">
        <div className="sub-nav__wrapper">
            <ThemeSelector changeTheme={changeTheme} />

            {/* <LxDivider /> */}

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
