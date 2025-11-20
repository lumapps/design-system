import { List, ListItem } from '@lumx/react';

export const App = () => (
    <List>
        <ListItem linkProps={{ href: '#' }}>Clickable list item</ListItem>
        <ListItem linkProps={{ href: '#' }} isDisabled>
            Disabled clickable list item
        </ListItem>
        <ListItem linkProps={{ href: '#' }} isHighlighted>
            Highlighted clickable list item
        </ListItem>
        <ListItem linkProps={{ href: '#' }} isSelected>
            Selected clickable list item
        </ListItem>
    </List>
);
