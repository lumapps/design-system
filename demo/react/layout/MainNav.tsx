import React, { ReactElement, ReactNode, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { Emphasis, SideNavigation, SideNavigationItem, SideNavigationItemProps } from 'LumX';
import { isEmpty } from 'lodash';
import { LumXLogo } from '../../assets/images';

/**
 * Defines the type of a navigation item.
 */
interface Item {
    /**
     * The label of the navigation item.
     */
    label: string;
    /**
     * The optional subnavigation items.
     */
    children?: Item[];
}

/**
 * The navigation item tree.
 */
const ITEMS: Item[] = [
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

const EMPHASIS_BY_LEVEL = {
    '0': Emphasis.high,
    '1': Emphasis.medium,
    '2': Emphasis.low,
};

const generateNav = (goTo: (path: string) => void, location: string, items: Item[]): ReactElement => {
    const generateNavItem = (parent: string[], { label, children }: Item): ReactNode => {
        const path = [...parent, label.toLocaleLowerCase().replace(/ /g, '-')];
        const slug = '/' + path.join('/');

        const [isOpen, setOpen] = useState(() => location.startsWith(slug));

        const props: Partial<SideNavigationItemProps> = {
            emphasis: EMPHASIS_BY_LEVEL[parent.length],
            isSelected: location === slug,
            isOpen,
        };

        if (isEmpty(children)) {
            props.onClick = (): void => goTo(slug);
        } else {
            props.onClick = (): void => setOpen(!isOpen);
        }

        return (
            <SideNavigationItem key={slug} label={label} {...props}>
                {(children || []).map((item: Item) => generateNavItem(path, item))}
            </SideNavigationItem>
        );
    };

    return <SideNavigation>{items.map((item: Item) => generateNavItem([], item))}</SideNavigation>;
};

interface IWithRouterProps {
    location: any;
    match: any;
    history: any;
}

/**
 * The main navigation component.
 *
 * @return The main navigation component.
 */
const MainNav: React.FC<IWithRouterProps> = withRouter(
    (props: IWithRouterProps): ReactElement => {
        const { location, history } = props;
        const goTo = (path: string): void => history.push(path);

        return (
            <div className="main-nav">
                <div className="main-nav__wrapper">
                    <div className="main-nav__logo">
                        <img src={LumXLogo} alt="LumX" />
                        <span>
                            <strong>{'LumApps'}</strong>
                            {' design system'}
                        </span>
                    </div>

                    {generateNav(goTo, location.pathname, ITEMS)}
                </div>
            </div>
        );
    },
);

export { MainNav };
