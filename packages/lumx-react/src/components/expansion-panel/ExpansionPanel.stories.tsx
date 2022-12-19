import React from 'react';

import { Button, Dropdown, ExpansionPanel, List, ListItem, Placement, Size } from '@lumx/react';

export default { title: 'LumX components/expansion-panel/ExpansionPanel' };

export const ExpansionPanelInADropdown = () => {
    const anchorDropdownButton = React.useRef(null);

    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const closeDropdown = () => setIsDropdownOpen(false);

    const [isExpansionPanelOpen, setIsExpansionPanelOpen] = React.useState(false);

    const toggleExpansionPanel = (shouldOpen: boolean, evt: React.MouseEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        setIsExpansionPanelOpen(shouldOpen);
    };

    const onItemSelected = (item: string) => () => {
        console.log('selected item', item);
        closeDropdown();
    };

    return (
        <>
            <Button ref={anchorDropdownButton} onClick={toggleDropdown}>
                Open dropdown
            </Button>
            <Dropdown
                closeOnClickAway
                closeOnEscape
                isOpen={isDropdownOpen}
                onClose={closeDropdown}
                placement={Placement.BOTTOM_START}
                anchorRef={anchorDropdownButton}
            >
                <List>
                    <ListItem onItemSelected={onItemSelected('paris')} size={Size.tiny}>
                        Paris
                    </ListItem>
                    <ExpansionPanel
                        label="Lorem ipsum"
                        isOpen={isExpansionPanelOpen}
                        onToggleOpen={(shouldOpen, event) => toggleExpansionPanel(shouldOpen, event)}
                        toggleButtonProps={{ label: 'Toggle' }}
                    >
                        <header>
                            <ListItem size={Size.tiny}>United States</ListItem>
                        </header>
                        <ListItem onItemSelected={onItemSelected('georgetown')} size={Size.tiny}>
                            Georgetown
                        </ListItem>

                        <ListItem onItemSelected={onItemSelected('newyork')} size={Size.tiny}>
                            New York
                        </ListItem>
                    </ExpansionPanel>
                </List>
            </Dropdown>
        </>
    );
};
