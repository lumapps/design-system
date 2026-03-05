import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { setup } from '@lumx/core/js/components/List/ListStories';

import { List, ListItem } from '.';

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
