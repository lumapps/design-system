import React, { CSSProperties, Fragment, ReactNode } from 'react';

import { Button, Dropdown, List, ListItem, ListItemSize, ListSubheader, PopperPlacement } from 'LumX';

const demoContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
};

/////////////////////////////

interface IProps {}

const createToggleElement: (text?: string) => ReactNode = (text: string = 'Button'): ReactNode => {
    return <Button>{text}</Button>;
};

const createSimpleMenuList: (setIsOpen: (isOpen: boolean) => void) => ReactNode = (
    setIsOpen: (isOpen: boolean) => void,
): ReactNode => {
    const onItemSelectedHandler: (item: ListItem) => void = (item: ListItem): void => {
        // tslint:disable-next-line no-console
        console.log('selected item', item);
        setIsOpen(false);
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

const createComplexMenuList: (setIsOpen: (isOpen: boolean) => void) => ReactNode = (
    setIsOpen: (isOpen: boolean) => void,
): ReactNode => {
    // tslint:disable-next-line no-unused
    const onItemSelectedHandler: (item: ListItem) => void = (item: ListItem): void => {
        setIsOpen(false);
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
    return (
        <Fragment>
            <div style={demoContainerStyle}>
                {/* Simple menu */}
                <Dropdown
                    closeOnClick={true}
                    escapeClose={true}
                    position={PopperPlacement.BOTTOM_START}
                    toggleElement={createToggleElement('Simple Menu')}
                >
                    {(setIsOpen: (isOpen: boolean) => void): ReactNode => createSimpleMenuList(setIsOpen)}
                </Dropdown>

                {/* Complex menu */}
                <Dropdown
                    closeOnClick={false}
                    escapeClose={false}
                    offset={{ vertical: 8 }}
                    position={PopperPlacement.BOTTOM_START}
                    toggleElement={createToggleElement('Complex Menu')}
                >
                    {(setIsOpen: (isOpen: boolean) => void): ReactNode => createComplexMenuList(setIsOpen)}
                </Dropdown>
            </div>
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
