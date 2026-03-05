import { List, ListDivider } from '@lumx/vue';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/List/ListDividerStories';

const { meta, ...stories } = setup({
    component: ListDivider,
    components: { List },
    decorators: { withWrapper },
});

export default {
    title: 'LumX components/list/ListDivider',
    ...meta,
};

export const Default = { ...stories.Default };
