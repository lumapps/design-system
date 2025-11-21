import { mdiMenu, mdiSettings } from '@lumx/icons';
import {
    Button,
    Emphasis,
    FlexBox,
    Heading,
    IconButton,
    List,
    ListItem,
    Orientation,
    Placement,
    PopoverDialog,
    Size,
    Toolbar,
    Typography,
} from '@lumx/react';
import { useRef, useState } from 'react';

export const App = ({ theme }: any) => {
    const anchorRef = useRef(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleClose = () => {
        setIsOpen(false);
    };

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
                placement={Placement.BOTTOM}
                offset={{ away: 8 }}
            >
                <FlexBox orientation={Orientation.vertical}>
                    <Toolbar
                        label={
                            <Heading id="dialogHeaderId" typography={Typography.subtitle2}>
                                Popover Dialog Example
                            </Heading>
                        }
                        after={<IconButton label="Settings" icon={mdiSettings} emphasis={Emphasis.low} />}
                    />
                    <List>
                        <ListItem size={Size.huge} after={<IconButton label="Menu" icon={mdiMenu} size={Size.s} />}>
                            List Item With Actions
                        </ListItem>
                        <ListItem
                            size={Size.huge}
                            linkProps={{
                                href: 'http://google.com',
                            }}
                        >
                            Clickable list item
                        </ListItem>
                    </List>
                </FlexBox>
            </PopoverDialog>
        </>
    );
};
