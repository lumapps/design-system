import React, { Fragment } from 'react';

import {
    Button,
    ButtonEmphasises,
    Icon,
    List,
    ListItem,
    ListItemSizes,
    ListSubheader,
    ListTheme,
    Thumbnail,
    ThumbnailSizes,
} from 'LumX';

import { mdiSend } from 'LumX/icons';

import { Variants } from 'LumX/components/thumbnail/react/Thumbnail';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: ListTheme;
}

/////////////////////////////

/**
 * The demo for the default <List>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): React.ReactElement => (
    <Fragment>
        <List theme={theme}>
            <ListSubheader>text only</ListSubheader>
            <ListItem size={ListItemSizes.huge}>
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
            <ListSubheader>rich</ListSubheader>
            <ListItem
                size={ListItemSizes.huge}
                before={
                    <Thumbnail
                        theme={theme}
                        variant={Variants.rounded}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.m}
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
                size={ListItemSizes.huge}
                before={<Icon icon={mdiSend} />}
                after={<Button emphasis={ButtonEmphasises.low}>Button</Button>}
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
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
