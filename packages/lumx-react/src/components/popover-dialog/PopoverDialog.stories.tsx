import React from 'react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { mdiMenuDown } from '@lumx/icons';
import { PopoverDialog } from '.';
import { Button, IconButton } from '../button';

export default {
    title: 'LumX components/popover-dialog/PopoverDialog',
    component: PopoverDialog,
    parameters: { chromatic: { disableSnapshot: true } },
    tags: ['!snapshot'],
};

/**
 * Example PopoverDialog using a button as a trigger
 */
export const WithButtonTrigger = (props: any) => {
    const anchorRef = React.useRef(null);
    const [isOpen, close, open] = useBooleanState(false);

    return (
        <>
            <Button ref={anchorRef} onClick={open}>
                Open popover
            </Button>
            <PopoverDialog
                anchorRef={anchorRef}
                isOpen={isOpen}
                onClose={close}
                placement="bottom"
                className="lumx-spacing-padding-huge"
                {...props}
            >
                <Button onClick={close}>Close</Button>
                <Button emphasis="medium">Other button</Button>
            </PopoverDialog>
        </>
    );
};

/**
 * Example PopoverDialog using an icon button as a trigger
 */
export const WithIconButtonTrigger = ({ children, ...props }: any) => {
    const anchorRef = React.useRef(null);
    const [isOpen, close, open] = useBooleanState(false);

    return (
        <>
            <IconButton label="Open popover" ref={anchorRef} onClick={open} icon={mdiMenuDown} />
            <PopoverDialog
                anchorRef={anchorRef}
                isOpen={isOpen}
                onClose={close}
                placement="bottom"
                className="lumx-spacing-padding-huge"
                label="Example popover"
                {...props}
            >
                <Button onClick={close}>Close</Button>
                {children}
            </PopoverDialog>
        </>
    );
};
