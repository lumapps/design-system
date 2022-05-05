import { graphql, useStaticQuery } from 'gatsby';
import map from 'lodash/map';
import keyBy from 'lodash/keyBy';
import partial from 'lodash/partial';
import { MenuEntry, MenuEntryByPath } from './types';

const query = graphql`
    query MenuQuery {
        allMenuEntry {
            edges {
                node {
                    path
                    label
                    hasDynamicChildren
                    children {
                        id
                    }
                }
            }
        }
    }
`;

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

export const useMenuItems = () => {
    const data = useStaticQuery(query);
    const entries = map(data.allMenuEntry.edges, 'node') as MenuEntry[];
    const menuEntryByPath = keyBy(entries, 'path') as MenuEntryByPath;
    const rootMenuEntries = getChildren(menuEntryByPath, menuEntryByPath['/']);

    return { rootMenuEntries, getChildren: partial(getChildren, menuEntryByPath) };
};
