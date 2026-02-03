import { graphql, useStaticQuery } from 'gatsby';
import map from 'lodash/map';
import keyBy from 'lodash/keyBy';
import partial from 'lodash/partial';

import { Framework, useFramework } from '@lumx/demo/components/layout/FrameworkContext';

import { MenuEntry, MenuEntryByPath } from './types';

const query = graphql`
    query MenuQuery {
        allMenuEntry {
            edges {
                node {
                    path
                    label
                    hasDynamicChildren
                    frameworks
                    children {
                        id
                    }
                }
            }
        }
    }
`;

function getChildren(
    menuEntryByPath: MenuEntryByPath,
    selectedFramework: Framework,
    menuEntry: MenuEntry,
): MenuEntry[] | null {
    if (menuEntry.children.length) {
        return menuEntry.children.map(({ id }) => menuEntryByPath[id]).filter(Boolean);
    }
    if (menuEntry.hasDynamicChildren) {
        const children = Object.keys(menuEntryByPath)
            // Find children paths of the current menu entry.
            .filter((childPath) => childPath.startsWith(menuEntry.path) && childPath !== menuEntry.path)
            // Get children menu entries.
            .map((path) => menuEntryByPath[path])
            // Sort dynamic children: matching framework first, then by label
            .sort((a, b) => {
                const aMatches = a.frameworks?.includes(selectedFramework);
                const bMatches = b.frameworks?.includes(selectedFramework);
                if (aMatches === bMatches) {
                    return a.label.localeCompare(b.label);
                }
                return aMatches ? -1 : 1;
            });
        return children.length ? children : null;
    }
    return null;
}

export const useMenuItems = () => {
    const { framework: selectedFramework } = useFramework();
    const data = useStaticQuery(query);
    const entries = map(data.allMenuEntry.edges, 'node') as MenuEntry[];

    const menuEntryByPath = keyBy(entries, 'path') as MenuEntryByPath;
    // Render children of /product/ at the root level instead of showing "Product" wrapper
    const productEntry = menuEntryByPath['/product/'];
    const rootMenuEntries = productEntry
        ? getChildren(menuEntryByPath, selectedFramework, productEntry)
        : getChildren(menuEntryByPath, selectedFramework, menuEntryByPath['/']);

    return { rootMenuEntries, getChildren: partial(getChildren, menuEntryByPath, selectedFramework) };
};
