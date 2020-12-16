import range from 'lodash/range';
import React, { useRef, useState } from 'react';

import { mdiHome } from '@lumx/icons';
import {
    Alignment,
    Button,
    Dropdown,
    FlexBox,
    IconButton,
    List,
    ListItem,
    Orientation,
    Placement,
    Size,
} from '@lumx/react';

export default { title: 'LumX components/dropdown/Dropdown' };

export const MatchAnchorWithMinWidth = () => {
    const buttonRef1 = useRef<any>(null);
    const buttonRef2 = useRef<any>(null);
    return (
        <>
            <div>Match anchor width only if the dropdown is smaller</div>
            <FlexBox orientation={Orientation.horizontal}>
                <IconButton label="Home" icon={mdiHome} ref={buttonRef1} />
                <Dropdown anchorRef={buttonRef1} isOpen>
                    Big dropdown
                </Dropdown>

                <FlexBox marginAuto={Alignment.left}>
                    <Button ref={buttonRef2}>Big button with long text</Button>
                </FlexBox>
                <Dropdown anchorRef={buttonRef2} isOpen>
                    Small Dropdown
                </Dropdown>
            </FlexBox>
        </>
    );
};

export const LongPagePlacement = () => {
    const anchorFirstRef = React.useRef(null);
    const [isFirstOpen, setFirstIsOpen] = React.useState(false);
    const toggleFirstMenu = () => setFirstIsOpen(!isFirstOpen);
    const closeFirstMenu = () => setFirstIsOpen(false);

    const onFirstMenuSelected = (item: string) => () => {
        console.log('selected item', item);
        closeFirstMenu();
    };

    const anchorSecondRef = React.useRef(null);
    const [isSecondOpen, setSecondIsOpen] = React.useState(false);
    const toggleSecondMenu = () => setSecondIsOpen(!isSecondOpen);
    const closeSecondMenu = () => setSecondIsOpen(false);

    const onSecondMenuSelected = (item: string) => () => {
        console.log('selected item', item);
        closeSecondMenu();
    };

    const anchorThirdRef = React.useRef(null);
    const [isThirdOpen, setThirdIsOpen] = React.useState(false);
    const toggleThirdMenu = () => setThirdIsOpen(!isThirdOpen);
    const closeThirdMenu = () => setThirdIsOpen(false);

    const onThirdMenuSelected = (item: string) => () => {
        console.log('selected item', item);
        closeThirdMenu();
    };

    return (
        <div className="demo-grid">
            Scroll down and open the dropdown.
            <div style={{ marginTop: '100px' }}>
                <Button ref={anchorFirstRef} onClick={toggleFirstMenu}>
                    First Menu
                </Button>

                <Dropdown
                    closeOnClickAway
                    closeOnEscape
                    isOpen={isFirstOpen}
                    onClose={closeFirstMenu}
                    placement={Placement.BOTTOM_START}
                    anchorRef={anchorFirstRef}
                >
                    <List isClickable>
                        <ListItem onItemSelected={onFirstMenuSelected('losangeles')} size={Size.tiny}>
                            Los Angeles
                        </ListItem>

                        <ListItem onItemSelected={onFirstMenuSelected('monterrey')} size={Size.tiny}>
                            Monterrey
                        </ListItem>

                        <ListItem onItemSelected={onFirstMenuSelected('georgetown')} size={Size.tiny}>
                            Georgetown
                        </ListItem>

                        <ListItem onItemSelected={onFirstMenuSelected('cali')} size={Size.tiny}>
                            Cali
                        </ListItem>

                        <ListItem onItemSelected={onFirstMenuSelected('trondheim')} size={Size.tiny}>
                            Trondheim
                        </ListItem>
                    </List>
                </Dropdown>
            </div>
            <div style={{ marginTop: '1000px' }}>
                <Button ref={anchorSecondRef} onClick={toggleSecondMenu}>
                    Second Menu
                </Button>

                <Dropdown
                    closeOnClickAway
                    closeOnEscape
                    isOpen={isSecondOpen}
                    onClose={closeSecondMenu}
                    placement={Placement.BOTTOM_START}
                    anchorRef={anchorSecondRef}
                >
                    <List isClickable>
                        <ListItem onItemSelected={onSecondMenuSelected('losangeles')} size={Size.tiny}>
                            Los Angeles
                        </ListItem>

                        <ListItem onItemSelected={onSecondMenuSelected('monterrey')} size={Size.tiny}>
                            Monterrey
                        </ListItem>

                        <ListItem onItemSelected={onSecondMenuSelected('georgetown')} size={Size.tiny}>
                            Georgetown
                        </ListItem>

                        <ListItem onItemSelected={onSecondMenuSelected('cali')} size={Size.tiny}>
                            Cali
                        </ListItem>

                        <ListItem onItemSelected={onSecondMenuSelected('trondheim')} size={Size.tiny}>
                            Trondheim
                        </ListItem>
                    </List>
                </Dropdown>
            </div>
            <div style={{ marginTop: '2000px' }}>
                <Button ref={anchorThirdRef} onClick={toggleThirdMenu}>
                    Third Menu
                </Button>

                <Dropdown
                    closeOnClickAway
                    closeOnEscape
                    isOpen={isThirdOpen}
                    onClose={closeThirdMenu}
                    placement={Placement.BOTTOM_START}
                    anchorRef={anchorThirdRef}
                >
                    <List isClickable>
                        <ListItem onItemSelected={onThirdMenuSelected('losangeles')} size={Size.tiny}>
                            Los Angeles
                        </ListItem>

                        <ListItem onItemSelected={onThirdMenuSelected('monterrey')} size={Size.tiny}>
                            Monterrey
                        </ListItem>

                        <ListItem onItemSelected={onThirdMenuSelected('georgetown')} size={Size.tiny}>
                            Georgetown
                        </ListItem>

                        <ListItem onItemSelected={onThirdMenuSelected('cali')} size={Size.tiny}>
                            Cali
                        </ListItem>

                        <ListItem onItemSelected={onThirdMenuSelected('trondheim')} size={Size.tiny}>
                            Trondheim
                        </ListItem>
                    </List>
                </Dropdown>
            </div>
        </div>
    );
};
LongPagePlacement.parameters = {
    // Disables Chromatic snapshot (not relevant for this story).
    chromatic: { disable: true },
};

export const InfiniteScroll = () => {
    const buttonRef = useRef(null);
    const [items, setItems] = useState(range(10));
    const onInfiniteScroll = () => {
        setItems([...items, ...range(items.length, items.length + 10)]);
    };

    return (
        <>
            <Button ref={buttonRef}>Anchor</Button>
            <Dropdown anchorRef={buttonRef} isOpen onInfiniteScroll={onInfiniteScroll}>
                <List>
                    {items.map((item) => (
                        <ListItem key={item}>{item}</ListItem>
                    ))}
                </List>
            </Dropdown>
        </>
    );
};
InfiniteScroll.parameters = {
    // Disables Chromatic snapshot (not relevant for this story).
    chromatic: { disable: true },
};
