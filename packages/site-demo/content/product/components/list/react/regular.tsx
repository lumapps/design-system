import { mdiDotsHorizontal, mdiSend } from '@lumx/icons';

import {
    Avatar,
    Button,
    Emphasis,
    Icon,
    IconButton,
    List,
    ListItem,
    ListSubheader,
    Size,
    Thumbnail,
    ThumbnailVariant,
} from '@lumx/react';

export const App = () => (
    <List>
        <ListSubheader>text only</ListSubheader>

        <ListItem>Single-line item</ListItem>

        <ListSubheader>rich</ListSubheader>

        <ListItem before={<Icon icon={mdiSend} size={Size.xs} />}>Single-line item</ListItem>

        <ListItem
            before={
                <Thumbnail
                    variant={ThumbnailVariant.rounded}
                    alt="Thumbnail"
                    image="/demo-assets/square1.jpg"
                    size={Size.m}
                />
            }
            after={<IconButton label="More" emphasis={Emphasis.low} icon={mdiDotsHorizontal} />}
        >
            Single-line item
        </ListItem>

        <ListItem
            before={<Avatar image="/demo-assets/persona.png" alt="Avatar" size={Size.m} />}
            after={<Button emphasis={Emphasis.low}>Button</Button>}
        >
            Single-line item
        </ListItem>
    </List>
);
