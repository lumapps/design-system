import { List, ListItem } from '@lumx/react';

export default () => (
    <List>
        <ListItem size="tiny" linkProps={{ href: '#' }}>
            Clickable list item
        </ListItem>
        <ListItem size="tiny" linkProps={{ href: '#' }} isDisabled>
            Disabled clickable list item
        </ListItem>
        <ListItem size="tiny" linkProps={{ href: '#' }} isHighlighted>
            Highlighted clickable list item
        </ListItem>
        <ListItem size="tiny" linkProps={{ href: '#' }} isSelected>
            Selected clickable list item
        </ListItem>
    </List>
);
