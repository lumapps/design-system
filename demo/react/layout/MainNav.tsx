import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { LumXLogo } from '../../assets/images';

/**
 * Defines the type of a navigation item.
 */
interface INavItem {
    /**
     * The label of the navigation item.
     */
    label: string;
    /**
     * The optional subnavigation items.
     */
    children?: INavItem[];
}

/**
 * The navigation item tree.
 */
const NAV_ITEMS: INavItem[] = [
    {
        label: 'Product',
        children: [
            {
                label: 'Foundations',
                children: [
                    {
                        label: 'Colors',
                    },
                    {
                        label: 'Typography',
                    },
                ],
            },
            {
                label: 'Components',
                children: [
                    {
                        label: 'Avatar',
                    },
                    {
                        label: 'Button',
                    },
                    {
                        label: 'Checkbox',
                    },
                    {
                        label: 'Chip',
                    },
                    {
                        label: 'Comment block',
                    },
                    {
                        label: 'Dialog',
                    },
                    {
                        label: 'Dropdown',
                    },
                    {
                        label: 'Expansion panel',
                    },
                    {
                        label: 'Image block',
                    },
                    {
                        label: 'Lightbox',
                    },
                    {
                        label: 'List',
                    },
                    {
                        label: 'Notification',
                    },
                    {
                        label: 'Popover',
                    },
                    {
                        label: 'Post block',
                    },
                    {
                        label: 'Progress',
                    },
                    {
                        label: 'Progress tracker',
                    },
                    {
                        label: 'Radio button',
                    },
                    {
                        label: 'Select',
                    },
                    {
                        label: 'Side navigation',
                    },
                    {
                        label: 'Slideshow',
                    },
                    {
                        label: 'Switch',
                    },
                    {
                        label: 'Table',
                    },
                    {
                        label: 'Tabs',
                    },
                    {
                        label: 'Text field',
                    },
                    {
                        label: 'Thumbnail',
                    },
                    {
                        label: 'Toolbar',
                    },
                    {
                        label: 'Tooltip',
                    },
                    {
                        label: 'User block',
                    },
                ],
            },
        ],
    },
    {
        label: 'Brand',
    },
    {
        label: 'Partners',
    },
];

const generateNav = (parentPath: string, navItems: INavItem[]): ReactElement => {
    return (
        <ul>
            {navItems.map(
                (navItem: INavItem): ReactElement => (
                    <li key={navItem.label}>
                        <Link to={`${parentPath}/${navItem.label.toLocaleLowerCase()}`}>{navItem.label}</Link>
                        {navItem.children &&
                            navItem.children.length > 0 &&
                            generateNav(`${parentPath}/${navItem.label.toLocaleLowerCase()}`, navItem.children)}
                    </li>
                ),
            )}
        </ul>
    );
};

/**
 * The main navigation component.
 *
 * @return The main navigation component.
 */
const MainNav: React.FC = (): ReactElement => (
    <div className="main-nav">
        <div className="main-nav__wrapper">
            <div className="main-nav__logo">
                <img src={LumXLogo} alt="LumX" />
                <span>
                    <strong>{'LumApps'}</strong>
                    {' design system'}
                </span>
            </div>

            {generateNav('', NAV_ITEMS)}
        </div>
    </div>
);

export { MainNav };
