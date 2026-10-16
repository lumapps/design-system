import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/TreeList/Stories';

import { Combobox } from '../combobox';
import { TreeList, TreeListItem } from '.';

const { meta, ...stories } = setup({
    components: { TreeList, TreeListItem, Combobox },
    decorators: { withValueOnChange },
});

export default {
    title: 'LumX components/tree-list/TreeList',
    ...meta,
};

export const TreeWithInput = { ...stories.TreeWithInput };
export const TreeInline = { ...stories.TreeInline };
export const TreeWithButton = { ...stories.TreeWithButton };
export const TreeWithMultipleSelection = { ...stories.TreeWithMultipleSelection };
export const TreeWithCategories = { ...stories.TreeWithCategories };
export const TreeWithLazyParentItem = { ...stories.TreeWithLazyParentItem };
export const StandaloneTree = { ...stories.StandaloneTree };
export const StandaloneTreeWithMultipleSelection = { ...stories.StandaloneTreeWithMultipleSelection };
