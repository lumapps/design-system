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

const onListItemSelectedHandler = (selectedEntry: ListItem): void => {
    console.log(selectedEntry);
};

const onItemSelectedHandler = (data: string): void => {
    console.log(data);
};

/**
 * The demo for the default <List>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => (
    <>
        <List theme={theme} isClickable onListItemSelected={onListItemSelectedHandler}>
            <ListSubheader>text only</ListSubheader>
            <ListItem size={ListItemSize.tiny} onItemSelected={(): void => onItemSelectedHandler('Some data')}>
                Single-line item 1
            </ListItem>
            <ListItem size={ListItemSize.tiny}>Single-line item 2</ListItem>
            <ListItem size={ListItemSize.tiny}>Single-line item 3</ListItem>
            <ListSubheader>rich</ListSubheader>
            <ListItem size={ListItemSize.tiny} before={<Icon icon={mdiSend} />}>
                Single-line item 4
            </ListItem>
            <ListItem
                isSelected
                size={ListItemSize.tiny}
                before={
                    <Thumbnail
                        theme={theme}
                        variant={ThumbnailVariant.rounded}
                        image="http://i.pravatar.cc/200"
                        size={Size.m}
                    />
                }
            >
                Single-line item 5
            </ListItem>
            <ListItem
                size={ListItemSize.tiny}
                before={<Icon icon={mdiSend} />}
                after={<Button emphasis={ButtonEmphasis.low}>Button</Button>}
            >
                Single-line item 6
            </ListItem>
        </List>
    </>
);

/////////////////////////////

export default {
    view: DemoComponent,
};
