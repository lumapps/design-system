import { getSelectArgType } from '@lumx/core/stories/controls/selectArgType';
import type { SetupStoriesOptions } from '@lumx/core/stories/types';
import { Size } from '../../constants';

const ITEM_PADDING_OPTIONS = [undefined, Size.big, Size.huge];

/**
 * Setup List stories for a specific framework (React or Vue).
 * Framework-specific components are injected via `components`.
 */
export function setup({
    component: List,
    components: { ListItem },
    decorators: { withCombinations },
}: SetupStoriesOptions<{
    decorators: 'withCombinations';
    components: { ListItem: any };
}>) {
    const meta = {
        component: List,
        render: (args: any) => (
            <List {...args}>
                <ListItem>List item 1</ListItem>
                <ListItem>List item 2</ListItem>
            </List>
        ),
        argTypes: {
            itemPadding: getSelectArgType(ITEM_PADDING_OPTIONS),
        },
    };

    /** Default list with 2 items */
    const Default = {};

    /** All `itemPadding` variants */
    const ItemPadding = {
        argTypes: { itemPadding: { control: false } },
        decorators: [
            withCombinations({
                combinations: {
                    cols: { key: 'itemPadding', options: ITEM_PADDING_OPTIONS },
                },
            }),
        ],
    };

    return { meta, Default, ItemPadding };
}
