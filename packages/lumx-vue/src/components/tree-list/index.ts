import _TreeList from './TreeList';
import TreeListItem from './TreeListItem';
import TreeListSection from './TreeListSection';

export type { TreeListProps, SingleTreeListProps, MultipleTreeListProps } from './TreeList';
export type { TreeListItemProps } from './TreeListItem';
export type { TreeListSectionProps } from './TreeListSection';

/**
 * TreeList compound component: `TreeList.Item` is the tree item (also exported as `TreeListItem`), and
 * `TreeList.Section` a section of root tree items (also exported as `TreeListSection`).
 */
export const TreeList = Object.assign(_TreeList, {
    /** One tree item of the tree, with its sub-items. */
    Item: TreeListItem,
    /** A section of root tree items, with an optional label (a divider between the sections). */
    Section: TreeListSection,
});
export { TreeListItem, TreeListSection };
