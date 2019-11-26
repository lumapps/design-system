import React from 'react';

import { Dropdown, List, ListItem, Size, Button, ListSubheader, Placement } from '@lumx/react';

const App = () => {
    const demoContainerStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
    };

    const anchorSimpleRef = React.useRef(null);
    const [isSimpleOpen, setSimpleIsOpen] = React.useState(false);

    const anchorComplexRef = React.useRef(null);
    const [isComplexOpen, setComplexIsOpen] = React.useState(false);

    function toggleSimpleMenu() {
        setSimpleIsOpen(!isSimpleOpen);
    }

    function closeSimpleMenu() {
        setSimpleIsOpen(false);
    }

    function toggleComplexMenu() {
        setComplexIsOpen(!isComplexOpen);
    }

    function closeComplexMenu() {
        setComplexIsOpen(false);
    }

    const onItemSelectedHandler = (item, onClose) => {
        console.log('selected item', item);
        onClose();
    };

    return (
        <div style={demoContainerStyle}>
            {/* Simple menu */}
            <Button buttonRef={anchorSimpleRef} onClick={toggleSimpleMenu}>
                Simple Menu
            </Button>
            <Dropdown
                showDropdown={isSimpleOpen}
                closeOnClick={true}
                closeOnEscape={true}
                onClose={closeSimpleMenu}
                placement={Placement.AUTO_START}
                anchorRef={anchorSimpleRef}
            >
                <List isClickable>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('losangeles', closeSimpleMenu)}
                        size={Size.tiny}
                    >
                        Los Angeles
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('monterrey', closeSimpleMenu)}
                        size={Size.tiny}
                    >
                        Monterrey
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('georgetown', closeSimpleMenu)}
                        size={Size.tiny}
                    >
                        Georgetown
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('cali', closeSimpleMenu)}
                        size={Size.tiny}
                    >
                        Cali
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('trondheim', closeSimpleMenu)}
                        size={Size.tiny}
                    >
                        Trondheim
                    </ListItem>
                </List>
            </Dropdown>

            {/* Complex menu */}
            <Button buttonRef={anchorComplexRef} onClick={toggleComplexMenu}>
                Complex Menu
            </Button>
            <Dropdown
                showDropdown={isComplexOpen}
                closeOnClick={false}
                closeOnEscape={false}
                offset={{ vertical: 20 }}
                placement={Placement.AUTO_START}
                anchorRef={anchorComplexRef}
            >
                <List isClickable>
                    <ListSubheader>Contribution</ListSubheader>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('pages', closeComplexMenu)}
                        size={Size.tiny}
                    >
                        Pages
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('news', closeComplexMenu)}
                        size={Size.tiny}
                    >
                        News Articles with a longer name
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('jobs', closeComplexMenu)}
                        size={Size.tiny}
                    >
                        Job Offers
                    </ListItem>
                    <ListSubheader>Directories</ListSubheader>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('projects', closeComplexMenu)}
                        size={Size.tiny}
                    >
                        Projects
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('useful', closeComplexMenu)}
                        size={Size.tiny}
                    >
                        Useful links
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('support', closeComplexMenu)}
                        size={Size.tiny}
                    >
                        Support links
                    </ListItem>
                    <ListItem
                        onItemSelected={() => onItemSelectedHandler('engineering', closeComplexMenu)}
                        size={Size.tiny}
                    >
                        Engineering
                    </ListItem>
                </List>
            </Dropdown>
        </div>
    );
};

export default App;
