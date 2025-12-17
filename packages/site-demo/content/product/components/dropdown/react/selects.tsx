import { Dropdown, List, ListDivider, ListItem, ListSubheader, Size } from '@lumx/react';
// Demo purpose only: force the dropdown position to have it show inline in the demo block
const overridePositionStyle = (element: any) => {
    // eslint-disable-next-line no-param-reassign
    if (element?.style) element.style.position = 'initial';
};

export const App = () => (
    <Dropdown isOpen anchorRef={{ current: null }} usePortal={false} ref={overridePositionStyle}>
        <List>
            <ListSubheader>Fruits</ListSubheader>

            <ListItem linkProps={{ href: '#' }} size={Size.tiny}>
                Ananas
            </ListItem>

            <ListItem linkProps={{ href: '#' }} size={Size.tiny} isDisabled>
                Coconut (unavailable)
            </ListItem>

            <ListItem linkProps={{ href: '#' }} size={Size.tiny}>
                Kiwi
            </ListItem>

            <ListDivider />

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
    </Dropdown>
);
