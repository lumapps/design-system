import React, { CSSProperties, Fragment, ReactNode } from 'react';

import { Button, Dropdown, List, ListItem, ListItemSizes, ListSubheader, Placements } from 'LumX';

const demoContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
};

/////////////////////////////

interface IProps {
    /**
     * The theme to use to display this demo.
     */
    // theme: DropdownTheme;
}

const createToggleElement: (text?: string) => ReactNode = (text: string = 'Button'): ReactNode => {
    return <Button>{text}</Button>;
};

const createSimpleMenuList: (setIsOpen: (isOpen: boolean) => void) => ReactNode = (
    setIsOpen: (isOpen: boolean) => void,
): ReactNode => {
    // tslint:disable-next-line no-unused
    const onItemSelectedHandler: (item: ListItem) => void = (item: ListItem): void => {
        setIsOpen(false);
    };

    return (
        <List isClickable onListItemSelected={onItemSelectedHandler}>
            <ListItem size={ListItemSizes.tiny}>Los Angeles</ListItem>
            <ListItem size={ListItemSizes.tiny}>Monterrey</ListItem>
            <ListItem size={ListItemSizes.tiny}>Georgetown</ListItem>
            <ListItem size={ListItemSizes.tiny}>Cali</ListItem>
            <ListItem size={ListItemSizes.tiny}>Trondheim</ListItem>
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
            <ListItem size={ListItemSizes.tiny}>Pages</ListItem>
            <ListItem size={ListItemSizes.tiny}>News Articles</ListItem>
            <ListItem size={ListItemSizes.tiny}>Job Offers</ListItem>
            <ListSubheader>Directories</ListSubheader>
            <ListItem size={ListItemSizes.tiny}>Projects</ListItem>
            <ListItem size={ListItemSizes.tiny}>Useful links</ListItem>
            <ListItem size={ListItemSizes.tiny}>Support links</ListItem>
            <ListItem size={ListItemSizes.tiny}>Engineering</ListItem>
        </List>
    );
};

/////////////////////////////

/**
 * The demo for the default <Dropdown>s.
 *
 * @return {React.ReactElement} The demo component.
 */
const DemoComponent: React.FC<IProps> = (): React.ReactElement => {
    return (
        <Fragment>
            <div style={demoContainerStyle}>
                {/* Simple menu */}
                <Dropdown
                    closeOnClick={true}
                    escapeClose={true}
                    position={Placements.BOTTOM_START}
                    toggleElement={createToggleElement('Simple Menu')}
                >
                    {(setIsOpen: (isOpen: boolean) => void): ReactNode => createSimpleMenuList(setIsOpen)}
                </Dropdown>

                {/* Complex menu */}
                <Dropdown
                    closeOnClick={false}
                    escapeClose={false}
                    offset={{ vertical: 8 }}
                    overToggle={true}
                    position={Placements.BOTTOM_START}
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
