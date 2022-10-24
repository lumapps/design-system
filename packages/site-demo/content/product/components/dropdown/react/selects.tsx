import { Alignment, Divider, FlexBox, List, ListItem, ListSubheader, Size } from '@lumx/react';
import React from 'react';

export const App = () => {
    return (
        <>
        <FlexBox vAlign={Alignment.center} fillSpace className="lumx-color-background-dark-L6 lumx-spacing-padding-huge">
                <List className="lumx-color-background-light-N lumx-popover--elevation-3">
                    <ListSubheader>Fruits</ListSubheader>

                    <ListItem linkProps={{ href: '#' }} size={Size.tiny}>
                        Ananas
                    </ListItem>

                    <ListItem linkProps={{ href: '#' }} size={Size.tiny} isDisabled>
                        Coconut (unavailable)
                    </ListItem>

                    <ListItem linkProps={{ href: '#' }} size={Size.tiny} >
                        Kiwi
                    </ListItem>

                    <Divider className="lumx-spacing-margin-vertical-regular" />

                    <ListSubheader>Vegetables</ListSubheader>

                    <ListItem linkProps={{ href: '#' }} size={Size.tiny}>
                        Carrot
                    </ListItem>

                    <ListItem linkProps={{ href: '#' }} size={Size.tiny} isSelected>
                        Onion (selected)
                    </ListItem>

                    <ListItem linkProps={{ href: '#' }} size={Size.tiny}>
                        Potato
                    </ListItem>

                    <ListItem linkProps={{ href: '#' }} size={Size.tiny}>
                        Rice
                    </ListItem>
                </List>
            </FlexBox>
        </>
    );
};
