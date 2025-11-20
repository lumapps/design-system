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

        <ListItem size={Size.huge}>
            <div>
                <span>Multi-line item</span>
            </div>

            <div>
                <span className="lumx-color-font-dark-L2">
                    Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus inter
                    se differunt. Idque Caesaris facere voluntate liceret: sese habere
                </span>
            </div>
        </ListItem>

        <ListSubheader>rich</ListSubheader>

        <ListItem size={Size.huge} before={<Icon icon={mdiSend} size={Size.xs} />}>
            <div>
                <span>Multi-line item</span>
            </div>

            <div>
                <span className="lumx-color-font-dark-L2">
                    Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus inter
                    se differunt. Idque Caesaris facere voluntate liceret: sese habere
                </span>
            </div>
        </ListItem>

        <ListItem
            size={Size.huge}
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
                <span>Multi-line item</span>
            </div>

            <div>
                <span className="lumx-color-font-dark-L2">
                    Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus inter
                    se differunt. Idque Caesaris facere voluntate liceret: sese habere
                </span>
            </div>
        </ListItem>

        <ListItem
            size={Size.huge}
            before={<Avatar image="/demo-assets/persona.png" alt="Avatar" size={Size.m} />}
            after={<Button emphasis={Emphasis.low}>Button</Button>}
        >
            <div>
                <span>Multi-line item</span>
            </div>

            <div>
                <span className="lumx-color-font-dark-L2">
                    Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus inter
                    se differunt. Idque Caesaris facere voluntate liceret: sese habere
                </span>
            </div>
        </ListItem>
    </List>
);
