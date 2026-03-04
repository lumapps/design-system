import { mdiDotsHorizontal, mdiSend } from '@lumx/icons';
import { Avatar, Button, Icon, IconButton, List, ListItem, ListSubheader, Thumbnail } from '@lumx/react';

export default () => (
    <List>
        <ListSubheader>text only</ListSubheader>

        <ListItem>Single-line item</ListItem>

        <ListSubheader>rich</ListSubheader>

        <ListItem before={<Icon icon={mdiSend} size="xs" />}>Single-line item</ListItem>

        <ListItem
            before={<Thumbnail variant="rounded" alt="Thumbnail" image="https://picsum.photos/id/1/128/128" size="m" />}
            after={<IconButton label="More" emphasis="low" icon={mdiDotsHorizontal} />}
        >
            Single-line item
        </ListItem>

        <ListItem
            before={<Avatar image="https://i.pravatar.cc/128?img=32" alt="Avatar" size="m" />}
            after={<Button emphasis="low">Button</Button>}
        >
            Single-line item
        </ListItem>
    </List>
);
