import React from 'react';
import { Button, Dropdown, List, ListItem, ListSubheader } from '@lumx/react';

export default () => {
    const anchorSimpleRef = React.useRef(null);
    const [isSimpleOpen, setSimpleIsOpen] = React.useState(false);
    const anchorComplexRef = React.useRef(null);
    const [isComplexOpen, setComplexIsOpen] = React.useState(false);
    const toggleSimpleMenu = () => setSimpleIsOpen(!isSimpleOpen);
    const closeSimpleMenu = () => setSimpleIsOpen(false);
    const toggleComplexMenu = () => setComplexIsOpen(!isComplexOpen);
    const closeComplexMenu = () => setComplexIsOpen(false);

    return (
        <>
            {/* Simple menu */}
            <Button ref={anchorSimpleRef} onClick={toggleSimpleMenu}>
                Simple Menu
            </Button>

            <Dropdown isOpen={isSimpleOpen} onClose={closeSimpleMenu} anchorRef={anchorSimpleRef}>
                <List>
                    <ListItem onItemSelected={closeSimpleMenu} size="tiny">
                        Los Angeles
                    </ListItem>

                    <ListItem onItemSelected={closeSimpleMenu} size="tiny">
                        Monterrey
                    </ListItem>

                    <ListItem onItemSelected={closeSimpleMenu} size="tiny">
                        Georgetown
                    </ListItem>

                    <ListItem onItemSelected={closeSimpleMenu} size="tiny">
                        Cali
                    </ListItem>

                    <ListItem onItemSelected={closeSimpleMenu} size="tiny">
                        Trondheim
                    </ListItem>
                </List>
            </Dropdown>

            {/* Complex menu */}
            <Button ref={anchorComplexRef} onClick={toggleComplexMenu}>
                Complex Menu
            </Button>

            <Dropdown isOpen={isComplexOpen} onClose={closeComplexMenu} anchorRef={anchorComplexRef}>
                <List>
                    <ListSubheader>Contribution</ListSubheader>

                    <ListItem onItemSelected={closeComplexMenu} size="tiny">
                        Pages
                    </ListItem>

                    <ListItem onItemSelected={closeComplexMenu} size="tiny">
                        News Articles with a longer name
                    </ListItem>

                    <ListItem onItemSelected={closeComplexMenu} size="tiny">
                        Job Offers
                    </ListItem>

                    <ListSubheader>Directories</ListSubheader>

                    <ListItem onItemSelected={closeComplexMenu} size="tiny">
                        Projects
                    </ListItem>

                    <ListItem onItemSelected={closeComplexMenu} size="tiny">
                        Useful links
                    </ListItem>

                    <ListItem onItemSelected={closeComplexMenu} size="tiny">
                        Support links
                    </ListItem>

                    <ListItem onItemSelected={closeComplexMenu} size="tiny">
                        Engineering
                    </ListItem>
                </List>
            </Dropdown>
        </>
    );
};
