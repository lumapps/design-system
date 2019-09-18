import React, { ReactElement } from 'react';

import {
    Button,
    ButtonEmphasis,
    Icon,
    List,
    ListDivider,
    ListItem,
    ListItemSize,
    ListSubheader,
    Size,
    Theme,
    Thumbnail,
    ThumbnailVariant,
} from 'LumX';

import { mdiSend } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

/////////////////////////////

/**
 * The demo for the default <List>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <List theme={theme}>
            <ListSubheader>text only</ListSubheader>
            <ListItem size={ListItemSize.huge}>
                <div>
                    <span>Multi-line item</span>
                </div>
                <div>
                    <p className="lumx-theme-color-dark-L2">
                        Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus
                        differunt. Idque Caesaris facere voluntate liceret: sese habere
                    </p>
                </div>
            </ListItem>
            <ListDivider />
            <ListSubheader>rich</ListSubheader>
            <ListItem
                size={ListItemSize.huge}
                before={
                    <Thumbnail
                        theme={theme}
                        variant={ThumbnailVariant.rounded}
                        image="http://i.pravatar.cc/200"
                        size={Size.m}
                    />
                }
            >
                <div>
                    <span>Multi-line item</span>
                </div>
                <div>
                    <p className="lumx-theme-color-dark-L2">
                        Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus
                        inter se differunt. Idque Caesaris facere voluntate liceret: sese habere
                    </p>
                </div>
            </ListItem>
            <ListItem
                size={ListItemSize.huge}
                before={<Icon icon={mdiSend} />}
                after={<Button emphasis={ButtonEmphasis.low}>Button</Button>}
            >
                <div>
                    <span>Multi-line item</span>
                </div>
                <div>
                    <p className="lumx-theme-color-dark-L2">
                        Secondary text Ambitioni dedisse scripsisse iudicaretur. Hi omnes lingua, institutis, legibus
                        inter inter se differunt. Idque Caesaris facere voluntate liceret: sese habere
                    </p>
                </div>
            </ListItem>
        </List>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
