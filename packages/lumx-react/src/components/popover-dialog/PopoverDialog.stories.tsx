import { mdiMenu } from '@lumx/icons/index';
import { mdiSettings } from '@lumx/icons/v4-to-v5-aliases';
import React, { useRef, useState } from 'react';
import { PopoverDialog, PopoverDialogProps } from '.';
import { Emphasis, Orientation, Size, Typography } from '..';
import { Button, IconButton } from '../button';
import { FlexBox } from '../flex-box';
import { Heading } from '../heading';
import { List, ListItem } from '../list';
import { Placement } from '../popover/Popover';
import { Toolbar } from '../toolbar';

const WithButton = (Story: any, context: any) => {
    const anchorRef = useRef(null);
    const [isOpen, setIsOpen] = useState<boolean>(context?.args?.isOpen || false);

    return (
        <>
            <Button ref={anchorRef} onClick={() => setIsOpen((current) => !current)}>
                Open popover
            </Button>
            <Story anchorRef={anchorRef} isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

const dialogHeaderId = 'dialog-header';

const DemoPopoverContent = () => (
    <FlexBox orientation={Orientation.vertical}>
        <Toolbar
            label={
                <Heading id="dialogHeaderId" typography={Typography.headline}>
                    Title
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
);

export default {
    title: 'LumX components/popover-dialog/PopoverDialog',
    component: PopoverDialog,
    decorators: [WithButton],
    args: {
        children: <DemoPopoverContent />,
        'aria-labelledby': dialogHeaderId,
        placement: Placement.BOTTOM,
    },
};

const Template = (args: PopoverDialogProps, context: any) => {
    const { anchorRef, isOpen, onClose } = context;
    return (
        <PopoverDialog {...args} anchorRef={anchorRef} isOpen={isOpen} onClose={onClose}>
            {args.children}
        </PopoverDialog>
    );
};

export const Default = Template.bind({});
