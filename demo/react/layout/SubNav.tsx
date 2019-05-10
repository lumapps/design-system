import React from 'react';

import { Theme } from 'LumX/demo/constants';

import { SubNavItem } from './SubNavItem';
import { ThemeSelector } from './ThemeSelector';

/////////////////////////////

/**
 * Defines the props of the component.
 */
interface IProps {
    /**
     * The active component.
     * This will help to highlight the sub navigation item corresponding to the active component.
     */
    activeComponent?: string;

    /**
     * The function to change the theme.
     * When the theme selector is used, this function is called to update the current theme.
     */
    changeTheme(theme: Theme): void;

    /**
     * The function to handle the change of the active component.
     * When a sub navigation item is clicked, this function is called to change the active component.
     */
    handleNavigate(component: string): void;
}

/////////////////////////////

/**
 * The list of all sub nav items displayed in the sub navigation.
 * Each item correspond to a component.
 *
 * @type {Array<string>}
 * @constant
 * @readonly
 */
const NAV_ITEMS: string[] = [
    'Button',
    'Checkbox',
    'Chip',
    'Data table',
    'Dialog',
    'Dropdown',
    'Expansion panel',
    'Image block',
    'Lightbox',
    'List',
    'Notification',
    'Popover',
    'Progress',
    'Progress tracker',
    'Radio button',
    'Select',
    'Slideshow',
    'Switch',
    'Tabs',
    'Text field',
    'Thumbnail',
    'Toolbar',
    'Tooltip',
    'User Block',
];

/////////////////////////////

/**
 * The sub navigation component.
 * This component will display the navigation bar for selecting the component the user wants the demo of.
 * It will also display the theme selector to switch the theme of both the demo site and the components in the demo.
 *
 * @return {React.ReactElement} The sub navigation component.
 */
const SubNav: React.FC<IProps> = ({ activeComponent, changeTheme, handleNavigate }: IProps): React.ReactElement => (
    <div className="sub-nav">
        <ul className="sub-nav__wrapper ph++ pv+">
            <li>
                <ThemeSelector changeTheme={changeTheme} />
            </li>
        </ul>

        <ul className="sub-nav__wrapper ph+ pb+">
            <li className="sub-nav__subheader">Foundations</li>

            <li className="sub-nav__item">
                <a className="sub-nav__link">Colors</a>
            </li>
            <li className="sub-nav__item">
                <a className="sub-nav__link">Typography</a>
            </li>

            <li className="sub-nav__subheader">Components</li>

            {NAV_ITEMS.map(
                (navItemLabel: string): React.ReactNode => (
                    <SubNavItem key={navItemLabel} handleClick={handleNavigate} activeComponent={activeComponent}>
                        {navItemLabel}
                    </SubNavItem>
                ),
            )}
        </ul>
    </div>
);

/////////////////////////////

export { SubNav };
