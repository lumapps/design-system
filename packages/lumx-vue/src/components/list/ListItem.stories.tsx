import { Button, FlexBox, IconButton, Text, Thumbnail } from '@lumx/vue';
import { withWrapper } from '@lumx/vue/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/vue/stories/decorators/withCombinations';
import CustomLink from '@lumx/vue/stories/utils/CustomLink.vue';
import { setup } from '@lumx/core/js/components/List/ListItemStories';

import List from './List';
import ListItem from './ListItem';
import ListItemAction from './ListItemAction';

const { meta, ...stories } = setup({
    component: ListItem,
    components: { List, ListItemAction, Button, IconButton, Text, FlexBox, Thumbnail },
    decorators: { withWrapper, withCombinations },
    render: ({ children, before, after, ...args }: any) => (
        <ListItem {...args}>
            {{
                default: () => children,
                before: before ? () => before : undefined,
                after: after ? () => after : undefined,
            }}
        </ListItem>
    ),
});

export default {
    title: 'LumX components/list/ListItem',
    ...meta,
};

export const Default = { ...stories.Default };
export const AllStates = { ...stories.AllStates };
export const ActionArea = { ...stories.ActionArea };

/** Inject a custom link component */
export const CustomLink_ = {
    args: {
        linkAs: CustomLink,
        children: 'List item custom link',
    },
    decorators: [withWrapper({}, List)],
};
