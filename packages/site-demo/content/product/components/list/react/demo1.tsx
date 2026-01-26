import { mdiSend } from '@lumx/icons';
import { Avatar, Icon, List, ListItem, ListSubheader, Thumbnail } from '@lumx/react';

export default () => (
    <List>
        <ListSubheader>text only</ListSubheader>

        <ListItem size="tiny">Single-line item</ListItem>
        <ListItem size="tiny">Single-line item</ListItem>
        <ListItem size="tiny">Single-line item</ListItem>

        <ListSubheader>rich</ListSubheader>

        <ListItem size="tiny" before={<Icon icon={mdiSend} size="xs" />}>
            Single-line item
        </ListItem>

        <ListItem
            size="tiny"
            before={
                <Thumbnail variant="rounded" alt="Thumbnail" image="https://picsum.photos/id/1/128/128" size="xs" />
            }
        >
            Single-line item
        </ListItem>

        <ListItem size="tiny" before={<Avatar image="https://i.pravatar.cc/128?img=32" alt="Avatar" size="xs" />}>
            Single-line item
        </ListItem>
    </List>
);
