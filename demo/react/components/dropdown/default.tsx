import React, { CSSProperties, ReactNode, useRef, useState } from 'react';

import { Button, Dropdown, List, ListItem, ListItemSize, ListSubheader, Placement } from 'LumX';

const demoContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
};

/////////////////////////////

interface IProps {}

const createSimpleMenuList: (closeSimpleMenu: () => void) => ReactNode = (closeSimpleMenu: () => void): ReactNode => {
    const onItemSelectedHandler: (item: ListItem) => void = (item: ListItem): void => {
        console.log('selected item', item);
        closeSimpleMenu();
    };

    return (
        <List isClickable>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('losangeles')} size={ListItemSize.tiny}>
                Los Angeles
            </ListItem>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('monterrey')} size={ListItemSize.tiny}>
                Monterrey
            </ListItem>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('georgetown')} size={ListItemSize.tiny}>
                Georgetown
            </ListItem>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('cali')} size={ListItemSize.tiny}>
                Cali
            </ListItem>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('trondheim')} size={ListItemSize.tiny}>
                Trondheim
            </ListItem>
        </List>
    );
};

const createComplexMenuList: (closeComplexMenu: () => void) => ReactNode = (
    closeComplexMenu: () => void,
): ReactNode => {
    // tslint:disable-next-line: no-unused
    const onItemSelectedHandler: (item: ListItem) => void = (item: ListItem): void => {
        closeComplexMenu();
    };

    return (
        <List isClickable>
            <ListSubheader>Contribution</ListSubheader>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('pages')} size={ListItemSize.tiny}>
                Pages
            </ListItem>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('news')} size={ListItemSize.tiny}>
                News Articles
            </ListItem>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('jobs')} size={ListItemSize.tiny}>
                Job Offers
            </ListItem>
            <ListSubheader>Directories</ListSubheader>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('projects')} size={ListItemSize.tiny}>
                Projects
            </ListItem>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('useful')} size={ListItemSize.tiny}>
                Useful links
            </ListItem>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('support')} size={ListItemSize.tiny}>
                Support links
            </ListItem>
            <ListItem onItemSelected={(): void => onItemSelectedHandler('engineering')} size={ListItemSize.tiny}>
                Engineering
            </ListItem>
        </List>
    );
};

/////////////////////////////

/**
 * The demo for the default <Dropdown>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (): React.ReactElement => {
    const anchorSimpleRef: React.RefObject<HTMLDivElement> = useRef(null);
    const [isSimpleOpen, setSimpleIsOpen]: [boolean, (isOpen: boolean) => void] = useState<boolean>(false);

    const anchorComplexRef: React.RefObject<HTMLDivElement> = useRef(null);
    const [isComplexOpen, setComplexIsOpen]: [boolean, (isOpen: boolean) => void] = useState<boolean>(false);

    function toggleSimpleMenu(): void {
        setSimpleIsOpen(!isSimpleOpen);
    }

    function closeSimpleMenu(): void {
        setSimpleIsOpen(false);
    }

    function toggleComplexMenu(): void {
        setComplexIsOpen(!isComplexOpen);
    }

    function closeComplexMenu(): void {
        setComplexIsOpen(false);
    }

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
                {createSimpleMenuList(closeSimpleMenu)}
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
                {createComplexMenuList(closeComplexMenu)}
            </Dropdown>
        </div>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
