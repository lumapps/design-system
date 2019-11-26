import React from 'react';

import { Dropdown, List, ListItem, Size, Chip, Button, Placement } from '@lumx/react';

const App = ({ theme }) => {
    const demoContainerStyle = {
        display: 'flex',
        justifyContent: 'center',
    };

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(true);
    const ddRef = React.useRef(null);
    const openDropdown = () => setIsDropdownOpen(true);
    const closeDropdown = () => setIsDropdownOpen(false);

    return (
        <>
            <div style={demoContainerStyle}>
                <Chip theme={theme} chipRef={ddRef}>
                    I am the anchor
                    {/* Target */}
                </Chip>
            </div>
            <Dropdown
                closeOnClick={false}
                closeOnEscape={true}
                onClose={closeDropdown}
                placement={Placement.BOTTOM_START}
                showDropdown={isDropdownOpen}
                anchorRef={ddRef}
            >
                <List isClickable>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('losangeles', closeDropdown)}
                        size={Size.tiny}
                    >
                        Los Angeles
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('monterrey', closeDropdown)}
                        size={Size.tiny}
                    >
                        Monterrey
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('georgetown', closeDropdown)}
                        size={Size.tiny}
                    >
                        Georgetown
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('cali', closeDropdown)}
                        size={Size.tiny}
                    >
                        Cali
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('trondheim', closeDropdown)}
                        size={Size.tiny}
                    >
                        Trondheim
                    </ListItem>
                </List>
            </Dropdown>
            {/* tslint:disable-next-line jsx-no-lambda */}
            <Button onClick={openDropdown}>Open dropdown</Button>
            {/* tslint:disable-next-line jsx-no-lambda */}
            <Button onClick={closeDropdown}>Close dropdown</Button>
        </>
    );
};

export default App;
