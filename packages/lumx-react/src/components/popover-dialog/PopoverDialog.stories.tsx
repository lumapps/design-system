/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { useBooleanState } from '@lumx/react/hooks/useBooleanState';
import { mdiMenuDown } from '@lumx/icons';
import { setup } from '@lumx/core/js/components/PopoverDialog/Stories';
import { Button, IconButton } from '../button';
import { PopoverDialog } from '.';

const { meta, ...stories } = setup({
    component: PopoverDialog,
    /**
     * Default render: opens PopoverDialog using a Button trigger.
     */
    render: ({ label, ...props }: any) => {
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
                    label={label}
                    {...props}
                >
                    <Button onClick={close}>Close</Button>
                    <Button emphasis="medium">Other button</Button>
                </PopoverDialog>
            </>
        );
    },
});

export default {
    title: 'LumX components/popover-dialog/PopoverDialog',
    ...meta,
};

export const WithButtonTrigger = { ...stories.WithButtonTrigger };

/**
 * Example PopoverDialog using an icon button as a trigger
 */
export const WithIconButtonTrigger = {
    ...stories.WithIconButtonTrigger,
    render: ({ label, children, ...props }: any) => {
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
                    label={label}
                    {...props}
                >
                    <Button onClick={close}>Close</Button>
                    {children}
                </PopoverDialog>
            </>
        );
    },
};
