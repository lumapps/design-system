import { mdiMenuDown, mdiSort } from '@lumx/icons';
import { Button, Dropdown, Emphasis, List, ListItem, Placement, Size } from '@lumx/react';
import noop from 'lodash/noop';
import { useRef, useState } from 'react';

export const App = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const close = () => setIsOpen(false);
    const anchorRef = useRef(null);

    return (
        <>
            <Button emphasis={Emphasis.low} leftIcon={mdiSort} rightIcon={mdiMenuDown} ref={anchorRef} onClick={toggle}>
                Most relevant
            </Button>

            <Dropdown
                closeOnClickAway
                closeOnEscape
                isOpen={isOpen}
                onClose={close}
                placement={Placement.BOTTOM_END}
                anchorRef={anchorRef}
            >
                <List>
                    <ListItem size={Size.tiny} onItemSelected={noop} isSelected>
                        Most relevant
                    </ListItem>
                    <ListItem size={Size.tiny} onItemSelected={noop}>
                        Most recent
                    </ListItem>
                    <ListItem size={Size.tiny} onItemSelected={noop}>
                        Least recent
                    </ListItem>
                </List>
            </Dropdown>
        </>
    );
};
