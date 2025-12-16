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

        <ListItem size={Size.big}>
            <div>
                <span>Two-line item</span>
            </div>

            <div>
                <span className="lumx-color-font-dark-L2">Secondary text</span>
            </div>
        </ListItem>

        <ListSubheader>rich</ListSubheader>

        <ListItem size={Size.big} before={<Icon icon={mdiSend} size={Size.xs} />}>
            <div>
                <span>Two-line item</span>
            </div>

            <div>
                <span className="lumx-color-font-dark-L2">Secondary text</span>
            </div>
        </ListItem>

        <ListItem
            size={Size.big}
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
            <div>
                <span>Two-line item</span>
            </div>

            <div>
                <span className="lumx-color-font-dark-L2">Secondary text</span>
            </div>
        </ListItem>

        <ListItem
            size={Size.big}
            before={<Avatar image="/demo-assets/persona.png" alt="Avatar" size={Size.m} />}
            after={<Button emphasis={Emphasis.low}>Button</Button>}
        >
            <div>
                <span>Two-line item</span>
            </div>

            <div>
                <span className="lumx-color-font-dark-L2">Secondary text</span>
            </div>
        </ListItem>
    </List>
);
