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
            before={<Thumbnail variant="rounded" alt="Thumbnail" image="/demo-assets/square1.jpg" size="xs" />}
        >
            Single-line item
        </ListItem>

        <ListItem size="tiny" before={<Avatar image="/demo-assets/persona.png" alt="Avatar" size="xs" />}>
            Single-line item
        </ListItem>
    </List>
);
