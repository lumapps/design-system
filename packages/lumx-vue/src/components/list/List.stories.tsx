import { List, ListItem } from '@lumx/vue';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/List/ListStories';

const { meta, ...stories } = setup({
    component: List,
    components: { ListItem },
    decorators: { withCombinations },
});

export default {
    title: 'LumX components/list/List',
    ...meta,
};

export const Default = { ...stories.Default };
export const ItemPadding = { ...stories.ItemPadding };
