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
import React from 'react';

const App = () => (
    <List>
        <ListSubheader>text only</ListSubheader>

        <ListItem>Single-line item</ListItem>

        <ListSubheader>rich</ListSubheader>

        <ListItem before={<Icon icon={mdiSend} size={Size.xs}/>}>Single-line item</ListItem>

        <ListItem
            before={<Thumbnail variant={ThumbnailVariant.rounded} image="https://picsum.photos/72" size={Size.m}/>}
            after={<IconButton emphasis={Emphasis.low} icon={mdiDotsHorizontal}/>}
        >
            Single-line item
        </ListItem>

        <ListItem
            before={<Avatar image="../avatar/assets/persona.png" size={Size.m}/>}
            after={<Button emphasis={Emphasis.low}>Button</Button>}
        >
            Single-line item
        </ListItem>
    </List>
);

export default App;
