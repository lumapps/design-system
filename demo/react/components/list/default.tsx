import React, { ReactElement } from 'react';

import {
    Button,
    ButtonEmphasis,
    Icon,
    List,
    ListItem,
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
            <ListItem>Single-line item</ListItem>
            <ListItem>Single-line item</ListItem>
            <ListItem>Single-line item</ListItem>
            <ListSubheader>rich</ListSubheader>
            <ListItem before={<Icon icon={mdiSend} />}>Single-line item</ListItem>
            <ListItem
                before={
                    <Thumbnail
                        theme={theme}
                        variant={ThumbnailVariant.rounded}
                        image="http://i.pravatar.cc/200"
                        size={Size.m}
                    />
                }
            >
                Single-line item
            </ListItem>
            <ListItem before={<Icon icon={mdiSend} />} after={<Button emphasis={ButtonEmphasis.low}>Button</Button>}>
                Single-line item
            </ListItem>
        </List>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
