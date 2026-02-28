import { FlexBox, List, ListDivider, ListItem } from '@lumx/react';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/List/ListSectionStories';
import { ListSection } from './ListSection';

const { meta, ...stories } = setup({
    component: ListSection,
    components: { List, ListItem, ListDivider, FlexBox },
    decorators: { withWrapper },
});

export default {
    title: 'LumX components/list/ListSection',
    ...meta,
};

export const Default = { ...stories.Default };
export const AutoDividerEdgeCases = { ...stories.AutoDividerEdgeCases };
export const LabelVariants = { ...stories.LabelVariants };
export const ClickableItems = { ...stories.ClickableItems };
