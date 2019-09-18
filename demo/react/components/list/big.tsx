import React, { ReactElement } from 'react';

import {
    Button,
    ButtonEmphasis,
    Icon,
    List,
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
            <ListItem size={ListItemSize.big}>
                <div>
                    <span>Two-line item</span>
                </div>
                <div>
                    <span className="lumx-theme-color-dark-L2">Secondary text</span>
                </div>
            </ListItem>
            <ListSubheader>rich</ListSubheader>
            <ListItem
                size={ListItemSize.big}
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
                    <span>Two-line item</span>
                </div>
                <div>
                    <span className="lumx-theme-color-dark-L2">Secondary text</span>
                </div>
            </ListItem>
            <ListItem
                size={ListItemSize.big}
                before={<Icon icon={mdiSend} />}
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

/////////////////////////////

export default {
    view: DemoComponent,
};
