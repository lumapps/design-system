import { useRef, useState } from 'react';
import { Button, Chip, Dropdown, FlexBox, List, ListItem } from '@lumx/react';

export default () => {
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
                placement="bottom-start"
                isOpen={isDropdownOpen}
                anchorRef={anchorRef}
            >
                <List isClickable>
                    <ListItem size="tiny">Los Angeles</ListItem>
                    <ListItem size="tiny">Monterrey</ListItem>
                    <ListItem size="tiny">Georgetown</ListItem>
                    <ListItem size="tiny">Cali</ListItem>
                    <ListItem size="tiny">Trondheim</ListItem>
                </List>
            </Dropdown>

            <FlexBox gap="regular" orientation="horizontal">
                <Button onClick={openDropdown}>Open dropdown</Button>
                <Button onClick={closeDropdown}>Close dropdown</Button>
            </FlexBox>
        </>
    );
};
