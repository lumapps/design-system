import React, { CSSProperties, Fragment, ReactNode, useRef, useState } from 'react';

import { Button, Dropdown, List, ListItem, ListItemSizes, Placements } from 'LumX';
import { useClickAway } from 'LumX/core/react/hooks';

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
            <ListItem size={ListItemSizes.tiny}>Los Angeles</ListItem>
            <ListItem size={ListItemSizes.tiny}>Monterrey</ListItem>
            <ListItem size={ListItemSizes.tiny}>Georgetown</ListItem>
            <ListItem size={ListItemSizes.tiny}>Cali</ListItem>
            <ListItem size={ListItemSizes.tiny}>Trondheim</ListItem>
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
    const [isDropdownOpen, setIsDropdownOpen]: [boolean, (isOpen: boolean) => void] = useState<boolean>(true);
    const ddRef: React.RefObject<HTMLDivElement> = useRef(null);

    useClickAway(ddRef, () => {
        setIsDropdownOpen(false);
    });

    return (
        <Fragment>
            <div ref={ddRef} style={demoContainerStyle}>
                {/* Target */}
                <Dropdown
                    closeOnClick={true}
                    escapeClose={true}
                    position={Placements.BOTTOM_START}
                    showDropdown={isDropdownOpen}
                    toggleElement={createToggleElement('My target')}
                >
                    {(setIsOpen: (isOpen: boolean) => void): React.ReactNode => createSimpleMenuList(setIsOpen)}
                </Dropdown>
            </div>
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
