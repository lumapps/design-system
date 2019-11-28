import React from 'react';

import {
    Avatar,
    Button,
    ButtonEmphasis,
    Icon,
    IconButton,
    List,
    ListItem,
    ListSubheader,
    Size,
    Thumbnail,
    ThumbnailVariant,
} from '@lumx/react';

import { mdiDotsHorizontal, mdiSend } from '@lumx/icons';

const App = () => (
    <>
        <List>
            <ListSubheader>text only</ListSubheader>

            <ListItem size={Size.big}>
                <div>
                    <span>Two-line item</span>
                </div>

                <div>
                    <span className="lumx-theme-color-dark-L2">Secondary text</span>
                </div>
            </ListItem>

            <ListSubheader>rich</ListSubheader>

            <ListItem size={Size.big} before={<Icon icon={mdiSend} size={Size.xs} />}>
                <div>
                    <span>Two-line item</span>
                </div>

                <div>
                    <span className="lumx-theme-color-dark-L2">Secondary text</span>
                </div>
            </ListItem>

            <ListItem
                size={Size.big}
                before={<Thumbnail variant={ThumbnailVariant.rounded} image="https://picsum.photos/72" size={Size.m} />}
                after={<IconButton emphasis={ButtonEmphasis.low} icon={mdiDotsHorizontal} />}
            >
                <div>
                    <span>Two-line item</span>
                </div>

                <div>
                    <span className="lumx-theme-color-dark-L2">Secondary text</span>
                </div>
            </ListItem>

            <ListItem
                size={Size.big}
                before={<Avatar image="http://i.pravatar.cc/72" size={Size.m} />}
                after={<Button emphasis={ButtonEmphasis.low}>Button</Button>}
            >
                <div>
                    <span>Two-line item</span>
                </div>

                <div>
                    <span className="lumx-theme-color-dark-L2">Secondary text</span>
                </div>
            </ListItem>
        </List>
    </>
);

export default App;
