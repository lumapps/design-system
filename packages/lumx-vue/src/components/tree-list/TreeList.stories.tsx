import { withValueOnChange } from '@lumx/vue/stories/decorators/withValueOnChange';
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

export const Standalone = { ...stories.Standalone };
export const StandaloneMultipleSelection = { ...stories.StandaloneMultipleSelection };
export const InComboboxInput = { ...stories.InComboboxInput };
export const InComboboxInline = { ...stories.InComboboxInline };
export const InComboboxButton = { ...stories.InComboboxButton };
export const InComboboxMultipleSelection = { ...stories.InComboboxMultipleSelection };
export const LazyParentItem = { ...stories.LazyParentItem };
