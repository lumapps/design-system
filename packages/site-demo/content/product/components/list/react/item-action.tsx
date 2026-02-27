import { mdiDotsHorizontal } from '@lumx/icons';
import { Avatar, IconButton, List, ListItem, Text } from '@lumx/react';

export default () => (
    <List itemPadding="big">
        <ListItem
            before={<Avatar image="https://i.pravatar.cc/128?img=32" alt="Avatar" size="m" />}
            after={<IconButton label="More" emphasis="low" icon={mdiDotsHorizontal} />}
        >
            <ListItem.Action as="a" href="https://example.com">
                Clickable list item via action area
            </ListItem.Action>
            <Text as="p" color="dark" colorVariant="L2">
                The entire list item is clickable, but the icon button remains independently clickable.
            </Text>
        </ListItem>

        <ListItem before={<Avatar image="https://i.pravatar.cc/128?img=45" alt="Avatar" size="m" />}>
            <ListItem.Action onClick={() => {}}>Clickable list item with button action</ListItem.Action>
            <Text as="p" color="dark" colorVariant="L2">
                Uses a button as the primary action.
            </Text>
        </ListItem>
    </List>
);
