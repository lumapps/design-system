import { Button, Chip, Dropdown, FlexBox, List, ListItem, Orientation, Placement, Size } from '@lumx/react';
import { useRef, useState } from 'react';

export const App = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const anchorRef = useRef(null);
    const openDropdown = () => setIsDropdownOpen(true);
    const closeDropdown = () => setIsDropdownOpen(false);

    return (
        <>
            <Chip ref={anchorRef}>I am the anchor</Chip>

            <Dropdown
                closeOnClickAway={false}
                closeOnEscape
                onClose={closeDropdown}
                placement={Placement.BOTTOM_START}
                isOpen={isDropdownOpen}
                anchorRef={anchorRef}
            >
                <List isClickable>
                    <ListItem size={Size.tiny}>Los Angeles</ListItem>
                    <ListItem size={Size.tiny}>Monterrey</ListItem>
                    <ListItem size={Size.tiny}>Georgetown</ListItem>
                    <ListItem size={Size.tiny}>Cali</ListItem>
                    <ListItem size={Size.tiny}>Trondheim</ListItem>
                </List>
            </Dropdown>

            <FlexBox gap={Size.regular} orientation={Orientation.horizontal}>
                <Button onClick={openDropdown}>Open dropdown</Button>
                <Button onClick={closeDropdown}>Close dropdown</Button>
            </FlexBox>
        </>
    );
};
