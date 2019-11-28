import React from 'react';

import { Button, Chip, Dropdown, List, ListItem, Placement, Size } from '@lumx/react';

const App = ({ theme }) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(true);
    const ddRef = React.useRef(null);
    const openDropdown = () => setIsDropdownOpen(true);
    const closeDropdown = () => setIsDropdownOpen(false);

    return (
        <>
            <div className="demo-grid">
                <Chip theme={theme} chipRef={ddRef}>
                    I am the anchor
                    {/* Target */}
                </Chip>
            </div>

            <div className="demo-grid">
                {/* tslint:disable-next-line jsx-no-lambda */}
                <Button onClick={openDropdown}>Open dropdown</Button>

                {/* tslint:disable-next-line jsx-no-lambda */}
                <Button onClick={closeDropdown}>Close dropdown</Button>

                <Dropdown
                    closeOnClick={false}
                    closeOnEscape={true}
                    onClose={closeDropdown}
                    placement={Placement.BOTTOM_START}
                    showDropdown={isDropdownOpen}
                    anchorRef={ddRef}
                >
                    <List isClickable>
                        <ListItem size={Size.tiny}>Los Angeles</ListItem>
                        <ListItem size={Size.tiny}>Monterrey</ListItem>
                        <ListItem size={Size.tiny}>Georgetown</ListItem>
                        <ListItem size={Size.tiny}>Cali</ListItem>
                        <ListItem size={Size.tiny}>Trondheim</ListItem>
                    </List>
                </Dropdown>
            </div>
        </>
    );
};

export default App;
