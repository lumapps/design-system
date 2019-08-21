import React, { CSSProperties, Fragment, ReactNode, useRef, useState } from 'react';

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
        <List isClickable onListItemSelected={onItemSelectedHandler}>
            <ListItem size={ListItemSize.tiny}>Los Angeles</ListItem>
            <ListItem size={ListItemSize.tiny}>Monterrey</ListItem>
            <ListItem size={ListItemSize.tiny}>Georgetown</ListItem>
            <ListItem size={ListItemSize.tiny}>Cali</ListItem>
            <ListItem size={ListItemSize.tiny}>Trondheim</ListItem>
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
        <List isClickable onListItemSelected={onItemSelectedHandler}>
            <ListSubheader>Contribution</ListSubheader>
            <ListItem size={ListItemSize.tiny}>Pages</ListItem>
            <ListItem size={ListItemSize.tiny}>News Articles</ListItem>
            <ListItem size={ListItemSize.tiny}>Job Offers</ListItem>
            <ListSubheader>Directories</ListSubheader>
            <ListItem size={ListItemSize.tiny}>Projects</ListItem>
            <ListItem size={ListItemSize.tiny}>Useful links</ListItem>
            <ListItem size={ListItemSize.tiny}>Support links</ListItem>
            <ListItem size={ListItemSize.tiny}>Engineering</ListItem>
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
        <Fragment>
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
                    placement={Placement.BOTTOM_START}
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
                    offset={{ vertical: 8 }}
                    placement={Placement.BOTTOM_START}
                    anchorRef={anchorComplexRef}
                >
                    {createComplexMenuList(closeComplexMenu)}
                </Dropdown>
            </div>
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
