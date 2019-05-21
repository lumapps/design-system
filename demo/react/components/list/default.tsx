import React, { Fragment } from 'react';

import {
    Button,
    ButtonEmphasises,
    Icon,
    List,
    ListItem,
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
            <ListItem>Single-line item</ListItem>
            <ListItem>Single-line item</ListItem>
            <ListItem>Single-line item</ListItem>
            <ListSubheader>rich</ListSubheader>
            <ListItem before={<Icon icon={mdiSend} />}>Single-line item</ListItem>
            <ListItem
                before={
                    <Thumbnail
                        theme={theme}
                        variant={Variants.rounded}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.m}
                    />
                }
            >
                Single-line item
            </ListItem>
            <ListItem before={<Icon icon={mdiSend} />} after={<Button emphasis={ButtonEmphasises.low}>Button</Button>}>
                Single-line item
            </ListItem>
        </List>
    </Fragment>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
