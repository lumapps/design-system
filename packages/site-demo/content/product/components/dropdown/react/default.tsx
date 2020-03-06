import React from 'react';

import { Button, Dropdown, List, ListItem, ListSubheader, Placement, Size } from '@lumx/react';

const App = () => {
    const anchorSimpleRef = React.useRef(null);
    const [isSimpleOpen, setSimpleIsOpen] = React.useState(false);

    const anchorComplexRef = React.useRef(null);
    const [isComplexOpen, setComplexIsOpen] = React.useState(false);
    const toggleSimpleMenu = () => setSimpleIsOpen(!isSimpleOpen);
    const closeSimpleMenu = () => setSimpleIsOpen(false);
    const toggleComplexMenu = () => setComplexIsOpen(!isComplexOpen);
    const closeComplexMenu = () => setComplexIsOpen(false);

    return (
        <div className="demo-grid">
            {/* Simple menu */}
            <Button buttonRef={anchorSimpleRef} onClick={toggleSimpleMenu}>
                Simple Menu
            </Button>

            <Dropdown
                closeOnClick
                closeOnEscape
                showDropdown={isSimpleOpen}
                onClose={closeSimpleMenu}
                placement={Placement.AUTO_START}
                anchorRef={anchorSimpleRef}
            >
                <List isClickable>
                    <ListItem onItemSelected={closeSimpleMenu} size={Size.tiny}>
                        Los Angeles
                    </ListItem>

                    <ListItem onItemSelected={closeSimpleMenu} size={Size.tiny}>
                        Monterrey
                    </ListItem>

                    <ListItem onItemSelected={closeSimpleMenu} size={Size.tiny}>
                        Georgetown
                    </ListItem>

                    <ListItem onItemSelected={closeSimpleMenu} size={Size.tiny}>
                        Cali
                    </ListItem>

                    <ListItem onItemSelected={closeSimpleMenu} size={Size.tiny}>
                        Trondheim
                    </ListItem>
                </List>
            </Dropdown>

            {/* Complex menu */}
            <Button buttonRef={anchorComplexRef} onClick={toggleComplexMenu}>
                Complex Menu
            </Button>

            <Dropdown
                closeOnClick={false}
                closeOnEscape={false}
                showDropdown={isComplexOpen}
                offset={{ vertical: 20 }}
                placement={Placement.AUTO_START}
                anchorRef={anchorComplexRef}
            >
                <List isClickable>
                    <ListSubheader>Contribution</ListSubheader>

                    <ListItem onItemSelected={closeComplexMenu} size={Size.tiny}>
                        Pages
                    </ListItem>

                    <ListItem onItemSelected={closeComplexMenu} size={Size.tiny}>
                        News Articles with a longer name
                    </ListItem>

                    <ListItem onItemSelected={closeComplexMenu} size={Size.tiny}>
                        Job Offers
                    </ListItem>

                    <ListSubheader>Directories</ListSubheader>

                    <ListItem onItemSelected={closeComplexMenu} size={Size.tiny}>
                        Projects
                    </ListItem>

                    <ListItem onItemSelected={closeComplexMenu} size={Size.tiny}>
                        Useful links
                    </ListItem>

                    <ListItem onItemSelected={closeComplexMenu} size={Size.tiny}>
                        Support links
                    </ListItem>

                    <ListItem onItemSelected={closeComplexMenu} size={Size.tiny}>
                        Engineering
                    </ListItem>
                </List>
            </Dropdown>
        </div>
    );
};

export default App;
