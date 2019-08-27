import React, { ReactElement, useState } from 'react';

import {
    Button,
    ColorPalette,
    Divider,
    DragHandle,
    ExpansionPanel,
    Icon,
    List,
    ListItem,
    ListItemSize,
    ListSubheader,
    Size,
    Theme,
} from 'LumX';
import { mdiSend } from 'LumX/icons';

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    theme: Theme;
}

const sendIcon = <Icon size={Size.xs} icon={mdiSend} />;

/////////////////////////////

const DemoComponent: React.FC<IProps> = ({ theme }: IProps): ReactElement => {
    const [isOpen, setOpen] = useState(false);
    const toggleOpen = (): void => setOpen(!isOpen);

    return (
        <>
            <ExpansionPanel theme={theme} label="Lorem ipsum" isOpen={isOpen} toggleCallback={toggleOpen}>
                <DragHandle />

                <List>
                    <ListSubheader>Lorem ipsum</ListSubheader>
                    <ListItem size={ListItemSize.tiny} before={sendIcon}>
                        Lorem ipsum
                    </ListItem>
                    <ListItem size={ListItemSize.tiny} before={sendIcon}>
                        Lorem ipsum
                    </ListItem>
                    <ListSubheader>Lorem ipsum</ListSubheader>
                    <ListItem size={ListItemSize.tiny} before={sendIcon}>
                        Lorem ipsum
                    </ListItem>
                    <ListItem size={ListItemSize.tiny} before={sendIcon}>
                        Lorem ipsum
                    </ListItem>
                    <Divider />
                    <ListItem size={ListItemSize.tiny} before={sendIcon}>
                        Lorem ipsum
                    </ListItem>
                    <ListItem size={ListItemSize.tiny} before={sendIcon}>
                        Lorem ipsum
                    </ListItem>
                </List>

                <footer>
                    <Button color={ColorPalette.red}>Remove</Button>
                </footer>
            </ExpansionPanel>

            <Button onClick={toggleOpen} theme={theme}>
                Toggle
            </Button>
        </>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
