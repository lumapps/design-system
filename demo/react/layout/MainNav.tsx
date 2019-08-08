import { Emphasis, SideNavigation, SideNavigationItem, SideNavigationItemProps } from 'LumX';
import { LumXLogo } from 'LumX/demo/assets/images';
import { castArray, isEmpty } from 'lodash';
import React, { ReactElement, ReactNode, useState } from 'react';
import { withRouter } from 'react-router-dom';

/**
 * Defines the type of a navigation item.
 */
type Item =
    | {
          /**
           * The label of the navigation item.
           */
          label: string;
          /**
           * The optional subnavigation items.
           */
          children?: Item[];
      }
    | string;

/**
 * Transform space separated string to a slug.
 * @param  s a string
 * @return slug string
 */
const spaceToSlug = (s: string): string => {
    return s.toLocaleLowerCase().replace(' ', '-');
};

/**
 * The navigation item tree.
 */
const ITEMS: Item[] = [
    {
        label: 'Product',
        children: [
            {
                label: 'Foundations',
                children: ['Colors', 'Typography'],
            },
            {
                label: 'Components',
                children: [
                    'Avatar',
                    'Button',
                    'Checkbox',
                    'Chip',
                    'Comment block',
                    'Dialog',
                    'Dropdown',
                    'Expansion panel',
                    'Image block',
                    'Lightbox',
                    'List',
                    'Notification',
                    'Popover',
                    'Post block',
                    'Progress',
                    'Progress tracker',
                    'Radio button',
                    'Select',
                    'Side navigation',
                    'Slideshow',
                    'Switch',
                    'Table',
                    'Tabs',
                    'Text field',
                    'Thumbnail',
                    'Toolbar',
                    'Tooltip',
                    'User block',
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
    const generateNavItem = (parent: string[], item?: Item | Item[]): ReactNode => {
        if (!item || Array.isArray(item)) {
            return castArray(item).map((child: Item) => generateNavItem(parent, child));
        }
        const label = typeof item === 'string' ? item : item.label;
        const children = typeof item !== 'string' && item.children;
        const path = [...parent, spaceToSlug(label)];
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
                {generateNavItem(path, children || [])}
            </SideNavigationItem>
        );
    };

    return <SideNavigation>{generateNavItem([], items)}</SideNavigation>;
};

interface IWithRouterProps {
    location: { pathname: string };
    history: { push(path: string): void };
}

/**
 * The main navigation component.
 *
 * @param  props nav props
 * @return The main navigation component.
 */
const MainNav: React.FC<IWithRouterProps> = (props: IWithRouterProps): ReactElement => {
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
};

const MainNavWithRouter = withRouter(MainNav);

export { MainNavWithRouter as MainNav };
