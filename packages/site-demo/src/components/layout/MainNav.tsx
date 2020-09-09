import { Callback } from '@lumx/react/utils';
import castArray from 'lodash/castArray';
import isEmpty from 'lodash/isEmpty';
import React, { ReactElement, ReactNode, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import LumXLogo from '@lumx/demo/assets/images/logo.svg';
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
                children: ['Colors', 'Iconography', 'Typography'],
                label: 'Foundations',
            },
            {
                children: [
                    'Autocomplete',
                    'Avatar',
                    'Badge',
                    'Button',
                    'Checkbox',
                    'Chip',
                    'Comment block',
                    'Date picker',
                    'Dialog',
                    'Divider',
                    'Dropdown',
                    'Expansion panel',
                    'Grid',
                    'Image block',
                    'Lightbox',
                    'Link preview',
                    'List',
                    'Message',
                    'Notification',
                    'Notification block',
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
            {
                children: ['Colors'],
                label: 'Design Tokens',
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

const EMPHASIS_BY_LEVEL: Record<string, Emphasis> = {
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
        const slug = `/${path.join('/')}/`;

        const [isOpen, setOpen] = useState(() => location.startsWith(slug));

        const props: Partial<SideNavigationItemProps> = {
            emphasis: EMPHASIS_BY_LEVEL[parent.length.toString()],
            isOpen,
            isSelected: location === slug,
        };

        if (isEmpty(children)) {
            props.onClick = goToHandler(slug);
        } else {
            props.onClick = () => setOpen(!isOpen);
        }

        return (
            <SideNavigationItem key={slug} label={label} {...props}>
                {generateNavItem(path, children || []) as ReactElement}
            </SideNavigationItem>
        );
    };

    return <SideNavigation>{generateNavItem([], items) as ReactElement}</SideNavigation>;
};

/**
 * The main navigation component.
 *
 * @param  props nav props
 * @return The main navigation component.
 */
const MainNav: React.FC<RouteComponentProps> = (props) => {
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
                    <img src={LumXLogo} width="24px" height="24px" alt="LumX" />
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
