import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { setup } from '@lumx/core/js/components/List/ListDividerStories';

import { List } from '.';
import { ListDivider } from './ListDivider';

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
