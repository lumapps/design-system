import { Emphasis, SideNavigation, SideNavigationItem, SideNavigationItemProps } from '@lumx/react';
import { Link, graphql, useStaticQuery } from 'gatsby';
import includes from 'lodash/includes';
import keyBy from 'lodash/keyBy';
import map from 'lodash/map';
import partial from 'lodash/partial';
import without from 'lodash/without';
import React, { useState } from 'react';

import LumXLogo from '@lumx/demo/assets/images/logo.svg';

const query = graphql`
    query MenuQuery {
        allMenuEntry {
            edges {
                node {
                    path
                    label
                    isRoot
                    hasDynamicChildren
                    children {
                        id
                    }
                }
            }
        }
    }
`;

interface MenuEntry {
    path: string;
    label: string;
    isRoot: boolean;
    hasDynamicChildren: boolean;
    children: Array<{ id: string }>;
}

type MenuEntryByPath = Record<string, MenuEntry>;

const useMenuItems = () => {
    const data = useStaticQuery(query);
    const entries = map(data.allMenuEntry.edges, 'node') as MenuEntry[];
    const menuEntryByPath = keyBy(entries, 'path') as MenuEntryByPath;
    const rootMenuEntries = entries.filter((menuEntry) => menuEntry.isRoot);

    return { rootMenuEntries, menuEntryByPath };
};

const EMPHASIS_BY_LEVEL: Record<string, Emphasis> = {
    '1': Emphasis.high,
    '2': Emphasis.medium,
    '3': Emphasis.low,
};

function getChildren(menuEntryByPath: MenuEntryByPath, menuEntry: MenuEntry): MenuEntry[] | null {
    if (menuEntry.children.length) {
        return menuEntry.children.map(({ id }) => menuEntryByPath[id]);
    }
    if (menuEntry.hasDynamicChildren) {
        const children = Object.keys(menuEntryByPath)
            // Find children paths of the current menu entry.
            .filter((childPath) => childPath.startsWith(menuEntry.path) && childPath !== menuEntry.path)
            // Get children menu entries.
            .map((path) => menuEntryByPath[path])
            // Sort by label.
            .sort(({ label: labelA }, { label: labelB }) => labelA.localeCompare(labelB));
        return children.length ? children : null;
    }
    return null;
}

const renderNavItem = (
    openPaths: string[],
    toggleOpenPath: (path: string) => void,
    menuEntryByPath: MenuEntryByPath,
    locationPath: string,
    menuEntry: MenuEntry,
) => {
    const { label, path } = menuEntry;
    const children = getChildren(menuEntryByPath, menuEntry);
    const level = path.split('/').length - 2;
    const props: SideNavigationItemProps = {
        label,
        emphasis: EMPHASIS_BY_LEVEL[level],
        isOpen: includes(openPaths, path),
        isSelected: locationPath === path,
    };

    if (!children?.length) {
        // Menu using router Link.
        props.linkAs = Link;
        props.linkProps = { to: path } as any;
    } else {
        props.onClick = partial(toggleOpenPath, path);
        props.children = children.map(partial(renderNavItem, openPaths, toggleOpenPath, menuEntryByPath, locationPath));
    }

    return <SideNavigationItem key={path} label={label} {...props} />;
};

const getParentPaths = (path: string) => {
    let parentPath = path;
    const parentPaths: string[] = [];
    do {
        parentPaths.push((parentPath = parentPath.replace(/[^\/]*\/?$/, '')));
    } while (parentPath.length > 1);
    return parentPaths;
};

/**
 * The main navigation component.
 *
 * @param  props nav props
 * @return The main navigation component.
 */
export const MainNav: React.FC<{ location?: Location }> = ({ location }) => {
    const locationPath = location?.pathname || '';
    const { rootMenuEntries, menuEntryByPath } = useMenuItems();

    // List of path opened in the menu.
    const [openPaths, setOpenPaths] = useState<string[]>(() => getParentPaths(locationPath));
    const toggleOpenPath = (path: string) => {
        if (includes(openPaths, path)) {
            setOpenPaths(without(openPaths, path));
        } else {
            setOpenPaths([...openPaths, path]);
        }
    };

    return (
        <nav className="main-nav">
            <div className="main-nav__wrapper">
                <Link className="main-nav__logo" to="/">
                    <img src={LumXLogo} width="24px" height="24px" alt="LumX" />
                    <span>
                        <strong>{'LumApps'}</strong>
                        {' design system'}
                    </span>
                </Link>

                <SideNavigation>
                    {rootMenuEntries.map(
                        partial(renderNavItem, openPaths, toggleOpenPath, menuEntryByPath, locationPath),
                    )}
                </SideNavigation>
            </div>
        </nav>
    );
};
