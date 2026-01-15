import { useRef, useState } from 'react';
import { mdiMenu, mdiSettings } from '@lumx/icons';
import { Button, FlexBox, Heading, IconButton, List, ListItem, PopoverDialog, Toolbar, Theme } from '@lumx/react';

export default ({ theme }: { theme?: Theme }) => {
    const anchorRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            <Button ref={anchorRef} theme={theme} onClick={() => setIsOpen((current) => !current)}>
                Open popover
            </Button>
            <PopoverDialog
                aria-labelledby="dialogHeaderId"
                anchorRef={anchorRef}
                isOpen={isOpen}
                onClose={handleClose}
                placement="bottom"
                offset={{ away: 8 }}
            >
                <FlexBox orientation="vertical">
                    <Toolbar
                        label={
                            <Heading id="dialogHeaderId" typography="subtitle2">
                                Popover Dialog Example
                            </Heading>
                        }
                        after={<IconButton label="Settings" icon={mdiSettings} emphasis="low" />}
                    />
                    <List>
                        <ListItem size="huge" after={<IconButton label="Menu" icon={mdiMenu} size="s" />}>
                            List Item With Actions
                        </ListItem>
                        <ListItem size="huge" linkProps={{ href: 'http://google.com' }}>
                            Clickable list item
                        </ListItem>
                    </List>
                </FlexBox>
            </PopoverDialog>
        </>
    );
};
