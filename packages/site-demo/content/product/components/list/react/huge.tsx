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

import { mdiDotsHorizontal, mdiSend } from '@lumx/icons';

const App = () => (
    <>
        <List>
            <ListSubheader>text only</ListSubheader>

            <ListItem size={Size.huge}>
                <div>
                    <span>Multi-line item</span>
                </div>

                <div>
                    <span className="lumx-theme-color-dark-L2">
                        Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus
                        inter se differunt. Idque Caesaris facere voluntate liceret: sese habere
                    </span>
                </div>
            </ListItem>

            <ListSubheader>rich</ListSubheader>

            <ListItem size={Size.huge} before={<Icon icon={mdiSend} size={Size.xs} />}>
                <div>
                    <span>Multi-line item</span>
                </div>

                <div>
                    <span className="lumx-theme-color-dark-L2">
                        Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus
                        inter se differunt. Idque Caesaris facere voluntate liceret: sese habere
                    </span>
                </div>
            </ListItem>

            <ListItem
                size={Size.huge}
                before={<Thumbnail variant={ThumbnailVariant.rounded} image="https://picsum.photos/72" size={Size.m} />}
                after={<IconButton emphasis={Emphasis.low} icon={mdiDotsHorizontal} />}
            >
                <div>
                    <span>Multi-line item</span>
                </div>

                <div>
                    <span className="lumx-theme-color-dark-L2">
                        Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus
                        inter se differunt. Idque Caesaris facere voluntate liceret: sese habere
                    </span>
                </div>
            </ListItem>

            <ListItem
                size={Size.huge}
                before={<Avatar image="http://i.pravatar.cc/72" size={Size.m} />}
                after={<Button emphasis={Emphasis.low}>Button</Button>}
            >
                <div>
                    <span>Multi-line item</span>
                </div>

                <div>
                    <span className="lumx-theme-color-dark-L2">
                        Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus
                        inter se differunt. Idque Caesaris facere voluntate liceret: sese habere
                    </span>
                </div>
            </ListItem>
        </List>
    </>
);

export default App;
