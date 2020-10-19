import React from 'react';

import { Button, Dropdown, List, ListItem, ListSubheader, Size } from '@lumx/react';

const App = () => {
    const anchorSimpleRef = React.useRef(null);
    const [isSimpleOpen, setSimpleIsOpen] = React.useState(false);

    const anchorComplexRef = React.useRef(null);
    const [isComplexOpen, setComplexIsOpen] = React.useState(false);
    const toggleSimpleMenu = () => setSimpleIsOpen(!isSimpleOpen);
    const closeSimpleMenu = () => setSimpleIsOpen(false);
    const toggleComplexMenu = () => setComplexIsOpen(!isComplexOpen);
    const closeComplexMenu = () => setComplexIsOpen(false);

    const onSimpleMenuSelected = (item: string) => () => {
        // tslint:disable-next-line:no-console
        console.log('selected item', item);
        closeSimpleMenu();
    };
    const onComplexMenuSelected = (item: string) => () => {
        // tslint:disable-next-line:no-console
        console.log('selected item', item);
        closeComplexMenu();
    };

    return (
        <div className="demo-grid">
            {/* Simple menu */}
            <Button buttonRef={anchorSimpleRef} onClick={toggleSimpleMenu}>
                Simple Menu
            </Button>

            <Dropdown isOpen={isSimpleOpen} onClose={closeSimpleMenu} anchorRef={anchorSimpleRef}>
                <List isClickable>
                    <ListItem onItemSelected={onSimpleMenuSelected('losangeles')} size={Size.tiny}>
                        Los Angeles
                    </ListItem>

                    <ListItem onItemSelected={onSimpleMenuSelected('monterrey')} size={Size.tiny}>
                        Monterrey
                    </ListItem>

                    <ListItem onItemSelected={onSimpleMenuSelected('georgetown')} size={Size.tiny}>
                        Georgetown
                    </ListItem>

                    <ListItem onItemSelected={onSimpleMenuSelected('cali')} size={Size.tiny}>
                        Cali
                    </ListItem>

                    <ListItem onItemSelected={onSimpleMenuSelected('trondheim')} size={Size.tiny}>
                        Trondheim
                    </ListItem>
                </List>
            </Dropdown>

            {/* Complex menu */}
            <Button buttonRef={anchorComplexRef} onClick={toggleComplexMenu}>
                Complex Menu
            </Button>

            <Dropdown isOpen={isComplexOpen} onClose={closeComplexMenu} anchorRef={anchorComplexRef}>
                <List isClickable>
                    <ListSubheader>Contribution</ListSubheader>

                    <ListItem onItemSelected={onComplexMenuSelected('pages')} size={Size.tiny}>
                        Pages
                    </ListItem>

                    <ListItem onItemSelected={onComplexMenuSelected('news')} size={Size.tiny}>
                        News Articles with a longer name
                    </ListItem>

                    <ListItem onItemSelected={onComplexMenuSelected('jobs')} size={Size.tiny}>
                        Job Offers
                    </ListItem>

                    <ListSubheader>Directories</ListSubheader>

                    <ListItem onItemSelected={onComplexMenuSelected('projects')} size={Size.tiny}>
                        Projects
                    </ListItem>

                    <ListItem onItemSelected={onComplexMenuSelected('useful')} size={Size.tiny}>
                        Useful links
                    </ListItem>

                    <ListItem onItemSelected={onComplexMenuSelected('support')} size={Size.tiny}>
                        Support links
                    </ListItem>

                    <ListItem onItemSelected={onComplexMenuSelected('engineering')} size={Size.tiny}>
                        Engineering
                    </ListItem>
                </List>
            </Dropdown>
        </div>
    );
};

export default App;
