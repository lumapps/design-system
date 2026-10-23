import _TreeList from './TreeList';
import TreeListItem from './TreeListItem';

export type { TreeListProps, SingleTreeListProps, MultipleTreeListProps } from './TreeList';
export type { TreeListItemProps } from './TreeListItem';

/**
 * TreeList compound component: `TreeList.Item` is the tree item (also exported as `TreeListItem`).
 */
export const TreeList = Object.assign(_TreeList, {
    /** One tree item of the tree, with its sub-items. */
    Item: TreeListItem,
});
export { TreeListItem };
