import { mdiSend } from '@lumx/icons';

import { Avatar, Icon, List, ListItem, ListSubheader, Size, Thumbnail, ThumbnailVariant } from '@lumx/react';

export const App = () => (
    <List>
        <ListSubheader>text only</ListSubheader>

        <ListItem size={Size.tiny}>Single-line item</ListItem>
        <ListItem size={Size.tiny}>Single-line item</ListItem>
        <ListItem size={Size.tiny}>Single-line item</ListItem>

        <ListSubheader>rich</ListSubheader>

        <ListItem size={Size.tiny} before={<Icon icon={mdiSend} size={Size.xs} />}>
            Single-line item
        </ListItem>

        <ListItem
            size={Size.tiny}
            before={
                <Thumbnail
                    variant={ThumbnailVariant.rounded}
                    alt="Thumbnail"
                    image="/demo-assets/square1.jpg"
                    size={Size.xs}
                />
            }
        >
            Single-line item
        </ListItem>

        <ListItem size={Size.tiny} before={<Avatar image="/demo-assets/persona.png" alt="Avatar" size={Size.xs} />}>
            Single-line item
        </ListItem>
    </List>
);
