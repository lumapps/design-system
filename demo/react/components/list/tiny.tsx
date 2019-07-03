import React, { ReactElement } from 'react';

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
            <ListItem size={ListItemSizes.tiny} onItemSelected={(): void => onItemSelectedHandler('Some data')}>
                Single-line item 1
            </ListItem>
            <ListItem size={ListItemSizes.tiny}>Single-line item 2</ListItem>
            <ListItem size={ListItemSizes.tiny}>Single-line item 3</ListItem>
            <ListSubheader>rich</ListSubheader>
            <ListItem size={ListItemSizes.tiny} before={<Icon icon={mdiSend} />}>
                Single-line item 4
            </ListItem>
            <ListItem
                isSelected
                size={ListItemSizes.tiny}
                before={
                    <Thumbnail
                        theme={theme}
                        variant={Variants.rounded}
                        image="http://i.pravatar.cc/200"
                        size={ThumbnailSizes.m}
                    />
                }
            >
                Single-line item 5
            </ListItem>
            <ListItem
                size={ListItemSizes.tiny}
                before={<Icon icon={mdiSend} />}
                after={<Button emphasis={ButtonEmphasises.low}>Button</Button>}
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
