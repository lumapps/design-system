import kebabCase from 'lodash/kebabCase';
import React, { ReactNode, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import LumXLogo from '@lumx/demo/assets/images/logo.svg';
import { Emphasis, SideNavigation, SideNavigationItem, SideNavigationItemProps } from '@lumx/react';

import ITEMS from 'content/menu.yml';

/**
 * Defines the type of a navigation item.
 */
type Item = Record<string, Item[]> | string;

function getLabelAndChildren(item: Item) {
    return typeof item === 'string' ? [item] : Object.entries(item)[0];
}

const EMPHASIS_BY_LEVEL: Record<string, Emphasis> = {
    '0': Emphasis.high,
    '1': Emphasis.medium,
    '2': Emphasis.low,
};

const generateNav = (locationPath: string, items: Item[]): ReactNode => {
    const generateNavItem = (parentPathParts: string[], item: Item | Item[]): ReactNode => {
        if (Array.isArray(item)) {
            return item.map((child) => generateNavItem(parentPathParts, child));
        }
        const [label, children] = getLabelAndChildren(item);
        const pathParts = [...parentPathParts, kebabCase(label)];
        const path = pathParts.join('/');

        const [isOpen, setOpen] = useState(() => locationPath.startsWith(path));

        const props: SideNavigationItemProps = {
            emphasis: EMPHASIS_BY_LEVEL[parentPathParts.length.toString()],
            isOpen,
            isSelected: locationPath === path,
            label,
            key: path,
        };

        if (!children) {
            // Menu using react router Link.
            props.linkAs = Link;
            props.linkProps = { to: '/' + path } as any;
        } else {
            // Toggle open child navigation.
            props.onClick = () => setOpen(!isOpen);
            props.children = generateNavItem(pathParts, children);
        }

        return <SideNavigationItem {...props} />;
    };

    return <SideNavigation>{generateNavItem([], items)}</SideNavigation>;
};

/**
 * The main navigation component.
 *
 * @return The main navigation component.
 */
export const MainNav: React.FC = () => {
    const { path = '' } = useParams();

    return (
        <div className="main-nav">
            <div className="main-nav__wrapper">
                <Link className="main-nav__logo" to="/">
                    <img src={LumXLogo} width="24px" height="24px" alt="LumX" />
                    <span>
                        <strong>{'LumApps'}</strong>
                        {' design system'}
                    </span>
                </Link>

                {generateNav(path, ITEMS)}
            </div>
        </div>
    );
};
