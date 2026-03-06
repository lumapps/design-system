import { Button, FlexBox, IconButton, Text, Thumbnail } from '@lumx/react';
import { withWrapper } from '@lumx/react/stories/decorators/withWrapper';
import { withCombinations } from '@lumx/react/stories/decorators/withCombinations';
import { CustomLink } from '@lumx/react/stories/utils/CustomLink';
import { setup } from '@lumx/core/js/components/List/ListItemStories';

import { List } from './List';
import { ListItem } from './ListItem';
import { ListItemAction } from './ListItemAction';

const { meta, ...stories } = setup({
    component: ListItem,
    components: { List, ListItemAction, Button, IconButton, Text, FlexBox, Thumbnail },
    decorators: { withWrapper, withCombinations },
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
