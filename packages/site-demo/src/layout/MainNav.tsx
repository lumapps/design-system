import { Callback } from '@lumx/react/utils';
import { castArray, isEmpty } from 'lodash';
import React, { ReactElement, ReactNode, useState } from 'react';
import { withRouter } from 'react-router-dom';

import { LumXLogo } from '@lumx/demo/assets/images';
import { Emphasis, SideNavigation, SideNavigationItem, SideNavigationItemProps } from '@lumx/react';

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
 * @return slug string.
 */
const spaceToSlug = (s: string): string => {
    return s.toLocaleLowerCase().replace(' ', '-');
};

/**
 * The navigation item tree.
 */
const ITEMS: Item[] = [
    {
        children: [
            {
                children: ['Colors', 'Typography'],
                label: 'Foundations',
            },
            {
                children: [
                    'Autocomplete',
                    'Avatar',
                    'Button',
                    'Checkbox',
                    'Chip',
                    'Comment block',
                    'Date picker',
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
                    'Slider',
                    'Slideshow',
                    'Switch',
                    'Table',
                    'Tabs',
                    'Text field',
                    'Thumbnail',
                    'Toolbar',
                    'Tooltip',
                    'Uploader',
                    'User block',
                ],
                label: 'Components',
            },
            {
                children: ['Stepper dialog'],
                label: 'Patterns',
            },
        ],
        label: 'Product',
    },
    {
        label: 'Brand',
    },
    {
        children: [
            {
                label: 'Site templates',
            },
        ],
        label: 'Partners',
    },
];

const EMPHASIS_BY_LEVEL = {
    '0': Emphasis.high,
    '1': Emphasis.medium,
    '2': Emphasis.low,
};

const generateNav = (goToHandler: (path: string) => Callback, location: string, items: Item[]): ReactNode => {
    const generateNavItem = (parent: string[], item?: Item | Item[]): ReactNode => {
        if (!item || Array.isArray(item)) {
            return castArray(item).map((child: Item) => generateNavItem(parent, child));
        }
        const label = typeof item === 'string' ? item : item.label;
        const children = typeof item !== 'string' && item.children;
        const path = [...parent, spaceToSlug(label)];
        const slug = `/${path.join('/')}`;

        const [isOpen, setOpen] = useState(() => location.startsWith(slug));

        const props: Partial<SideNavigationItemProps> = {
            emphasis: EMPHASIS_BY_LEVEL[parent.length],
            isOpen,
            isSelected: location === slug,
        };

        if (isEmpty(children)) {
            props.onClick = goToHandler(slug);
        } else {
            props.onClick = (): void => setOpen(!isOpen);
        }

        return (
            <SideNavigationItem key={slug} label={label} {...props}>
                {generateNavItem(path, children || []) as ReactElement}
            </SideNavigationItem>
        );
    };

    return <SideNavigation>{generateNavItem([], items) as ReactElement}</SideNavigation>;
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
    const goToHandler = (path: string) => () => history.push(path);

    return (
        <div className="main-nav">
            <div className="main-nav__wrapper">
                <div
                    className="main-nav__logo"
                    role="button"
                    tabIndex={0}
                    onClick={goToHandler('/')}
                    onKeyPress={goToHandler('/')}
                >
                    <img src={LumXLogo} alt="LumX" />
                    <span>
                        <strong>{'LumApps'}</strong>
                        {' design system'}
                    </span>
                </div>

                {generateNav(goToHandler, location.pathname, ITEMS)}
            </div>
        </div>
    );
};

const MainNavWithRouter = withRouter(MainNav);

export { MainNavWithRouter as MainNav };
