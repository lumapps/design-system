import { Dropdown, List, ListDivider, ListItem, ListSubheader } from '@lumx/react';
// Demo purpose only: force the dropdown position to have it show inline in the demo block
const overridePositionStyle = (element: HTMLElement | null) => {
    // eslint-disable-next-line no-param-reassign
    if (element?.style) element.style.position = 'initial';
};

export default () => (
    <Dropdown isOpen anchorRef={{ current: null }} usePortal={false} ref={overridePositionStyle}>
        <List>
            <ListSubheader>Fruits</ListSubheader>

            <ListItem linkProps={{ href: '#' }} size="tiny">
                Ananas
            </ListItem>

            <ListItem linkProps={{ href: '#' }} size="tiny" isDisabled>
                Coconut (unavailable)
            </ListItem>

            <ListItem linkProps={{ href: '#' }} size="tiny">
                Kiwi
            </ListItem>

            <ListDivider />

            <ListSubheader>Vegetables</ListSubheader>

            <ListItem linkProps={{ href: '#' }} size="tiny">
                Carrot
            </ListItem>

            <ListItem linkProps={{ href: '#' }} size="tiny" isSelected>
                Onion (selected)
            </ListItem>

            <ListItem linkProps={{ href: '#' }} size="tiny">
                Potato
            </ListItem>

            <ListItem linkProps={{ href: '#' }} size="tiny">
                Rice
            </ListItem>
        </List>
    </Dropdown>
);
