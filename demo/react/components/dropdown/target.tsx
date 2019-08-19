import React, { CSSProperties, Fragment, ReactNode, useRef, useState } from 'react';

import { Button, Dropdown, List, ListItem, ListItemSize, Placement } from 'LumX';

const demoContainerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
};

/////////////////////////////

interface IProps {}

const createSimpleMenuList: (onClose: () => void) => ReactNode = (onClose: () => void): ReactNode => {
    const onItemSelectedHandler: (item: ListItem) => void = (item: ListItem): void => {
        // tslint:disable-next-line no-console
        console.log('selected item', item);
        onClose();
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

/////////////////////////////

/**
 * The demo for the default <Dropdown>s.
 *
 * @return The demo component.
 */
const DemoComponent: React.FC<IProps> = (): React.ReactElement => {
    const [isDropdownOpen, setIsDropdownOpen]: [boolean, (isOpen: boolean) => void] = useState<boolean>(true);
    const ddRef: React.RefObject<HTMLDivElement> = useRef(null);

    return (
        <Fragment>
            <div style={demoContainerStyle}>
                <Button buttonRef={ddRef}>
                    I am the anchor
                    {/* Target */}
                </Button>
            </div>
            <Dropdown
                closeOnClick={true}
                escapeClose={true}
                onClose={(): void => setIsDropdownOpen(false)}
                placement={Placement.BOTTOM_START}
                showDropdown={isDropdownOpen}
                anchorRef={ddRef}
            >
                {createSimpleMenuList(() => setIsDropdownOpen(false))}
            </Dropdown>
            {/* tslint:disable-next-line jsx-no-lambda */}
            <Button onClick={(): void => setIsDropdownOpen(true)}>Open dropdown</Button>
            {/* tslint:disable-next-line jsx-no-lambda */}
            <Button onClick={(): void => setIsDropdownOpen(false)}>Close dropdown</Button>
        </Fragment>
    );
};

/////////////////////////////

export default {
    view: DemoComponent,
};
