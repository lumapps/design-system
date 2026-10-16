/**
 * Browser-only test stories for the TreeList (React).
 *
 * The other tree tests run in jsdom via TreeList.test.tsx.
 */
import { withValueOnChange } from '@lumx/react/stories/decorators/withValueOnChange';
import { setup } from '@lumx/core/js/components/TreeList/TestStories';

import { Combobox } from '../combobox';
import { TreeList, TreeListItem } from '.';

const { meta, ...testStories } = setup({
    components: { TreeList, TreeListItem, Combobox },
    decorators: { withValueOnChange },
});

export default {
    title: 'LumX components/tree-list/TreeList/Tests',
    ...meta,
};

export const ToggleClickKeepsFocus = { ...testStories.ToggleClickKeepsFocus };
export const ClickNonSelectableParentItemRow = { ...testStories.ClickNonSelectableParentItemRow };
export const FilterNoMatchHidesPopover = { ...testStories.FilterNoMatchHidesPopover };
export const AccessibilityOpenTree = { ...testStories.AccessibilityOpenTree };
export const AccessibilityLoadingGroup = { ...testStories.AccessibilityLoadingGroup };
export const StandaloneClickHidesFocusRing = { ...testStories.StandaloneClickHidesFocusRing };
export const AccessibilityStandaloneTree = { ...testStories.AccessibilityStandaloneTree };
