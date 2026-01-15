import { mdiDotsHorizontal, mdiSend } from '@lumx/icons';
import { Avatar, Button, Icon, IconButton, List, ListItem, ListSubheader, Thumbnail } from '@lumx/react';

export default () => (
    <List>
        <ListSubheader>text only</ListSubheader>

        <ListItem>Single-line item</ListItem>

        <ListSubheader>rich</ListSubheader>

        <ListItem before={<Icon icon={mdiSend} size="xs" />}>Single-line item</ListItem>

        <ListItem
            before={<Thumbnail variant="rounded" alt="Thumbnail" image="/demo-assets/square1.jpg" size="m" />}
            after={<IconButton label="More" emphasis="low" icon={mdiDotsHorizontal} />}
        >
            Single-line item
        </ListItem>

        <ListItem
            before={<Avatar image="/demo-assets/persona.png" alt="Avatar" size="m" />}
            after={<Button emphasis="low">Button</Button>}
        >
            Single-line item
        </ListItem>
    </List>
);
